'use strict';

const DHT22      = require('./sensors/DHT22');
const Light      = require('./sensors/Light');
const Circuit    = require('./sensors/Circuit');
const Shutter    = require('./controls/Shutter');
const Fan        = require('./controls/Fan');
const Switch     = require('./controls/Switch');
const MqttClient = require('./MqttClient/');
const topics     = require('./topics/');

module.exports = {
  sensors: {
    DHT22,
    Light,
    Circuit,
  },
  controls: {
    Shutter,
    Fan,
    Switch,
  },
  MqttClient,
  topics,
};
