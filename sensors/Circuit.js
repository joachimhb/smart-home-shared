'use strict';

const check = require('check-types-2');
const rpio  = require('rpio');

rpio.init({mapping: 'gpio'});

class Circuit {
  constructor(params) {
    check.assert.object(params, 'params is not an object');
    check.assert.number(params.gpio, 'params.gpio is not a number');
    check.assert.string(params.location, 'params.location is not a string');
    check.assert.object(params.logger, 'params.logger is not an object');

    Object.assign(this, params);

    this.interval = this.interval || 500;
    this.value = this.default || 'open';
    this.read = this.read.bind(this);

    this.logger.debug(`Initializing Circuit at ${this.location} at [${this.gpio}] with interval ${this.interval}ms`);

    this.start();
  }

  read() {
    const bool = !rpio.read(this.gpio);

    const value = bool ? 'closed' : 'open';

    this.logger.trace(`Circuit at ${this.location} is: ${value}`);

    // rpio.close(this.gpio);

    if(this.value !== value && typeof this.onChange === 'function') {
      this.onChange(value);
    }

    this.value = value;
  }

  start() {
    rpio.open(this.gpio, rpio.INPUT, rpio.PULL_UP);

    // this.logger.trace(`Circuit initial read...`);
    // this.read();
    this.logger.trace(`Starting Circuit interval at ${this.location}...`);

    setInterval(this.read, this.interval);
  }
}

module.exports = Circuit;
