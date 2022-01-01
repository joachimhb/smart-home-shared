'use strict';

const check = require('check-types-2');
const rpio  = require('rpio');

rpio.init({mapping: 'gpio'});

class IntervalCircuit {
  constructor(params) {
    check.assert.object(params, 'params is not an object');
    check.assert.number(params.gpio, 'params.gpio is not a number');
    check.assert.string(params.location, 'params.location is not a string');
    check.assert.object(params.logger, 'params.logger is not an object');

    Object.assign(this, params);

    this.interval = this.interval || 500;
    this.value = this.default || 'open';
    this.read = this.read.bind(this);

    this.logger.debug(`Initializing IntervalCircuit at ${this.location} at [${this.gpio}] with interval ${this.interval}ms`);
  }

  read() {
    const bool = !rpio.read(this.gpio);

    const value = bool ? 'closed' : 'open';

    this.logger.trace(`IntervalCircuit at ${this.location} is: ${value}`);

    // rpio.close(this.gpio);

    if(this.lastNotifiedValue !== value && typeof this.onChange === 'function') {
      this.lastNotifiedValue = value;
      this.onChange(value);
    }

    this.value = value;
  }

  start() {
    if(this.active) {
      return;
    }

    this.active = true;

    rpio.open(this.gpio, rpio.INPUT, rpio.PULL_UP);

    // this.logger.trace(`IntervalCircuit initial read...`);
    // this.read();
    this.logger.debug(`Starting IntervalCircuit interval at ${this.location}...`);

    this.readInterval = setInterval(this.read, this.interval);
  }

  stop() {
    this.active = false;

    this.logger.debug(`Stopping IntervalCircuit interval at ${this.location}...`);

    if(this.readInterval) {
      clearInterval(this.readInterval);
    }
  }
}

module.exports = IntervalCircuit;
