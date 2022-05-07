'use strict';

/**
 *  run controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::run.run', ({ strapi }) => ({
  async create(ctx) {
    const { numberSign, race } = ctx.request.body.data;
    const [data] = await strapi.entityService.findMany('api::run.run', {
      filters: {
        numberSign,
      },
      populate: {
        race: {
          filters: {
            id: race
          }
        }
      },
    });

    return data ? { data } : super.create(ctx);
  }
}));
