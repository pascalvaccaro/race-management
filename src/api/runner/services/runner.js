'use strict';

/**
 * runner service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::runner.runner');
