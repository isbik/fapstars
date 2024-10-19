import queue from '@rlanz/bull-queue/services/main';

import UserBalanceRecalculationJob from '../../../jobs/user_balance_recalculation_job.js';
import { SocketConnectionInstance } from '../types.js';

import TransactionsService from '#services/transactions_service';
import { createTransactionValidator } from '#validators/transaction';

export class CreateTransactionHandler {
  constructor(private transactionsService: TransactionsService) {}

  async handle(params: { socket: SocketConnectionInstance; data: unknown }) {
    const { socket, data } = params;

    // Validate payload
    const payload = await createTransactionValidator.validate(data);

    // Access user ID from socket data
    const userId = socket.data.authenticatedUserId;

    // Calculate transaction value
    const clickCost = 1; // TODO: Retrieve from ItemService after implementation
    const value = (BigInt(payload.cnt) * BigInt(clickCost)).toString();

    // Create transaction
    await this.transactionsService.create({ ownerId: userId, value, type: payload.type });

    /**
     * Создаем Job на перерасчёт баланса пользователя, благодаря ключу временной метки
     * работает throttling и мы имеет максимум 1 таску в минуту
     */
    await queue.dispatch(
      UserBalanceRecalculationJob,
      {
        userId,
      },
      {
        // TODO: При реализации RateLimiter добавить ключ временной метки
        // jobId: `user_${request.user.id}_balance_recalculation_${DateTime.now().toFormat('yyyy_MM_dd_hh_mm')}`,
      },
    );

    // TODO: It's possible to use it to update frontend data, update or remove it
    // Send an acknowledgment or success message back to a client
    socket.emit('transaction_created', { status: 'success' });
  }
}
