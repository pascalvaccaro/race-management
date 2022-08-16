export default [
  {
    method: 'GET',
    path: '/print/:raceId',
    handler: 'print.listRunners',
    config: {
      auth: false,
    },
  },
];
