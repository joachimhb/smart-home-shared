'use strict';

const init = require('./init');

const {Button} = require('../index.js').controls;

const rpio = require('rpio');

rpio.init({mapping: 'gpio'});

const gpio = 3;
const transGpio = 2;

(async function() {
  console.log(`Starting button test`);

  rpio.open(transGpio, rpio.OUTPUT, rpio.HIGH);

  try {
    const {logger} = await init();

    logger.info(`Button`);

    const button = new Button({
      logger,
      location: `TEST`,
      gpio: gpio,
      onClose: async () => {
        rpio.write(transGpio, rpio.HIGH);
        logger.info('CLOSED');
      },
      onOpen: async () => {
        rpio.write(transGpio, rpio.LOW);
        logger.info('OPENED');
      }
    });

    button.start();
  } catch(err) {
    console.error('Failed to start button test', err);
  }
}());
