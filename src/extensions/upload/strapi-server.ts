export default (plugin) => {
  const contentType = plugin.contentTypes.file;
  if (!contentType.lifecycles) contentType.lifecycles = {};

  contentType.lifecycles.beforeCreate = (event) => {
    const { name } = event.params.data;

    if (name.startsWith("certificate-")) {
      const expiredAt = new Date();
      expiredAt.setFullYear(expiredAt.getFullYear() + 1);
      event.params.data.expiredAt = expiredAt.toISOString();
    }
  };

  return plugin;
};
