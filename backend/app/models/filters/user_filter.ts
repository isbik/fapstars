import type { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model';
import { BaseModelFilter } from 'adonis-lucid-filter';

import User from '#models/user';

export default class UserFilter extends BaseModelFilter {
  declare $query: ModelQueryBuilderContract<typeof User>;

  static dropId: boolean = false;

  async id(id: string) {
    await this.$query.where('id', id);
  }

  async username(username: string) {
    await this.$query.where('username', username);
  }

  async usernameLike(username: string) {
    await this.$query.where('username', 'like', `%${username}%`);
  }

  async tgId(tgId: string) {
    await this.$query.where('tgId', tgId);
  }

  async leagueId(leagueId: string) {
    await this.$query.where('leagueId', leagueId);
  }

  async hasPremium(hasPremium: boolean) {
    await this.$query.where('hasPremium', hasPremium);
  }

  async referrerId(referrerId: string) {
    await this.$query.where('referrerId', referrerId);
  }

  async referrerName(referrerName: string) {
    await this.$query
      .whereHas('referrer', async referrerQuery => {
        await referrerQuery.where('username', referrerName);
      })
      .preload('referrer', async referrerQuery => {
        await referrerQuery.where('username', referrerName);
      });
  }
}
