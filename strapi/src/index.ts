// strapi/src/index.ts
export default {
  register() {},

  async bootstrap({ strapi }) {
    // Only do this on Postgres (Render); no-op on SQLite locally
    if ((process.env.DATABASE_CLIENT || '').toLowerCase() !== 'postgres') {
      strapi.log.info('Bootstrap column fix skipped (not Postgres).');
      return;
    }

    const knex = strapi.db.connection;

    const alterToText = async (table: string, column: string) => {
      try {
        await knex.raw(`ALTER TABLE "${table}" ALTER COLUMN "${column}" TYPE TEXT`);
        strapi.log.info(`Altered ${table}.${column} -> TEXT`);
      } catch (e: any) {
        // If it's already TEXT or the ALTER is unnecessary, Postgres throws; log & continue
        strapi.log.warn(`Skip/failed altering ${table}.${column} -> TEXT: ${e.message}`);
      }
    };

    // ✅ SEO (already hit earlier)
    await alterToText('components_shared_seos', 'meta_description');
    await alterToText('components_shared_seos', 'canonical_url');

    // ✅ Steps (currently failing)
    await alterToText('components_shared_steps', 'title');
    await alterToText('components_shared_steps', 'description');
  },
};
