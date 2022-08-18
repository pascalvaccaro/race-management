import React from "react";
import { prefixPluginTranslations } from "@strapi/helper-plugin";
import pluginPkg from "../../package.json";
import pluginId from "./pluginId";
import Initializer from "./components/Initializer";
import PluginIcon from "./components/PluginIcon";
import { IsRaceEditPage } from "./guards";
import PrintNumberSign from "./pages/PrintNumberSign";

const name = pluginPkg.strapi.name;

export default {
  register(app) {
    app.addMenuLink({
      to: '/plugins/atonallure/validator',
      icon: PluginIcon,
      intlLabel: {
        id: 'atonallure.menu.label',
        defaultMessage: 'A Ton Allure',
      },
      Component: () => import('./pages/App'),
      permissions: [],
    });
    app.registerPlugin({
      id: pluginId,
      initializer: Initializer,
      isReady: false,
      name,
    });
  },

  bootstrap(app) {
    app.injectContentManagerComponent("editView", "informations", {
      name: "run-manager",
      Component: () => (
        <IsRaceEditPage>
          <PrintNumberSign />
        </IsRaceEditPage>
      ),
    });
  },
  async registerTrads(app) {
    const { locales } = app;

    const importedTrads = await Promise.all(
      locales.map((locale) => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return Promise.resolve(importedTrads);
  },
};
