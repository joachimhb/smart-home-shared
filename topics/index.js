'use strict';

const shutterMovement  = (room, shutter) => `room/${room}/shutters/${shutter}/movement`;
const shutterStatus    = (room, shutter) => `room/${room}/shutters/${shutter}/status`;
const windowOpenStatus = (room, window) => `room/${room}/windows/${window}`;

const fanControl = (room, fan) => `room/${room}/fans/${fan}/control`;
const fanSpeed   = (room, fan) => `room/${room}/fans/${fan}/speed`;

const light = (room, lightId) => `room/${room}/lights/${lightId}`;

const temperature = room => `room/${room}/temperature`;
const humidity    = room => `room/${room}/humidity`;

module.exports = {
  shutterMovement,
  shutterStatus,
  windowOpenStatus,

  fanControl,
  fanSpeed,

  temperature,
  humidity,
  light,
};
