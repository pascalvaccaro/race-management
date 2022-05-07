'use strict';

/**
 *  runner controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::runner.runner', ({ strapi }) => ({
  async create(ctx) {
    const { firstName, lastName, email } = ctx.request.body.data;
    const [data] = await strapi.entityService.findMany('api::runner.runner', {
      filters: {
        $and: [
          { firstName, lastName, email }
        ]
      }
    });

    return data ? { data } : super.create(ctx);
  }
}));
