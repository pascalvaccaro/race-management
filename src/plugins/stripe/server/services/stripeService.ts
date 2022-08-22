"use strict";

import Stripe from "stripe";

export default ({ strapi }) => {
  const initStripe = async () => {
    const pluginStore = strapi.store({
      environment: strapi.config.environment,
      type: "plugin",
      name: "strapi-stripe",
    });
    const stripeSettings = await pluginStore.get({ key: "stripeSetting" });
    const stripe = new Stripe(
      stripeSettings.isLiveMode
        ? stripeSettings.stripeLiveSecKey
        : stripeSettings.stripeTestSecKey,
      {
        apiVersion: "2020-08-27",
      }
    );
    return { stripe, settings: stripeSettings };
  };

  return {
    async createProduct({
      title,
      price: productPrice,
      imageId,
      imageUrl,
      description,
      isSubscription,
      paymentInterval,
      trialPeriodDays,
      isFreeAmount,
    }: {
      title: string;
      price: number;
      imageId: string;
      imageUrl: string;
      description: string;
      isSubscription: boolean;
      paymentInterval: Stripe.PlanCreateParams.Interval;
      trialPeriodDays: number;
      isFreeAmount?: boolean;
    }) {
      const { stripe, settings } = await initStripe();
      const { currency } = settings;
      const product = await stripe.products.create({
        name: title,
        description,
        images: [imageUrl],
      });

      const createproduct = async (
        productId: string,
        priceId: string,
        planId: string
      ) => {
        const create = await strapi
          .query("plugin::strapi-stripe.strapi-stripe-product")
          .create({
            data: {
              title,
              description,
              price: productPrice,
              currency,
              productImage: imageId,
              isSubscription,
              interval: paymentInterval,
              trialPeriodDays,
              stripeProductId: productId,
              stripePriceId: priceId,
              stripePlanId: planId,
              isFreeAmount,
            },
            populate: true,
          });
        return create;
      };

      if (isSubscription) {
        const plan = await stripe.plans.create({
          amount: productPrice * 100,
          currency,
          interval: paymentInterval,
          product: product.id,
          trial_period_days: trialPeriodDays,
        });
        createproduct(product.id, "", plan.id);
      } else {
        const price = await stripe.prices.create({
          ...(isFreeAmount
            ? {
                custom_unit_amount: {
                  enabled: true,
                  minimum: 100,
                  preset: productPrice * 100,
                },
              }
            : {
                unit_amount: productPrice * 100,
              }),
          currency,
          product: product.id,
        });
        createproduct(product.id, price.id, "");
      }
      return product;
    },

    async updateProduct(
      id: string,
      {
        title,
        url,
        description,
        productImage,
        stripeProductId,
      }: {
        title: string;
        url: string;
        description: string;
        productImage: string;
        stripeProductId: string;
      }
    ) {
      const { stripe } = await initStripe();
      await stripe.products.update(stripeProductId, {
        name: title,
        description,
        images: [url],
      });
      const updateProductResponse = await strapi
        .query("plugin::strapi-stripe.strapi-stripe-product")
        .update({
          where: { id },
          data: {
            title,
            description,
            productImage,
          },
        });
      return updateProductResponse;
    },

    async deleteProduct(
      productId: string,
      {
        stripeProductId,
      }: { stripeProductId: string; stripePriceId: string }
    ) {
      const { stripe } = await initStripe();
      await stripe.products.update(stripeProductId, { active: false });
      return await strapi
        .query("plugin::strapi-stripe.strapi-stripe-product")
        .delete({
          where: { id: productId },
        });
    },

    async createCheckoutSession({
      stripePriceId,
      stripePlanId,
      isSubscription,
      productId,
      productName,
      checkoutSuccessUrl,
      checkoutCancelUrl,
    }: {
      stripePriceId: string;
      stripePlanId: string;
      isSubscription: boolean;
      productId: number;
      productName: number;
      checkoutSuccessUrl: string;
      checkoutCancelUrl: string;
    }) {
      const { stripe } = await initStripe();
      let priceId: string;
      let paymentMode: "payment" | "setup" | "subscription";
      if (isSubscription) {
        priceId = stripePlanId;
        paymentMode = "subscription";
      } else {
        priceId = stripePriceId;
        paymentMode = "payment";
      }
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
            price: priceId,
            quantity: 1,
          },
        ],
        mode: paymentMode,
        payment_method_types: ["card"],
        success_url: `${checkoutSuccessUrl}?sessionId={CHECKOUT_SESSION_ID}`,
        cancel_url: `${checkoutCancelUrl}`,
        metadata: {
          productId: `${productId}`,
          productName: `${productName}`,
        },
        submit_type: "donate",
      });
      return session;
    },
    async retrieveCheckoutSession(checkoutSessionId) {
      const { stripe } = await initStripe();
      const session = await stripe.checkout.sessions.retrieve(
        checkoutSessionId
      );
      return session;
    },
  };
};
