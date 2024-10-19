import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'users';

  async up() {
    // lucid not support default now with interval
    await this.db.rawQuery(`
      ALTER TABLE users
      ADD COLUMN stamina_spend_at TIMESTAMP DEFAULT (NOW() - INTERVAL '1 day');
    `);
  }

  async down() {
    this.schema.alterTable(this.tableName, table => {
      table.dropColumn('stamina_spend_at');
    });
  }
}
