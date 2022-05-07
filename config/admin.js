const { randomBytes } = require('crypto');

module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT', randomBytes(16).toString('base64')),
  },
});
