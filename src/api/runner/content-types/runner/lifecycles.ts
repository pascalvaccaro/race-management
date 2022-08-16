export default {
  async beforeCreate(event) {
    const { firstname, lastname } = event.params.data;
    event.params.data.fullname = firstname + ' ' + lastname;
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
