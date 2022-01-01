'use strict';

const check = require('check-types-2');

const Circuit = require('../sensors/Circuit');
const IntervalCircuit = require('../sensors/IntervalCircuit');

class Button {
  constructor(params) {
    check.assert.object(params, 'params is not an object');
    check.assert.number(params.gpio, 'params.gpio is not a number');
    check.assert.string(params.location, 'params.location is not a string');
    check.assert.object(params.logger, 'params.logger is not an object');

    Object.assign(this, params);

    this.logger.debug(`Initializing Button at ${this.location} at [${this.gpio}]`);

    const circuitParams = {
      gpio: this.gpio,
      location: this.location,
      logger: this.logger,
      default: this.default,
      interval: this.interval,
      onChange: value => {
        if(value === 'closed') {
          if(typeof this.onClose === 'function') {
            this.onClose();
          }
        } else if(value === 'open') {
          if(typeof this.onOpen === 'function') {
            this.onOpen();
          }
        }
      }
    };

    if(params.interval) {
      this.circuit = new IntervalCircuit(circuitParams);
    } else {
      this.circuit = new Circuit(circuitParams);
    }
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
