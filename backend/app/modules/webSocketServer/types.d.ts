import type { Server as HttpServer } from 'node:http';
import type { Server as HttpsServer } from 'node:https';

import { Socket } from 'socket.io';

type WebServer = HttpServer | HttpsServer;

interface SocketData {
  authenticatedUserId: string;
  [key: string]: unknown;
}

interface SocketAuth {
  secretToken?: string;
  botToken?: string;
}

interface SocketConnectionInstance extends Socket {
  data: SocketData;
}

interface WebSocketServerParams {
  socketAuth: SocketAuth;
  webServer?: WebServer;
  redisUrl?: string;
}
