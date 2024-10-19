import redis from '@adonisjs/redis/services/main';
import { Job } from '@rlanz/bull-queue';
import { DateTime } from 'luxon';

import { COINS_TO_VERIFY_LEAGUE } from '../modules/leagues/index.js';

import League from '#models/league';
import TransactionsService from '#services/transactions_service';

interface LeagueBalanceRecalculationJobPayload {
  leagueId: string;
}

export default class LeagueBalanceRecalculationJob extends Job {
  // This is the path to the file that is used to create the job
  static get $$filepath() {
    return import.meta.url;
  }

  /**
   * Берёт значение начислений пользователей из временного кеша лиги и обновляет значение в БД
   */
  async handle(payload: LeagueBalanceRecalculationJobPayload): Promise<void> {
    const league = await League.findByOrFail('id', payload.leagueId);

    const LEAGUE_BALANCE_CACHE_KEY = `league_tmp_balance_${payload.leagueId}`;
    const leagueTmpBalance = await redis.get(LEAGUE_BALANCE_CACHE_KEY);

    let needUpdate = false;

    if (leagueTmpBalance) {
      league.balance = TransactionsService.calc(league.balance, leagueTmpBalance);
      league.balancedAt = DateTime.now();
    }

    // TODO: add delete league and disband users
    if (!league.isVerified && league.needVerifiedAt) {
      const diff = league.needVerifiedAt.diff(DateTime.now(), 'seconds').as('seconds');
      if (diff > 0 && Number(league.balance) > COINS_TO_VERIFY_LEAGUE) {
        league.isVerified = true;
        needUpdate = true;
      }
    }

    if (needUpdate || leagueTmpBalance) {
      await Promise.all([league.save(), redis.set(LEAGUE_BALANCE_CACHE_KEY, 0)]); // TODO: Протестировать устойчивость к ошибкам
    }
  }

  /**
   * This is an optional method that gets called when the retries have exceeded and are marked failed.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async rescue(_: LeagueBalanceRecalculationJobPayload) {}
}
