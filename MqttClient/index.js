'use strict';

const mqtt  = require('async-mqtt');
const check = require('check-types-2');

class MqttClient {
  constructor(params) {
    Object.assign(this, params);
    check.assert.object(params, 'params is not an object');
    check.assert.string(params.url, 'params.url is not an object');
  }

  async init(handleMessage) {
    this.client = await mqtt.connectAsync(this.url);

    this.client.on('message', async(topic, messageBuffer) => {
      try {
        const data = JSON.parse(messageBuffer.toString());

        await handleMessage(topic, data);
      } catch(err) {
        this.logger.error(`Failed to parse mqtt message for '${topic}': ${messageBuffer.toString()}`, err);
      }
    });
  }

  async publish(topic, data, options = {}) {
    await this.client.publish(topic, JSON.stringify({
      ...data,
      since: new Date(),
    }), options);
  }

  async subscribe(topic) {
    await this.client.subscribe(topic);
    this.logger.debug(`Subscribed to ${topic}`);
  }
}

module.exports = MqttClient;
