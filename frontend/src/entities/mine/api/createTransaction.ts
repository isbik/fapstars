import CreateTransactionRequest from '../types/CreateTransactionRequest';

import { SocketEvent } from '~/entities/mine/constants';
import { WebSocketClient } from '~/shared/api/webSocketClient.ts';

const createTransaction = async (payload: CreateTransactionRequest): Promise<void> => {
  const webSocketClient = WebSocketClient.create();

  webSocketClient.emit(SocketEvent.createTransaction, payload);
};

export default createTransaction;
