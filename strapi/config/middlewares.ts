// strapi/config/middlewares.js
module.exports = [
  'strapi::errors',
  {
    name: 'strapi::cors',
    config: {
      origin: [
        process.env.CLIENT_URL,           // Vercel frontend
        'http://localhost:3000',          // local dev
      ].filter(Boolean),
      headers: '*',
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      keepHeaderOnError: true,
    },
  },
  'strapi::security',
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',

  // ⬇️ Register your custom deep populate middleware here
  'global::deep-populate',

  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
