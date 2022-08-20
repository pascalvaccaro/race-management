import productSchema from './product';
import paymentSchema from './payment';

export default {
  'strapi-stripe-product': { schema: productSchema }, //// should re-use the singularName of the content-type
  'strapi-stripe-payment': { schema: paymentSchema },
};
