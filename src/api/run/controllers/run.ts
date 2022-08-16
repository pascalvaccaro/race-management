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
    const { runner, race } = data;
    if (!race || !runner)
      return ctx.throw(400, { error: "race and runner and required" });

    let [entry] = await strapi.entityService.findMany("api::run.run", {
      filters: { runner, race },
      populate: {
        runner: true,
        race: { populate: { park: true } },
      },
    });
    if (!entry) {
      entry = await strapi.entityService.create("api::run.run", {
        data: ctx.request.body.data,
        ...ctx.query,
      });
    }

    const sanitizedEntity = await this.sanitizeOutput(entry, ctx);
    return this.transformResponse(sanitizedEntity);
  },

  async createFromGScript(ctx) {
    const { date } = ctx.params;
    const startDate = [date.slice(0, 4), date.slice(4, 6), date.slice(6)].join(
      "-"
    );
    const [race] = await strapi.entityService.findMany("api::race.race", {
      filters: { startDate },
    });
    if (!race) return ctx.throw(404, `No race found with date ${startDate}`);

    ctx.request.body.data.race = race.id;
    delete ctx.request.body.data.firstname;
    delete ctx.request.body.data.lastname;
    delete ctx.request.body.data.email;
    ctx.query.populate = ctx.query.populate || ["runner", "race", "race.park"];
    return this.create(ctx);
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
