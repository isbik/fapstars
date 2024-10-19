import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'leagues';

  async up() {
    this.schema.alterTable(this.tableName, async () => {
      await this.db.rawQuery(`
      ALTER TABLE leagues
      ADD COLUMN need_verified_at TIMESTAMP DEFAULT (NOW() + INTERVAL '3 day');
    `);
    });
  }

  async down() {
    this.schema.table(this.tableName, table => {
      table.dropColumn('need_verified_at');
    });
  }
}
