import app from '@adonisjs/core/services/app';
import server from '@adonisjs/core/services/server';

import { WebSocketServer } from '../app/modules/index.js';

import env from '#start/env';

const redisHost = env.get('WEBSOCKET_SESSION_REDIS_HOST');
const redisPort = env.get('WEBSOCKET_SESSION_REDIS_PORT');
const redisPassword = env.get('WEBSOCKET_SESSION_REDIS_PASSWORD');

let redisUrl = undefined;
if (redisHost && redisPort) {
  const baseRedisUrl = `${redisHost}:${redisPort}`;
  redisUrl = redisPassword ? `redis://:${redisPassword}@${baseRedisUrl}` : `redis://${baseRedisUrl}`;
}

await app.ready(async () => {
  await WebSocketServer.create({
    webServer: server.getNodeServer(),
    socketAuth: {
      secretToken: env.get('SECRET_TOKEN'),
      botToken: env.get('BOT_TOKEN'),
    },
    redisUrl,
  });
});
