import { compose } from '@adonisjs/core/helpers';
import { BaseModel, column, hasMany, hasOne } from '@adonisjs/lucid/orm';
import type { HasMany, HasOne } from '@adonisjs/lucid/types/relations';
import { Filterable } from 'adonis-lucid-filter';
import { DateTime } from 'luxon';

import LeagueFilter from './filters/league_filter.js';
import Tread from './tread.js';
import User from './user.js';

export default class League extends compose(BaseModel, Filterable) {
  static $filter = () => LeagueFilter;

  @column({ isPrimary: true })
  declare id: string;

  @column()
  declare ownerId: string;

  @column()
  declare name: string;

  @column()
  declare avatar: string | null;

  @column()
  declare balance: string;

  @column()
  declare countryCode: string | null;

  @column()
  declare socialLink: string | null;

  @column()
  declare isAiModel: boolean;

  @column()
  declare isVerified: boolean;

  @column.dateTime()
  declare needVerifiedAt: DateTime;

  @hasOne(() => User, {
    localKey: 'ownerId',
    foreignKey: 'id',
  })
  declare owner: HasOne<typeof User>;

  @hasMany(() => User)
  declare members: HasMany<typeof User>;

  @hasMany(() => Tread, {
    foreignKey: 'leagueId',
  })
  declare treads: HasMany<typeof Tread>;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;

  @column.dateTime({ autoCreate: true, serializeAs: null })
  declare balancedAt: DateTime | null;
}
