export default ({ strapi }) => ({
  async createProduct(ctx) {
    const stripeProductResponse = await strapi
      .plugin("strapi-stripe")
      .service("stripeService")
      .createProduct(ctx.request.body);
    ctx.send(stripeProductResponse, 200);
  },
  async find(ctx) {
    const { offset, limit, sort, order } = ctx.params;
    let needToshort;
    if (sort === "name") {
      needToshort = { title: `${order}` };
    } else if (sort === "price") {
      needToshort = { price: `${order}` };
    }
    const count = await strapi
      .query("plugin::strapi-stripe.strapi-stripe-product")
      .count();

    const data = await strapi
      .query("plugin::strapi-stripe.strapi-stripe-product")
      .findMany({
        orderBy: needToshort,
        offset,
        limit,
        populate: true,
      });

    ctx.body = { data, count };
  },

  async findOne(ctx) {
    const { id } = ctx.params;
    const res = await strapi
      .query("plugin::strapi-stripe.strapi-stripe-product")
      .findOne({ where: { id }, populate: true });
    ctx.body = res;
  },

  async updateProduct(ctx) {
    const { id } = ctx.params;
    const updateProductResponse = await strapi
      .plugin("strapi-stripe")
      .service("stripeService")
      .updateProduct(id, ctx.request.body);
    ctx.send(updateProductResponse, 200);
  },

  async deleteProduct(ctx) {
    const { id } = ctx.params;
    const { stripeProductId, stripePriceId } = await strapi
      .query("plugin::strapi-stripe.strapi-stripe-product")
      .findOne({ where: { id }, populate: true });
    const deleteProductResponse = await strapi
      .plugin("strapi-stripe")
      .service("stripeService")
      .deleteProduct(id, { stripeProductId, stripePriceId });
    ctx.send(deleteProductResponse, 200);
  },

  async createCheckoutSession(ctx) {
    const checkoutSessionResponse = await strapi
      .plugin("strapi-stripe")
      .service("stripeService")
      .createCheckoutSession(ctx.request.body);
    ctx.send(checkoutSessionResponse, 200);
  },
  async retrieveCheckoutSession(ctx) {
    const { id } = ctx.params;
    const retrieveCheckoutSessionResponse = await strapi
      .plugin("strapi-stripe")
      .service("stripeService")
      .retrieveCheckoutSession(id);

    ctx.send(retrieveCheckoutSessionResponse, 200);
  },
  async savePayment(ctx) {
    const { txnMessage, ...body } = ctx.request.body;

    const savePaymentDetails = await strapi
      .query("plugin::strapi-stripe.strapi-stripe-payment")
      .create({
        data: {
          ...body,
          txnMessage: JSON.stringify(txnMessage),
        },
        populate: true,
      });

    return savePaymentDetails;
  },
  async getProductPayments(ctx) {
    const { id, sort, order, offset, limit } = ctx.params;
    let needToshort;
    if (sort === "name") {
      needToshort = { customerName: `${order}` };
    } else if (sort === "email") {
      needToshort = { customerEmail: `${order}` };
    } else if (sort === "date") {
      needToshort = { txnDate: `${order}` };
    }
    const count = await strapi
      .query("plugin::strapi-stripe.strapi-stripe-payment")
      .count({
        where: { stripeProduct: id },
      });

    const payments = await strapi
      .query("plugin::strapi-stripe.strapi-stripe-payment")
      .findMany({
        where: { stripeProduct: id },
        orderBy: needToshort,
        offset,
        limit,
        populate: true,
      });
    return { payments, count };
  },
});
