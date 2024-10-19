import { inject } from '@adonisjs/core';
import redis from '@adonisjs/redis/services/main';
import { Job } from '@rlanz/bull-queue';
import queue from '@rlanz/bull-queue/services/main';
import { DateTime } from 'luxon';

import LeagueBalanceRecalculationJob from './league_balance_recalculation_job.js';

import User from '#models/user';
import TransactionsService from '#services/transactions_service';

interface UserBalanceRecalculationJobPayload {
  userId: string;
}

@inject()
export default class UserBalanceRecalculationJob extends Job {
  constructor(protected transactionsService: TransactionsService) {
    super();
  }

  // This is the path to the file that is used to create the job
  static get $$filepath() {
    return import.meta.url;
  }

  /**
   * Рассчитывам сумму новых транзакций пользователя и начисляем на его баланс
   * Дополнительно начисляем это значение на временный баланс лиги пользователя, если такая имеется
   */
  @inject()
  async handle(payload: UserBalanceRecalculationJobPayload): Promise<void> {
    const user = await User.findByOrFail('id', payload.userId);
    const income = await this.transactionsService.countUserTotal(user.id, user.balancedAt ?? undefined);

    user.balance = TransactionsService.calc(user.balance, income);
    user.balancedAt = DateTime.now();
    await user.save();

    if (user.leagueId && income !== '0') {
      await this.updateLeagueBalance(user.leagueId, income);
    }
  }

  /**
   * This is an optional method that gets called when the retries have exceeded and are marked failed.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async rescue(_: UserBalanceRecalculationJobPayload) {}

  /**
   * Кладёт сумму новых транзакицй в кэш-баланс лиги
   * @param leagueId - Идентификатор лиги
   * @param income - Сумма новых транзакций
   */
  private async updateLeagueBalance(leagueId: string, income: string) {
    const LEAGUE_BALANCE_CACHE_KEY = `league_tmp_balance_${leagueId}`; // TODO: Вынести это в отдельный фасад, который бы генерил имена ключей
    const leagueTmpBalance = (await redis.get(LEAGUE_BALANCE_CACHE_KEY)) ?? 0;
    await redis.set(LEAGUE_BALANCE_CACHE_KEY, TransactionsService.calc(leagueTmpBalance, income));

    await queue.dispatch(
      LeagueBalanceRecalculationJob,
      {
        leagueId: leagueId,
      },
      {
        jobId: `league_${leagueId}_balance_recalculation_${DateTime.now().toFormat('yyyy_MM_dd_hh_mm')}`,
      },
    );
  }
}
