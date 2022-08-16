/**
 *  runner controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::runner.runner', ({ strapi }) => ({
  async create(ctx) {
    const { email, firstname, lastname } = ctx.request.body.data;
    const fullname = firstname + ' ' + lastname;
    const [exists] = await strapi.entityService.findMany('api::runner.runner', { filters: { email: { $eqi: email }, fullname: { $eqi: fullname } }});
    if (exists) {
      const sanitized = await this.sanitizeOutput(exists, ctx);
      return this.transformResponse(sanitized);
    }

    const [parent] = await strapi.entityService.findMany('api::runner.runner', {
      filters: { email },
      populate: {
        parent: {
          populate: 'children',
          filters: { id: { $null: true }, children: { fullname: { $ne: fullname }}},
        }
      }
    });

    if (parent) {
      ctx.request.body.data.email = null;
      ctx.request.body.data.parent = parent.id;
    }

    return super.create(ctx);
  }
}));
