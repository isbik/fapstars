import { DateTime } from 'luxon';

import Transaction from '#models/transaction';

export default class TransactionsService {
  async create(payload: { ownerId?: string; value: string; type: string }) {
    return await Transaction.create(payload);
  }

  static calc(a: string | number | bigint, b: string | number | bigint): string {
    return (BigInt(a) + BigInt(b)).toString();
  }

  /**
   * Get user total of transactions by period
   * @param userId
   * @param from example 2014-07-13 00:00:00.000 Z
   * @param to example 2014-07-13 00:00:00.000 Z
   */
  async countUserTotal(userId: string, from?: DateTime | string, to?: DateTime | string): Promise<string> {
    const transactionsQuery = Transaction.query().where('ownerId', userId);

    if (from) {
      const _from = typeof from === 'string' ? from : from.toSQL();
      await (_from && transactionsQuery.where('createdAt', '>=', _from));
    }

    if (to) {
      const _to = typeof to === 'string' ? to : to.toSQL();
      await (_to && transactionsQuery.andWhere('createdAt', '<=', _to));
    }

    const transactions = await transactionsQuery.sum('value as total');
    const totalValue: unknown = transactions[0]?.$extras.total;

    return totalValue ? String(totalValue) : '0';
  }

  // async countLeagueTotal(leagueId: number): Promise<number> {
  //   const league = await League.query().where('id', leagueId).first();

  //   return 0
  // }
}
