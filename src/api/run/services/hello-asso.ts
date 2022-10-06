/**
 * hello-asso service.
 */

import { GenericService } from "@strapi/strapi/lib/core-api/service";

type HelloAssoPayload = {
  customFields: { answer: string; name: string }[];
  payer: { email: string; firstName: string; lastName: string };
  items: { user: { lastName: string; firstName: string } }[];
};

const labels = {
  AGE_NAME: "Age",
  IS_MAJOR: "Je certifie avoir 18 ans ou plus ",
  IS_GTE16: "Je certifie avoir plus de 16 ans et je viens non accompagné·e",
  IS_CHILD:
    "J'ai moins de 18 ans et je viens accompagné·e d'un adulte responsable",
  DAI_NAME:
    "J'autorise la reproduction/diffusion de mon image (utilisation non-commerciale)",
  YES: "Oui",
  NO: "Non",
} as const;

const helloAssoService = () => ({
  registerRun(data: HelloAssoPayload, runner: any, race: any) {
    const fields = data.customFields || [];
    const getFieldAnswer = (name: string, cb: (v: string) => boolean) => {
      const field = fields.find((field) => field.name === name);
      return cb(field.answer);
    };

    const run = {
      runner: runner.id,
      race: race.id,
      child: getFieldAnswer(
        labels.AGE_NAME,
        (answer) => answer === labels.IS_CHILD
      ),
      minor: getFieldAnswer(
        labels.AGE_NAME,
        (answer) => answer === labels.IS_GTE16
      ),
      copyright: getFieldAnswer(
        labels.DAI_NAME,
        (answer) => answer === labels.YES
      ),
    };
    return strapi.entityService.create("api::run.run", {
      data: run,
    });
  },

  async *extractRunners(data: HelloAssoPayload) {
    const { payer, items = [] } = data;
    const { email } = payer;
    const service = strapi.service("api::runner.runner");
    const mainRunner = await service.findRunnerByEmail({ email });
    if (mainRunner) yield mainRunner;

    for (const item of items) {
      const { firstName: firstname, lastName: lastname } = item.user;
      const runner = await service.findRunnerByName({ firstname, lastname });
      if (mainRunner && runner?.id === mainRunner.id) continue;

      yield runner.id
        ? runner
        : await strapi.entityService.create("api::runner.runner", {
            data: {
              firstname,
              lastname,
              email,
            },
          });
    }
  },
} as GenericService);

export default helloAssoService;
export type HelloAssoService = ReturnType<typeof helloAssoService>;
