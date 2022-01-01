'use strict';

const init = require('./init');

const {Button} = require('../index.js').controls;

const rpio = require('rpio');

rpio.init({mapping: 'gpio'});

const gpio = 16;

(async function() {
  console.log(`Starting button test`);

  try {
    const {logger} = await init();

    logger.info(`Button`);

    const button = new Button({
      logger,
      location: `TEST`,
      gpio: gpio,
      interval: 100,
      onClose: async () => {
        logger.info('CLOSED');
      },
      onOpen: async () => {
        logger.info('OPENED');
      }
    });

    button.start();
  } catch(err) {
    console.error('Failed to start button test', err);
  }
}());
