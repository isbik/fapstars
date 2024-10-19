import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'treads';

  public async up() {
    this.schema.createTable(this.tableName, table => {
      table.bigIncrements('id').primary();
      table.bigInteger('owner_id').unsigned().notNullable().references('users');
      table.bigInteger('league_id').unsigned().notNullable().references('league');

      table.string('content');

      table.timestamp('created_at');
      table.timestamp('updated_at');
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
