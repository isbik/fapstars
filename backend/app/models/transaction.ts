import { BaseModel, column, hasOne } from '@adonisjs/lucid/orm';
import type { HasOne } from '@adonisjs/lucid/types/relations';
import { DateTime } from 'luxon';

import User from './user.js';

export default class Transaction extends BaseModel {
  @column({ isPrimary: true })
  declare id: string;

  @column()
  declare ownerId: string;

  @column()
  declare value: string;

  @column()
  declare type: string;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;

  @hasOne(() => User, {
    localKey: 'ownerId',
    foreignKey: 'id',
  })
  declare owner: HasOne<typeof User>;
}
