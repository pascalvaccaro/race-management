/**
 * race service.
 */

import { factories } from "@strapi/strapi";
import { ServiceConfig } from "@strapi/strapi/lib/types/factories";
import { ApiRaceRace, GetModel } from "../../../../schemas";

export type RaceService = {
  findRaceByDate(date?: string): Promise<GetModel<ApiRaceRace>>;
} & ServiceConfig;

export default factories.createCoreService<RaceService>(
  "api::race.race",
  ({ strapi }) => ({
    async findRaceByDate(date = new Date().toISOString()) {
      const [race] = await strapi.entityService.findMany("api::race.race", {
        sort: { startDate: "asc" },
        filters: { startDate: { $gt: date } },
      });

      return race;
    },
  })
);
