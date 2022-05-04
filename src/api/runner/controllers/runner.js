'use strict';

/**
 *  runner controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::runner.runner');
