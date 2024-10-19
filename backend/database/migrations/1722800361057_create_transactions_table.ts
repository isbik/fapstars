import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'transactions';

  public async up() {
    this.schema.createTable(this.tableName, table => {
      table.bigIncrements('id').primary();

      table.bigInteger('owner_id').unsigned().references('users.id').onDelete('CASCADE');

      table.bigInteger('value');
      table.enum('type', ['item', 'tap', 'task', 'invite', 'extra']);
      table.bigInteger('foreign_id').unsigned().nullable().defaultTo(null);

      table.timestamp('created_at');
      table.timestamp('updated_at');
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
