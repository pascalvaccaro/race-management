import "@strapi/strapi";

export default ({ strapi }) => ({
  async findAssetsToValidate(ctx) {
    const files = await strapi.entityService.findMany("plugin::upload.file", { filters: { valid: { $null: true }}, populate: 'related' });
    ctx.body = files;
  },

  async validateAsset(ctx) {
    const asset = await strapi.entityService.update('plugin::upload.file', ctx.params.id, ctx.request.body);
    ctx.body = asset;
  }
});
