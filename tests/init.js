'use strict';

const log4js     = require('log4js');
const logger = log4js.getLogger();
const rpio       = require('rpio');
rpio.init({mapping: 'gpio'});


logger.level = 'trace';

const init = async function() {
  return {
    logger,
  };
};

module.exports = init;
