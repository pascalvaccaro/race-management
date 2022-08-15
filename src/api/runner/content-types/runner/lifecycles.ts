import { errors } from '@strapi/utils';

export default {
  async beforeCreate(event) {
    const { email, firstname, lastname } = event.params.data;
    const fullname = firstname + ' ' + lastname;
    const [exists] = await strapi.entityService.findMany('api::runner.runner', { filters: { email, fullname }});
    if (exists) throw new errors.ValidationError('runner already exists: ' + email + ' ' + fullname);

    const [parent] = await strapi.entityService.findMany('api::runner.runner', {
      filters: { email },
      populate: {
        parent: { filters: { id: { $null: true }}}
      }
    });

    if (parent) {
      event.params.data.email = null;
      event.params.data.parent = parent.id;
    }

    event.params.data.fullname = fullname;
  },

  async beforeUpdate(event) {
    if (event.params.data.firstname || event.params.data.lastname) {
      const target = await strapi.entityService.findOne('api::runner.runner', event.params.where.id, { fields: ['firstname', 'lastname']});
      const firstname = event.params.data.firstname ?? target.firstname;
      const lastname = event.params.data.lastname ?? target.lastname;
      event.params.data.fullname = firstname + ' ' + lastname;
    }
  },
};
