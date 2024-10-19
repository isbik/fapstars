import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'users';

  async up() {
    this.schema.table(this.tableName, table => {
      table.integer('daily_award_steak').unsigned().defaultTo(0);
      table.dateTime('daily_award_claimed_at').defaultTo(`NOW()`);
    });
  }

  async down() {
    this.schema.table(this.tableName, table => {
      table.dropColumn('daily_award_steak');
      table.dropColumn('daily_award_claimed_at');
    });
  }
}
