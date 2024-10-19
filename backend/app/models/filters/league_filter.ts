import type { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model';
import { BaseModelFilter } from 'adonis-lucid-filter';

import League from '#models/league';

export default class LeagueFilter extends BaseModelFilter {
  declare $query: ModelQueryBuilderContract<typeof League>;

  static dropId: boolean = false;

  async name(value: string): Promise<void> {
    await this.$query.where('name', 'LIKE', `%${value}%`);
  }
}
