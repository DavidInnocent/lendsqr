import type { Knex } from 'knex';
import config from './src/config';

const knexConfig: { [key: string]: Knex.Config } = {
    development: {
        client: 'mysql2',
        connection: {
            host: config.DB_HOST,
            port: config.DB_PORT,
            user: config.DB_USER,
            password: config.DB_PASSWORD,
            database: config.DB_NAME,
        },
        migrations: {
            directory: './src/database/migrations',
            tableName: 'knex_migrations',
        },
    },
    test: {
        client: 'better-sqlite3',
        connection: ':memory:',
        useNullAsDefault: true,
        migrations: {
            directory: './src/database/migrations',
        },
    },
    production: {
        client: 'mysql2',
        connection: {
            host: config.DB_HOST,
            port: config.DB_PORT,
            user: config.DB_USER,
            password: config.DB_PASSWORD,
            database: config.DB_NAME,
        },
        migrations: {
            directory: './src/database/migrations',
            tableName: 'knex_migrations',
        },
    },
};

export default knexConfig;