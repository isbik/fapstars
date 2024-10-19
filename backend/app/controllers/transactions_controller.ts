import { inject } from '@adonisjs/core';
import type { HttpContext } from '@adonisjs/core/http';
import queue from '@rlanz/bull-queue/services/main';

import UserBalanceRecalculationJob from '../jobs/user_balance_recalculation_job.js';

import TransactionsService from '#services/transactions_service';
import { createTransactionValidator } from '#validators/transaction';
// import { DateTime } from 'luxon'

@inject()
export default class TransactionsController {
  constructor(protected transactionsService: TransactionsService) {}

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createTransactionValidator);

    const clickCost = 1; // TODO: получать из ItemService после реализации
    const value = (BigInt(payload.cnt) * BigInt(clickCost)).toString();
    await this.transactionsService.create({ ownerId: request.user.id, value, type: payload.type });

    /**
     * Создаем Job на перерасчёт баланса пользователя, благодаря ключу временной метки
     * работает throttling и мы имеет максимум 1 таску в минуту
     */
    await queue.dispatch(
      UserBalanceRecalculationJob,
      {
        userId: request.user.id,
      },
      {
        // TODO: При реализации RateLimiter добавить ключ временной метки
        // jobId: `user_${request.user.id}_balance_recalculation_${DateTime.now().toFormat('yyyy_MM_dd_hh_mm')}`,
      },
    );

    return response.noContent();
  }
}
