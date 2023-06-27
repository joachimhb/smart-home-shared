'use strict';

const     _ = require('lodash');
const check = require('check-types-2');
const delay = require('delay');
const rpio  = require('rpio');

rpio.init({mapping: 'gpio'});

class Shutter {
  constructor(params) {
    check.assert.object(params, 'params is not an object');
    check.assert.object(params.logger, 'params.logger is not an object');
    check.assert.string(params.location, 'params.location is not a string');
    check.assert.number(params.powerGpio, 'params.powerGpio is not a number');
    check.assert.number(params.directionGpio, 'params.directionGpio is not a number');
    check.assert.number(params.fullCloseMs, 'params.fullCloseMs is not a number');
    check.assert.maybe.number(params.status, 'params.status is not a number');
    check.assert.maybe.string(params.movement, 'params.movement is not a string');

    Object.assign(this, params);

    this.onStatusUpdate   = this.onStatusUpdate   || _.noop;
    this.onMovementUpdate = this.onMovementUpdate || _.noop;

    this.tickMs         = params.fullCloseMs / 1000;
    this.max            = 100;
    this.status         = params.status || 0;
    this.movement       = 'stop'; // params.movement || 'stop';
    this.lastMovement   = 'down';
    this.commandBlockMs = 1000;

    this.lastReportedStatus = this.status;

    rpio.open(this.powerGpio, rpio.OUTPUT, rpio.HIGH);
    rpio.open(this.directionGpio, rpio.OUTPUT, rpio.HIGH);

    this.logger.debug(`Initiated Shutter at [${this.location}]: power[${this.powerGpio}] / direction[${this.directionGpio}] - ${this.status}/${this.movement}`);

    // if(this.movement === 'stop') {
    //   this.power = 'off';
    // }
    //  else {
    //   this.power = 'on';
    //   this.direction = this.movement;
    // }

    // if(this.movement) {
    //   this[this.movement]();
    // }
  }

  setMax(value) {
    this.logger.trace(`Shutter.up at ${this.location} setMax to ${value}%`);
    this.max = value;
  }

  stop() {
    this.logger.debug(`Shutter.stop at ${this.location}`);

    if(this.movement === 'stop') {
      return;
    }

    this.movement = 'stop';
    this.onMovementUpdate(this.movement);
    this._powerOff();
  }

  async up(options = {}) {
    this.logger.debug(`Shutter.up at ${this.location}`);

    if(this.movement === 'up') {
      return;
    }

    if(this.commandBlocked) {
      this.logger.debug(`Shutter.up at ${this.location} - BLOCKED`);
      return;
    }

    this._setCommandBlock();

    if(this.movement !== 'stop') {
      return await this.stop();
    }

    this.lastMovement = 'up';
    this.movement = 'up';
    this.onMovementUpdate(this.movement);

    await this._directionUp();
    await this._powerOn();

    if(this.movementDelayMs) {
      await delay(this.movementDelayMs);
    }

    while(this.movement === 'up') {
      await delay(this.tickMs);

      this.status -= 0.1;

      const rounded = Math.round(this.status);

      if(rounded !== this.lastReportedStatus) {
        this.onStatusUpdate(rounded);
      }

      this.logger.trace(`Shutter.up at ${this.location} ${this.status}%`);

      if(this.status < 0) {
        this.logger.debug(`Shutter.up at ${this.location} min of 0 reached`);
        if(options.force) {
          this.logger.warn(`Shutter.up with force`, this.status);
        } else {
          this.stop();
          this.onStatusUpdate(0); 
        }
      }
    }
  }

  async down(options = {}) {
    this.logger.debug(`Shutter.down at ${this.location}`);

    if(this.movement === 'down') {
      return;
    }

    if(this.commandBlocked) {
      this.logger.debug(`Shutter.down at ${this.location} - BLOCKED`);
      return;
    }

    this._setCommandBlock();

    if(this.movement !== 'stop') {
      return await this.stop();
    }

    this.lastMovement = 'down';
    this.movement = 'down';

    this.onMovementUpdate(this.movement);

    await this._directionDown();
    await this._powerOn();

    if(this.movementDelayMs) {
      await delay(this.movementDelayMs);
    }

    while(this.movement === 'down') {
      await delay(this.tickMs);

      this.status += 0.1;

      const rounded = Math.round(this.status);

      if(rounded !== this.lastReportedStatus) {
        this.onStatusUpdate(rounded);
      }

      this.logger.trace(`Shutter.down at ${this.location} ${this.status}%`);

      if(this.status > this.max) {
        this.logger.debug(`Shutter.down at ${this.location} max of ${this.max} reached`);
        if(options.force) {
          this.logger.warn(`Shutter.down with force`, this.status);
        } else {
          this.stop();
          this.onStatusUpdate(this.max);
        }
      }
    }
  }

  async toggle(options = {}) {
    if(this.movement !== 'stop') {
      return await this.stop(options);
    }

    if(this.lastMovement === 'up') {
      return await this.down(options);
    }

    if(this.lastMovement === 'down') {
      return await this.up(options);
    }
  }

  _setCommandBlock() {
    this.commandBlocked = true;

    setTimeout(() => {
      this.commandBlocked = false;
    }, this.commandBlockMs);
  }

  async _powerOn() {
    if(this.power !== 'on') {
      this.logger.debug(`Shutter._powerOn at ${this.location} - power ${this.powerGpio} -> LOW`);
      rpio.write(this.powerGpio, rpio.LOW);
      this.power = 'on';
      await delay(50);
    }
  }

  async _powerOff() {
    if(this.power !== 'off') {
      this.logger.debug(`Shutter._powerOff at ${this.location} - power ${this.powerGpio} -> HIGH`);
      rpio.write(this.powerGpio, rpio.HIGH);
      this.power = 'off';
      await delay(50);
      this.logger.debug(`Shutter._powerOff at ${this.location} - direction ${this.directionGpio} -> HIGH`);
      rpio.write(this.directionGpio, rpio.HIGH);
    }
  }

  async _directionUp() {
    this.logger.debug(`Shutter._directionUp at ${this.location} - direction ${this.directionGpio} -> HIGH`);
    rpio.write(this.directionGpio, rpio.HIGH);
    await delay(50);
  }

  async _directionDown() {
    this.logger.debug(`Shutter._directionDown at ${this.location} - direction ${this.directionGpio} -> LOW`);
    rpio.write(this.directionGpio, rpio.LOW);
    await delay(50);
  }
}

module.exports = Shutter;
