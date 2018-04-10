// Update with your config settings.
const path = require("path");
const BASE_PATH = path.join(__dirname, "server", "db");

const ENV = process.env.NODE_ENV || 'test';
const POSTGRES_USER = process.env.POSTGRES_USER || 'postgres';
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || '';
const POSTGRES_HOST = process.env.POSTGRES_HOST || 'postgres:5432';
const POSTGRES_DB  = process.env.POSTGRES_DB || 'postgres';
const DATABASE_URL = `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}/${POSTGRES_DB}`;


module.exports = {
    test: {
        client: 'pg',
        connection: process.env.DATABASE_URL || DATABASE_URL,
        migrations: {
            directory: __dirname + '/db/migrations'
        },
        seeds: {
            directory: __dirname + '/db/seeds/test'
        }
    },
    development: {
        client: 'pg',
        connection: DATABASE_URL,
        migrations: {
            directory: __dirname + '/db/migrations'
        },
        seeds: {
            directory: __dirname + '/db/seeds/development'
        }
    },
    production: {
        client: 'pg',
        connection: process.env.DATABASE_URL,
        migrations: {
            directory: __dirname + '/db/migrations'
        },
        seeds: {
            directory: __dirname + '/db/seeds/production'
        }
    }
};