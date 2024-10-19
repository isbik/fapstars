import type { AddressInfo } from 'node:net';

import logger from '@adonisjs/core/services/logger';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { Server as SocketIOServer } from 'socket.io';

import { GlobalAuthentication } from '../globalAuthentication.js';

import { SocketEvent } from './constants/index.js';
import * as socketEvents from './events/index.js';
import { SocketAuth, SocketConnectionInstance, WebServer, WebSocketServerParams } from './types.js';

import { webSocketServerOptions } from '#config/websocketServer';

export class WebSocketServer {
  private static instance: WebSocketServer;
  private readonly webServer;
  private readonly socketAuth: SocketAuth;
  private socketIOServer;

  private constructor(socketAuth: SocketAuth, webServer?: WebServer) {
    this.webServer = webServer;
    this.socketAuth = socketAuth;
    this.socketIOServer = new SocketIOServer(this.webServer, webSocketServerOptions);

    this.logServerStart();
    this.setupConnectionHandler();
  }

  /**
   * Creates a singleton instance of WebSocketServer.
   * @param params
   * @param params.socketAuth - Authentication data for the WebSocket server
   * @param [params.webServer] - HTTP or HTTPS server instance to attach the WebSocket server to it (optional)
   * @param [params.redisUrl] - Redis URL to use as an adapter for the WebSocket server scalability (optional)
   */
  static async create(params: WebSocketServerParams): Promise<WebSocketServer> {
    const { socketAuth, webServer, redisUrl } = params;

    if (!WebSocketServer.instance) {
      WebSocketServer.instance = new WebSocketServer(socketAuth, webServer);

      if (redisUrl) {
        try {
          await WebSocketServer.setupRedisAdapter(redisUrl, WebSocketServer.instance.socketIOServer);
        } catch (error) {
          logger.error('Failed to set up Redis adapter for WebSocket server: %s', error);
          throw new Error('Invalid Redis URL provided');
        }
      }
    }

    return WebSocketServer.instance;
  }

  /**
   * Set up the Redis adapter for Socket.IO server scalability.
   * @param redisUrl The Redis URL to connect to.
   * @param socketIOServer The Socket.IO server instance.
   */
  private static async setupRedisAdapter(redisUrl: string, socketIOServer: SocketIOServer): Promise<void> {
    const pubClient = createClient({ url: redisUrl });
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);

    socketIOServer.adapter(createAdapter(pubClient, subClient));
  }

  private logServerStart(): void {
    const addressInfo = this.webServer?.address();
    if (addressInfo) {
      const { address, port } = addressInfo as AddressInfo;
      logger.info(`Started WebSocket server on ${address}:${port}`);
    }
  }

  private setupConnectionHandler(): void {
    this.socketIOServer.on(SocketEvent.Connection, async socket => {
      logger.info('New WebSocket connection %s established', socket.id);

      try {
        await this.authenticateSocket(socket);
      } catch (error) {
        logger.error('Authentication failed for socket %s: %s', socket.id, error);
        socket.disconnect(true);
      }

      this.loadSocketEvents(socket);
    });
  }

  private async authenticateSocket(socket: SocketConnectionInstance): Promise<void> {
    const { auth: authData } = socket.handshake;
    const token = authData.token as string;

    this.validateAuthData(token);

    const user = await this.extractAuthUser(token);

    socket.data.authenticatedUserId = user.id;

    logger.info('Socket %s authenticated as user id %s', socket.id, user.id);
  }

  private validateAuthData(token: string): void {
    if (!token) {
      throw new Error('Unauthorized: No token provided');
    }
    if (!this.socketAuth.secretToken) {
      throw new Error('Internal Server Error: Secret token not provided');
    }
    if (!this.socketAuth.botToken) {
      throw new Error('Internal Server Error: Bot token not provided');
    }

    const isVerifiedInitData = GlobalAuthentication.verifyInitData({
      initData: token,
      botToken: this.socketAuth.botToken,
    });

    if (!isVerifiedInitData) {
      throw new Error('Unauthorized: Invalid token');
    }
  }

  private async extractAuthUser(token: string) {
    const user = await GlobalAuthentication.extractUserFromInitData({ initData: token });
    if (!user) {
      throw new Error('Unauthorized: Invalid token, user not found');
    }
    return user;
  }

  private loadSocketEvents(socket: SocketConnectionInstance): void {
    for (const socketEvent of Object.values(socketEvents)) {
      if (typeof socketEvent === 'function') {
        socketEvent(socket);
      }
    }
  }
}
