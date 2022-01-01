'use strict';

const init = require('./init');

const Circuit = require('../sensors/Circuit');

const gpio = 16;

(async function() {
  console.log(`Starting circuit test`);

  try {
    const {logger} = await init();

    logger.info(`Circuit`);

    const circuit = new Circuit({
      logger,
      location: `TEST`,
      // interval: 150,
      gpio: gpio,
      onChange: async value => {
        logger.info('CHANGE', value);
      },
    });

    circuit.start();
  } catch(err) {
    console.error('Failed to start circuit test', err);
  }
}());
