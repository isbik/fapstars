import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'users';

  async up() {
    this.schema.createTable(this.tableName, table => {
      table.bigIncrements('id').primary();
      table.string('username').unique();

      table.bigInteger('tg_id').unsigned().unique();
      table.bigInteger('referrer_id').unsigned().nullable().references('users');

      table.boolean('has_premium').nullable();
      table.string('avatar').nullable();
      table.bigInteger('balance').unsigned().defaultTo(0);

      table.timestamp('created_at');
      table.timestamp('updated_at');
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
