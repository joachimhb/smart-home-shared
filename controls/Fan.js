'use strict';

const rpio  = require('rpio');
const check = require('check-types-2');

rpio.init({mapping: 'gpio'});

class Fan {
  constructor(params) {
    check.assert.object(params, 'params is not an object');
    check.assert.object(params.logger, 'params.logger is not an object');
    check.assert.string(params.location, 'params.location is not a string');
    check.assert.number(params.powerGpio, 'params.powerGpio is not a number');
    check.assert.number(params.speedGpio, 'params.speedGpio is not a number');
    check.assert.maybe.string(params.status, 'params.status is not a string');

    Object.assign(this, params);

    this.status = this.status || 'off';

    this.logger.debug(`Initiated Fan at [${this.location}]: power[${this.powerGpio}] / speedGpio[${this.speedGpio}] - ${this.status}`);

    this.status = params.status || 'off';

    rpio.open(this.powerGpio, rpio.OUTPUT, rpio.HIGH);
    rpio.open(this.speedGpio, rpio.OUTPUT, rpio.HIGH);

    if(this.status) {
      this[this.status]();
    }
  }

  off() {
    this.powerOff();
  }

  min() {
    this.minSpeed();
    this.powerOn();
  }

  max() {
    this.maxSpeed();
    this.powerOn();
  }

  powerOn() {
    this.logger.debug(`Fan.powerOn at ${this.location} - ${this.powerGpio} -> LOW`);
    rpio.write(this.powerGpio, rpio.LOW);
  }

  powerOff() {
    this.logger.debug(`Fan.powerOff at ${this.location} - ${this.powerGpio} -> HIGH`);
    rpio.write(this.powerGpio, rpio.HIGH);
  }

  minSpeed() {
    this.logger.debug(`Fan.minSpeed at ${this.location} - ${this.speedGpio} -> HIGH`);
    rpio.write(this.speedGpio, rpio.HIGH);
  }

  maxSpeed() {
    this.logger.debug(`Fan.maxSpeed at ${this.location} - ${this.speedGpio} -> LOW`);
    rpio.write(this.speedGpio, rpio.LOW);
  }
}

module.exports = Fan;
