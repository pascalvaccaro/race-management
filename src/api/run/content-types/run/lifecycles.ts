import QRCode from "qrcode";
import dayjs from "dayjs";
import "dayjs/locale/fr";

export default {
  async afterCreate(event) {
    try {
      let { result } = event;
      if (!result.runner?.id || !result.race?.id)
        result = await strapi.entityService.findOne("api::run.run", result.id, {
          populate: ["race", "race.park", "runner", "runner.attachments"],
        });

      const body = JSON.stringify({
        id: result.id,
        race: { id: result.race.id },
        runner: { id: result.runner.id },
      });
      const buffer = await QRCode.toBuffer(body, { width: 250 });

      const startDate = dayjs(result.race.startDate).locale("fr");
      const filename = `${startDate.format("YYYY-MM-DD")}_QRCode-A-Ton-Allure_${
        result.runner.id
      }.png`;

      strapi.plugins["email"].services.email.send({
        to: result.runner.email,
        from: "A Ton Allure <atonallure@gmail.com>",
        subject: `Ton inscription à la course du ${startDate.format(
          "D MMMM YYYY"
        )}`,
        html: `<p>Bonjour ${result.runner.firstname},</p>
          <p>Merci pour ton inscription à la course A Ton Allure !<p>
          <p>Le QR Code fait son grand retour ! Merci de venir le jour de la course muni de celui attaché à ce message.</p>

          <p>A samedi !<p>
          <p>L'équipe A Ton allure</p>
          `,
        text: `Bonjour ${result.runner.firstname}
          Merci pour ton inscription à la course A Ton Allure !
          Le QR Code fait son grand retour ! Merci de venir le jour de la course muni de celui attaché à ce message.

          A samedi!
          L'équipe A Ton allure
        `,
        attachments: [
          {
            content: buffer.toString("base64"),
            filename,
            type: "image/png",
            disposition: "attachment",
          },
        ],
      }).catch(err => strapi.log.error(err.message));
    } catch (err) {
      strapi.log.error(err.message);
    }
  },
};
