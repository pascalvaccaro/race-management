import "@strapi/strapi";
import axios from "axios";
import { template } from "lodash";
import { Race } from "../../typings";

export default ({ strapi }) => ({
  async listRunners(ctx) {
    const { raceId } = ctx.params;
    const race = (await strapi.entityService.findOne("api::race.race", raceId, {
      populate: { runs: { populate: "runner", sort: 'numberSign:asc' }, park: true },
    })) as Race;
    if (!race) return ctx.notFoundError();

    const serverUrl = strapi.config.get("server.url");
    const html = await axios
      .get(serverUrl + "/dossards.html", { responseType: "text" })
      .then((res) => res.data);

    ctx.set("Content-Type", "text/html");
    ctx.body = template(html)(race);
  },
});
