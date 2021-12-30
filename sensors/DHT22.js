'use strict';

const check = require('check-types-2');
const dht   = require('pigpio-dht');

class DHT22 {
  constructor(params) {
    check.assert.object(params, 'params is not an object');
    check.assert.number(params.gpio, 'params.gpio is not a number');
    check.assert.string(params.location, 'params.location is not a string');
    check.assert.object(params.logger, 'params.logger is not an object');
    check.assert.function(params.onHumidityChange, 'params.onHumidityChange is not a function');
    check.assert.function(params.onTemperatureChange, 'params.onTemperatureChange is not a function');

    Object.assign(this, params);

    this.interval                = this.interval || 5000;
    this.humidity                = 0;
    this.lastNotifiedHumidity    = 0;
    this.temperature             = 0;
    this.lastNotifiedTemperature = 0;

    this.sensor = dht(this.gpio, 22);

    this.logger.debug(`Initializing DHT22 at ${this.location} at [${this.gpio}] with interval ${this.interval}ms`);

    this.sensor.on('result', data => {
      let {humidity, temperature} = data;

      humidity = Math.round(humidity);
      temperature = Math.round(temperature * 10) / 10;

      this.logger.trace(`Humidity at ${this.location}: ${humidity}`);
      this.logger.trace(`Temperature at ${this.location}: ${temperature}`);

      if(this.humidity !== humidity && typeof this.onHumidityChange === 'function') {
        const humidityNotifyDiff = Math.abs(this.lastNotifiedHumidity - humidity);

        if(humidityNotifyDiff >= 2) {
          this.lastNotifiedHumidity = humidity;

          this.onHumidityChange(humidity);
        }
      }

      this.humidity = humidity;

      
      if(this.temperature !== temperature && typeof this.onTemperatureChange === 'function') {
        const temperatureNotifyDiff = Math.abs(this.lastNotifiedTemperature - temperature);

        if(temperatureNotifyDiff >= 0.2) {
          this.lastNotifiedTemperature = temperature;

          this.onTemperatureChange(temperature);
        }
      }

      this.temperature = temperature;
    });

    this.sensor.on('badChecksum', err => {
      this.logger.warn(`DHT22: checksum failed at ${this.location}`, err);
    });
  }

  start() {
    if(this.active) {
      return;
    }

    this.active = true;

    this.logger.debug(`Starting DHT22 interval (${this.interval}ms) at ${this.location}...`);

    this.readInterval = setInterval(this.sensor.read, this.interval);
  }

  stop() {
    this.active = false;

    if(this.readInterval) {
      clearInterval(this.readInterval);
    }
  }
}

module.exports = DHT22;
