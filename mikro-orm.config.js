require('ts-node/register');
require('dotenv/config');

const { Migrator } = require('@mikro-orm/migrations');
const { defineConfig, MySqlDriver } = require('@mikro-orm/mysql');

module.exports = defineConfig({
  driver: MySqlDriver,

  dbName: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 3306),

  entities: ['./dist/db/**/*.entity.js'],
  entitiesTs: ['./src/db/**/*.entity.ts'],

  extensions: [Migrator],

  migrations: {
    path: './dist/migrations',
    pathTs: './src/migrations',
  },
});

