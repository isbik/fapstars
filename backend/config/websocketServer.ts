import type { ServerOptions as WebSocketServerOptions } from 'socket.io';

export const webSocketServerOptions: Partial<WebSocketServerOptions> = {
  cors: {
    origin: '*', // TODO: change to the actual frontend URL in production
  },
  pingInterval: 25000,
  pingTimeout: 60000,
};
