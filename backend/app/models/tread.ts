import { compose } from '@adonisjs/core/helpers';
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';
import { Filterable } from 'adonis-lucid-filter';
import { DateTime } from 'luxon';

import TreadFilter from './filters/tread_filter.js';
import League from './league.js';
import User from './user.js';

export default class Tread extends compose(BaseModel, Filterable) {
  static $filter = () => TreadFilter;

  @column({ isPrimary: true })
  declare id: string;

  @column()
  declare ownerId: string;

  @column()
  declare leagueId: string;

  @column()
  declare content: string | null;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;

  @belongsTo(() => User, {
    foreignKey: 'ownerId',
  })
  declare owner: BelongsTo<typeof User>;

  @belongsTo(() => League, {
    foreignKey: 'leagueId',
  })
  declare league: BelongsTo<typeof League>;
}
