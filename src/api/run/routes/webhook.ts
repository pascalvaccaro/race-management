export default {
  routes: [
    {
      method: "GET",
      path: "/runs/:id/qrcode",
      handler: "run.generateQRCode",
      config: {
        auth: false,
      },
    },
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
