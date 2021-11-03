'use strict';

const Circuit = require('../sensors/Circuit');

class Switch {
  constructor(params) {
    check.assert.object(params, 'params is not an object');
    check.assert.number(params.gpio, 'params.gpio is not a number');
    check.assert.string(params.location, 'params.location is not a string');
    check.assert.object(params.logger, 'params.logger is not an object');

    Object.assign(this, params);

    this.active = this.active === false ? false : true;

    this.logger.debug(`Initializing Switch at ${this.location} at [${this.gpio}] with interval ${this.interval}ms - active: ${this.active}`);

    this.circuit = new Circuit({
      gpio: this.gpio,
      location: this.location,
      logger: this.logger,
      default: this.default,
      interval: this.interval,
      onchange: value => {
        if(value === 'open') {
          if(typeof this.onOpen === 'function') {
            this.onClose();
          }
        } else if(value === 'open') {
          if(typeof this.onOpen === 'function') {
            this.onClose();
          }
        }
      }
    });

    if(this.active) {
      this.circuit.start();
    }
  }
}

module.exports = Switch;
