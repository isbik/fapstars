import { defineConfig } from '@adonisjs/lucid';

import env from '#start/env';

const buildDbConfig = (prefix?: string) => {
  const envPrefix = prefix ? `${prefix}_` : '';

  const configKeysMap = {
    host: 'DB_HOST',
    port: 'DB_PORT',
    user: 'DB_USER',
    password: 'DB_PASSWORD',
    database: 'DB_DATABASE',
  };

  const dbConfig = Object.entries(configKeysMap).reduce((accumulator, [key, value]) => {
    return {
      ...accumulator,
      [key]: env.get(`${envPrefix}${value}`),
    };
  }, {});

  return dbConfig;
};

const buildDbConnection = (nodeEnv: string) => (nodeEnv === 'test' ? buildDbConfig('TEST') : buildDbConfig(''));

const dbConfig = defineConfig({
  connection: 'postgres',
  connections: {
    postgres: {
      client: 'pg',
      connection: buildDbConnection(env.get('NODE_ENV')),
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
        disableRollbacksInProduction: true,
      },
    },
  },
});

export default dbConfig;
