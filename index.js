'use strict';

const DHT22      = require('./sensors/DHT22');
const Light      = require('./sensors/Light');
const Shutter    = require('./controls/Shutter');
const Fan        = require('./controls/Fan');
const MqttClient = require('./MqttClient/');
const topics     = require('./topics/');

module.exports = {
  sensors: {
    DHT22,
    Light,
  },
  controls: {
    Shutter,
    Fan,
  },
  MqttClient,
  topics,
};
