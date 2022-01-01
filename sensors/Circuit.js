'use strict';

const check = require('check-types-2');
const pigpio  = require('pigpio');

const {Gpio} = pigpio;

class Circuit {
  constructor(params) {
    check.assert.object(params, 'params is not an object');
    check.assert.number(params.gpio, 'params.gpio is not a number');
    check.assert.string(params.location, 'params.location is not a string');
    check.assert.object(params.logger, 'params.logger is not an object');

    Object.assign(this, params);

    this.value = this.default || 'open';

    this.control = new Gpio(this.gpio, {
      mode:       Gpio.INPUT,
      pullUpDown: Gpio.PUD_UP,
      alert:      true,
     edge:       Gpio.EITHER_EDGE, // interrupt on either edge
    //  timeout:    xxx milliseconds  // interrupt only
    });

    this.handleAlert = this.handleAlert.bind(this);

    this.control.on('alert', this.handleAlert);

    this.lastNotifiedValue = null;
    this.lastAlertDate = null;

    this.logger.debug(`Initializing Circuit at ${this.location} at [${this.gpio}]`);
  }

  handleAlert(state) {
    const now = new Date();

    const value = state ? 'open' : 'closed';

    const sinceLast = now - this.lastAlertDate;

    this.lastAlertDate = now;

    this.logger.trace(`Circuit at ${this.location} is: ${value} - since last: ${sinceLast}`);

    if(!this.active) {
      this.logger.warn(`Circuit at ${this.location} is inactive`);

      return;
    }
    
    // Debounce buttons causing alerts within a short time period.
    if(sinceLast < 100) { // 0.1 second
      // within debounceTime limit
      return;
    }

    this.logger.trace(`Circuit at ${this.location} is: ${value}`);

    if(this.lastNotifiedValue !== value && typeof this.onChange === 'function') {
      this.lastNotifiedValue = value;
      this.onChange(value);
    }
  }

  start() {
    this.active = true;
  }

  stop() {
    this.active = false;
  }
}

module.exports = Circuit;
