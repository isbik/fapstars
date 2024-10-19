import { BaseSchema } from '@adonisjs/lucid/schema';

export default class AddNewFieldToUsersTable extends BaseSchema {
  protected usersTableName = 'users';
  protected leagueTableName = 'leagues';

  public async up() {
    this.schema.alterTable(this.usersTableName, table => {
      table.timestamp('balanced_at').nullable().defaultTo(null);
    });
    this.schema.alterTable(this.leagueTableName, table => {
      table.timestamp('balanced_at').nullable().defaultTo(null);
    });
  }

  public async down() {
    this.schema.alterTable(this.usersTableName, table => {
      table.dropColumn('balanced_at');
    });
    this.schema.alterTable(this.leagueTableName, table => {
      table.dropColumn('balanced_at');
    });
  }
}
