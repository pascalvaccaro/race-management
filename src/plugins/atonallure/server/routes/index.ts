export default [
  {
    method: 'GET',
    path: '/print/:raceId',
    handler: 'print.listRunners',
    config: {
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/validate',
    handler: 'validate.findAssetsToValidate',
    config: {
      auth: false,
    },
  },
  {
    method: 'PUT',
    path: '/validate/:id',
    handler: 'validate.validateAsset',
    config: {
      auth: false,
    },
  },
];
