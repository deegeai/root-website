// config/server.ts
export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: env('PUBLIC_URL'),
  proxy: true,
  app: {
    keys: env.array('APP_KEYS'),
  },
  transfer: {
    token: { salt: env('TRANSFER_TOKEN_SALT') },   // <-- REQUIRED
    remote: { enabled: env.bool('TRANSFER_REMOTE_ENABLED', true) }, // <-- ENABLE
  },
});
