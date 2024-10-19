import { io, Socket } from 'socket.io-client';

import { SocketSystemEvent } from '~/shared/constants';
import { extractTelegramInitData } from '~/shared/utils';

export class WebSocketClient {
  private static instance: WebSocketClient;
  private socket: Socket;

  static create(
    params = {
      webSocketServerUrl: import.meta.env.VITE_WS_URL,
      secretToken: import.meta.env.VITE_SECRET_TOKEN,
    },
  ): WebSocketClient {
    if (!WebSocketClient.instance) {
      let webSocketServerUrl: URL;

      try {
        webSocketServerUrl = new URL(params.webSocketServerUrl);
      } catch {
        throw new Error('Invalid websocket server url');
      }

      WebSocketClient.instance = new WebSocketClient(webSocketServerUrl);
    }

    return WebSocketClient.instance;
  }

  private constructor(webSocketServerUrl: URL) {
    this.socket = io(webSocketServerUrl.toString(), {
      auth: {
        token: extractTelegramInitData(),
      },
    });

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.socket.on(SocketSystemEvent.Connect, () => {
      console.log(`Websocket ${this.socket.id} connected to server`);

      this.socket.on(SocketSystemEvent.Disconnect, () => {
        console.log(`Websocket ${this.socket.id} disconnected from server`);
      });
    });
  }

  emit(event: string, payload: unknown): void {
    this.socket.emit(event, payload);
  }
}
