import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'leagues';

  public async up() {
    this.schema.createTable(this.tableName, table => {
      table.bigIncrements('id').primary();
      table.bigInteger('owner_id').unsigned().notNullable().references('users.id').onDelete('CASCADE');

      table.string('name');
      table.string('avatar').nullable();
      table.bigInteger('balance').unsigned().defaultTo(0);
      table.string('social_link').nullable();
      table.boolean('is_ai_model').defaultTo(true);
      table.boolean('is_verified').defaultTo(false);

      table.timestamp('created_at');
      table.timestamp('updated_at');
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
