'use strict';

const check = require('check-types-2');
const rpio  = require('rpio');

rpio.init({mapping: 'gpio'});

class LightSensor {
  constructor(params) {
    check.assert.object(params, 'params is not an object');
    check.assert.number(params.gpio, 'params.gpio is not a number');
    check.assert.string(params.location, 'params.location is not a string');
    check.assert.object(params.logger, 'params.logger is not an object');
    check.assert.function(params.onChange, 'params.onChange is not a function');

    Object.assign(this, params);

    this.interval = this.interval || 2000;
    this.value    = 'off';
    this.read     = this.read.bind(this);

    this.logger.debug(`Initializing Light at ${this.location} at [${this.gpio}] with interval ${this.interval}ms`);
  }

  read() {
    rpio.open(this.gpio, rpio.INPUT);

    const bool = !rpio.read(this.gpio);

    const value = bool ? 'on' : 'off';

    this.logger.trace(`Light at ${this.location} is: ${value}`);

    rpio.close(this.gpio);

    if(this.value !== value && typeof this.onChange === 'function') {
      this.onChange(value);
    }

    this.value = value;
  }

  start() {
    if(this.active) {
      return;
    }

    this.active = true;

    this.logger.trace(`Starting LightSensor interval at ${this.location}...`);

    this.readInterval = setInterval(this.read, this.interval);
  }

  stop() {
    this.active = false;

    if(this.interval) {
      clearInterval(this.readInterval);
    }
  }
}

module.exports = LightSensor;
