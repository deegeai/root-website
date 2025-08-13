// config/database.ts
export default ({ env }) => {
  const useUrl = !!env('DATABASE_URL');
  const ssl = env.bool('DATABASE_SSL', false);

  if (useUrl) {
    return {
      connection: {
        client: 'postgres',
        connection: {
          connectionString: env('DATABASE_URL'),
          ssl: ssl ? { rejectUnauthorized: false } : false,
        },
        pool: { min: 2, max: 10 },
      },
    };
  }

  // Local fallback: SQLite
  return {
    connection: {
      client: 'sqlite',
      connection: { filename: env('SQLITE_FILENAME', '.tmp/data.db') },
      useNullAsDefault: true,
    },
  };
};
