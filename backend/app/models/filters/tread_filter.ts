import type { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model';
import { BaseModelFilter } from 'adonis-lucid-filter';

import Tread from '#models/tread';

export default class TreadFilter extends BaseModelFilter {
  declare $query: ModelQueryBuilderContract<typeof Tread>;

  static dropId: boolean = false;

  async leagueId(value: string): Promise<void> {
    await this.$query.where('leagueId', value);
  }

  async ownerId(value: string): Promise<void> {
    await this.$query.where('ownerId', value);
  }

  async content(value: string): Promise<void> {
    await this.$query.where('content', 'LIKE', `%${value}%`);
  }

  async ownerUsername(value: string): Promise<void> {
    await this.$query.whereHas('owner', async query => {
      await query.where('username', 'LIKE', `%${value}%`);
    });
  }

  async leagueName(value: string): Promise<void> {
    await this.$query.whereHas('league', async query => {
      await query.where('name', 'LIKE', `%${value}%`);
    });
  }
}
