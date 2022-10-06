/**
 * runner service.
 */

import { factories } from "@strapi/strapi";
import { GenericService } from "@strapi/strapi/lib/core-api/service";

export default factories.createCoreService(
  "api::runner.runner",
  ({ strapi }) => ({
    async findRunnerByName({ firstname, lastname }) {
      const [mainRunner] = await strapi.entityService.findMany(
        "api::runner.runner",
        {
          filters: { firstname, lastname },
        }
      );

      return mainRunner;
    },

    async findRunnerByEmail({ email }) {
      const [mainRunner] = (await strapi.entityService.findMany(
        "api::runner.runner",
        {
          filters: { email },
        }
      ));

      return mainRunner;
    },
  } as GenericService)
);
