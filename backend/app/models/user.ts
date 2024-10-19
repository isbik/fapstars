import { compose } from '@adonisjs/core/helpers';
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';
import { Filterable } from 'adonis-lucid-filter';
import { DateTime } from 'luxon';

import UserFilter from './filters/user_filter.js';
import League from './league.js';

export default class User extends compose(BaseModel, Filterable) {
  static $filter = () => UserFilter;

  @column({ isPrimary: true })
  declare id: string;

  @column()
  declare tgId: string;

  @column()
  declare username: string;

  @column() // лига в которой состоит пользователь
  declare leagueId: string | null;

  @column() // id пользователя который приглосил
  declare referrerId: string | null;

  @column()
  declare hasPremium: boolean;

  @column()
  declare avatar: string | null;

  @column()
  declare balance: string;

  @column.dateTime()
  declare fullEnergyBoosterAt: DateTime;

  @column.dateTime()
  declare fullTurboBoosterAt: DateTime;

  @column.dateTime()
  declare staminaSpendAt: DateTime;

  @column()
  declare multitapLevel: number;

  @column()
  declare dailyAwardSteak: number;

  @column.dateTime()
  declare dailyAwardClaimedAt: DateTime;

  @column()
  declare energyLimitLevel: number;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;

  @column.dateTime({ autoCreate: true, serializeAs: null })
  declare balancedAt: DateTime | null;

  @belongsTo(() => League)
  declare league: BelongsTo<typeof League>;

  @belongsTo(() => User, {
    localKey: 'referrerId',
    foreignKey: 'id',
  })
  declare referrer: BelongsTo<typeof User>;
}
