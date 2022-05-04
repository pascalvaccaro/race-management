'use strict';

/**
 * runner router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::runner.runner');
