'use strict';

// living rooms
const shutterInit      = (room, shutter) => `room/${room}/shutters/${shutter}/init`;
const shutterMovement  = (room, shutter) => `room/${room}/shutters/${shutter}/movement`;
const shutterStatus    = (room, shutter) => `room/${room}/shutters/${shutter}/status`;
const shutterToggle    = (room, shutter) => `room/${room}/shutters/${shutter}/toggle`;
const shutterMoveTo    = (room, shutter) => `room/${room}/shutters/${shutter}/moveTo`;

const buttonOpen       = (room, shutter) => `room/${room}/buttons/${shutter}/open`;
const buttonClosed     = (room, shutter) => `room/${room}/buttons/${shutter}/closed`;
const buttonActive     = (room, shutter) => `room/${room}/buttons/${shutter}/active`;

// bath rooms
const fanControl   = (room, fan) => `room/${room}/fans/${fan}/control`;
const fanSpeed     = (room, fan) => `room/${room}/fans/${fan}/speed`;
const fanTrailingTime = (room, fan) => `room/${room}/fans/${fan}/trailingTime`;
const fanMinRunTime   = (room, fan) => `room/${room}/fans/${fan}/minRunTime`;
const fanLightTimeout = (room, fan) => `room/${room}/fans/${fan}/lightTimeout`;
const fanMinHumidityThreshold = (room, fan) => `room/${room}/fans/${fan}/minHumidityThreshold`;
const fanMaxHumidityThreshold = (room, fan) => `room/${room}/fans/${fan}/maxHumidityThreshold`;

// room
const lightStatus     = (room, light) => `room/${room}/lights/${light}/status`;
const windowStatus    = (room, window) => `room/${room}/windows/${window}/status`;
const roomTemperature = room => `room/${room}/temperature`;
const roomHumidity    = room => `room/${room}/humidity`;

module.exports = {
  shutterInit,
  shutterMovement,
  shutterStatus,
  shutterToggle,
  shutterMoveTo,
  
  buttonOpen,
  buttonClosed,
  buttonActive,

  fanControl,
  fanSpeed,
  fanTrailingTime,
  fanMinRunTime,
  fanLightTimeout,
  fanMinHumidityThreshold,
  fanMaxHumidityThreshold,

  windowStatus,
  
  lightStatus,

  roomTemperature,
  roomHumidity,
};
