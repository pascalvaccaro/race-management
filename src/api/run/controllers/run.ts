/**
 *  run controller
 */

import { factories } from '@strapi/strapi'
import { ApiRunRun, GetModel } from '../../../../schemas';
import { RaceService } from '../../race/services/race';
import { HelloAssoService } from '../services/hello-asso';

export default factories.createCoreController('api::run.run', ({ strapi }) => ({
  async createFromGScript(ctx) {
    const { date } = ctx.params;
    const startDate = [date.slice(0, 4), date.slice(4, 6), date.slice(6)].join('-');
    const [race] = await strapi.entityService.findMany('api::race.race', {
      filters: { startDate }
    });
    if (!race) return {
      data: null,
      error: {
        status: 404,
        message: "No race found for date " + startDate,
      }
    };
    const { numberSign } = ctx.request.body.data;
    const [data] = await strapi.entityService.findMany('api::run.run', {
      filters: {
        numberSign,
      },
      populate: {
        race: {
          filters: {
            id: race.id
          }
        }
      },
    });
    if (data) {
      const sanitized = this.sanitizeOutput(data, ctx);
      return this.transformResponse(sanitized);
    }

    const response = await super.create(ctx);
    return response;
  },

  async register(ctx) {
    const { provider } = ctx.params;
    const { body } = ctx.request;
    const service = strapi.service<HelloAssoService>(`api::run.${provider}`);
    const race = body.race || await strapi.service<RaceService>('api::race.race').findRaceByDate();

    if (!race) return { data: [] };

    const ops = [] as Promise<GetModel<ApiRunRun>>[];
    for await (const runner of service.extractRunners(body)) {
      ops.push(service.registerRun(body, runner, race));
    }
    const runs = await Promise.all(ops);
    const sanitized = this.sanitizeOutput(runs, ctx);
    return this.transformResponse(sanitized);
  }
}));
