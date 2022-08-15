/**
 *  run controller
 */

import { factories } from "@strapi/strapi";
import { ApiRunRun, GetModel } from "../../../../schemas";
import { RaceService } from "../../race/services/race";
import { HelloAssoService } from "../services/hello-asso";

export default factories.createCoreController("api::run.run", ({ strapi }) => ({
  async create(ctx) {
    const { data } = ctx.request.body;
    const [exists] = await strapi.entityService.findMany("api::run.run", {
      populate: {
        runner: {
          filters: { id: data.runner }
        }
      }
    });
    if (exists) {
      const sanitizedEntity = await this.sanitizeOutput(exists, ctx);
      return this.transformResponse(sanitizedEntity);
    }
    return super.create(ctx);
  },

  async createFromGScript(ctx) {
    const { date } = ctx.params;
    const startDate = [date.slice(0, 4), date.slice(4, 6), date.slice(6)].join(
      "-"
    );
    const [race] = await strapi.entityService.findMany("api::race.race", {
      filters: { startDate },
    });
    if (!race)
      return {
        data: null,
        error: {
          status: 404,
          message: "No race found for date " + startDate,
        },
      };
    const { numberSign } = ctx.request.body.data;
    const [exists] = await strapi.entityService.findMany("api::run.run", {
      filters: {
        numberSign,
      },
      populate: {
        race: {
          filters: {
            id: race.id,
          },
        },
      },
    });
    if (exists) {
      const sanitized = await this.sanitizeOutput(exists, ctx);
      return this.transformResponse(sanitized);
    }

    ctx.request.body.data.race = race.id;
    const run = await strapi.entityService.create(
      "api::run.run",
      ctx.request.body
    );
    const response = await this.sanitizeOutput(run, ctx);
    return this.transformResponse(response);
  },

  async register(ctx) {
    const { provider } = ctx.params;
    const { body } = ctx.request;
    const service = strapi.service<HelloAssoService>(`api::run.${provider}`);
    const race =
      body.race ||
      (await strapi.service<RaceService>("api::race.race").findRaceByDate());

    if (!race) return { data: [] };

    const ops = [] as Promise<GetModel<ApiRunRun>>[];
    for await (const runner of service.extractRunners(body)) {
      ops.push(service.registerRun(body, runner, race));
    }
    const runs = await Promise.all(ops);
    const sanitized = this.sanitizeOutput(runs, ctx);
    return this.transformResponse(sanitized);
  },
}));
