export default {
  routes: [
    {
      method: "POST",
      path: "/runs/webhook/:provider",
      handler: "run.register",
      config: {
        auth: false,
      },
    },
    {
      method: "POST",
      path: "/runs/:date",
      handler: "run.createFromGScript",
      config: {
        auth: false,
      },
    },
  ],
};
