'use strict';

/**
 * park service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::park.park');
