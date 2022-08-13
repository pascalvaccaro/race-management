/**
 * runner service.
 */

import { factories } from '@strapi/strapi';
import { ServiceConfig } from '@strapi/strapi/lib/types/factories';
import { ApiRunnerRunner, GetModel } from '../../../../schemas';

export type RunnerService = {
  findRunnerByName(query: { firstname: string; lastname: string }): Promise<GetModel<ApiRunnerRunner>>;
  findRunnerByEmail(query: { email: string }): Promise<GetModel<ApiRunnerRunner>>;
} & ServiceConfig;

export default factories.createCoreService<RunnerService>('api::runner.runner', ({ strapi }) => ({
  async findRunnerByName({ firstname, lastname }) {
    const [mainRunner] = (await strapi.entityService.findMany(
      "api::runner.runner",
      {
        filters: { firstname, lastname },
      }
    )) as GetModel<ApiRunnerRunner>[];

    return mainRunner;
  },

  async findRunnerByEmail({ email }) {
    const [mainRunner] = (await strapi.entityService.findMany(
      "api::runner.runner",
      {
        filters: { email },
      }
    )) as GetModel<ApiRunnerRunner>[];

    return mainRunner;
  }
}));
