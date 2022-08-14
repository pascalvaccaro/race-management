export default ({ env }) => ({
  "config-sync": {
    enabled: true,
    config: {
      excludedConfig: [
        "core-store.plugin_strapi-stripe_stripeSetting",
        "core-store.plugin_users-permissions_grant",
      ],
    },
  },
});