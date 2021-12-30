'use strict';

// living rooms
const shutterInit     = (room, shutter) => `room/${room}/shutters/${shutter}/init`;
const shutterMovement = (room, shutter) => `room/${room}/shutters/${shutter}/movement`;
const shutterStatus   = (room, shutter) => `room/${room}/shutters/${shutter}/status`;
const shutterToggle   = (room, shutter) => `room/${room}/shutters/${shutter}/toggle`;
const shutterUp       = (room, shutter) => `room/${room}/shutters/${shutter}/up`;
const shutterDown     = (room, shutter) => `room/${room}/shutters/${shutter}/down`;
const shutterStop     = (room, shutter) => `room/${room}/shutters/${shutter}/stop`;
const shutterMoveTo   = (room, shutter) => `room/${room}/shutters/${shutter}/moveTo`;

// bath rooms
const fanControl              = (room, fan) => `room/${room}/fans/${fan}/control`;
const fanSpeed                = (room, fan) => `room/${room}/fans/${fan}/speed`;
const fanTrailingTime         = (room, fan) => `room/${room}/fans/${fan}/trailingTime`;
const fanMinRunTime           = (room, fan) => `room/${room}/fans/${fan}/minRunTime`;
const fanLightTimeout         = (room, fan) => `room/${room}/fans/${fan}/lightTimeout`;
const fanMinHumidityThreshold = (room, fan) => `room/${room}/fans/${fan}/minHumidityThreshold`;
const fanMaxHumidityThreshold = (room, fan) => `room/${room}/fans/${fan}/maxHumidityThreshold`;

// general
const lightStatus     = (room, light) => `room/${room}/lights/${light}/status`;
const windowStatus    = (room, window) => `room/${room}/windows/${window}/status`;
const roomTemperature = room => `room/${room}/temperature`;
const roomHumidity    = room => `room/${room}/humidity`;
const buttonOpen      = (room, shutter) => `room/${room}/buttons/${shutter}/open`;
const buttonClosed    = (room, shutter) => `room/${room}/buttons/${shutter}/closed`;
const buttonActive    = (room, shutter) => `room/${room}/buttons/${shutter}/active`;


module.exports = {
  shutterInit,
  shutterUp,
  shutterDown,
  shutterStop,
  shutterMovement,
  shutterStatus,
  // ???
  shutterMoveTo,
  shutterToggle,
  
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
