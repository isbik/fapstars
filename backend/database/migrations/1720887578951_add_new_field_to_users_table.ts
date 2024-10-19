import { BaseSchema } from '@adonisjs/lucid/schema';

export default class AddNewFieldToUsersTable extends BaseSchema {
  protected tableName = 'users';

  public async up() {
    this.schema.alterTable(this.tableName, table => {
      table.bigInteger('league_id').unsigned().nullable().references('leagues');
    });
  }

  public async down() {
    this.schema.alterTable(this.tableName, table => {
      table.dropColumn('league_id');
    });
  }
}
