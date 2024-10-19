import { SocketEvent } from '../constants/index.js';
import { CreateTransactionHandler } from '../handlers/index.js';
import { SocketConnectionInstance } from '../types.js';

import TransactionsService from '#services/transactions_service';

export const createTransactionEvent = (socket: SocketConnectionInstance) => {
  socket.on(SocketEvent.CreateTransaction, async data => {
    const transactionService = new TransactionsService();
    const createTransactionHandler = new CreateTransactionHandler(transactionService);

    await createTransactionHandler.handle({ socket, data });
  });
};
