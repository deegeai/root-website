// config/database.ts
export default ({ env }) => {
  const url = env('DATABASE_URL');

  if (url) {
    // Production (Render): use Postgres via DATABASE_URL
    return {
      connection: {
        client: 'postgres',
        connection: {
          connectionString: url,
          ssl: env.bool('DATABASE_SSL', true) ? { rejectUnauthorized: false } : false,
        },
      },
    };
  }

  // Local dev: SQLite
  return {
    connection: {
      client: 'sqlite',
      connection: { filename: env('DATABASE_FILENAME', '.tmp/data.db') },
      useNullAsDefault: true,
    },
  };
};
