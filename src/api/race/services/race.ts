/**
 * race service.
 */

import { factories } from "@strapi/strapi";
import { GenericService } from "@strapi/strapi/lib/core-api/service";

export default factories.createCoreService("api::race.race", ({ strapi }) => ({
  async findRaceByDate(date = new Date().toISOString()) {
    const [race] = await strapi.entityService.findMany("api::race.race", {
      sort: { startDate: "asc" },
      filters: { startDate: { $gt: date } },
    });

    return race;
  },
} as GenericService));
