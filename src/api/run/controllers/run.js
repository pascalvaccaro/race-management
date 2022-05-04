'use strict';

/**
 *  run controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::run.run');
