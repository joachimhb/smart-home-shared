'use strict';

const Circuit = require('../sensors/Circuit');

class Button {
  constructor(params) {
    check.assert.object(params, 'params is not an object');
    check.assert.number(params.gpio, 'params.gpio is not a number');
    check.assert.string(params.location, 'params.location is not a string');
    check.assert.object(params.logger, 'params.logger is not an object');

    Object.assign(this, params);

    this.logger.debug(`Initializing Button at ${this.location} at [${this.gpio}] with interval ${this.interval}ms - active: ${this.active}`);

    this.circuit = new Circuit({
      gpio: this.gpio,
      location: this.location,
      logger: this.logger,
      default: this.default,
      interval: this.interval,
      onChange: value => {
        if(value === 'open') {
          if(typeof this.onOpen === 'function') {
            this.onClose();
          }
        } else if(value === 'open') {
          if(typeof this.onOpen === 'function') {
            this.onOpen();
          }
        }
      }
    });
  }

  start() {
    if(this.active) {
      return;
    }

    this.active = true;

    this.circuit.start();
  }

  stop() {
    this.active = false;

    this.circuit.stop();
  }
}

module.exports = Button;
