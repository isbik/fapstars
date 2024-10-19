import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'users';

  async up() {
    this.schema.alterTable(this.tableName, table => {
      table.integer('multitap_level').defaultTo(1);
    });

    this.schema.alterTable(this.tableName, table => {
      table.integer('energy_limit_level').defaultTo(1);
    });

    // we have limit for 3 busters, every buster restored after 4 hour
    this.schema.alterTable(this.tableName, table => {
      table.dateTime('full_energy_booster_at').defaultTo(`NOW()`);
    });

    this.schema.alterTable(this.tableName, table => {
      table.dateTime('full_turbo_booster_at').defaultTo(`NOW()`);
    });
  }

  async down() {
    this.schema.alterTable(this.tableName, table => {
      table.dropColumn('multitap_level');
    });

    this.schema.alterTable(this.tableName, table => {
      table.dropColumn('energy_limit_level');
    });

    this.schema.alterTable(this.tableName, table => {
      table.dropColumn('full_energy_booster_at');
    });

    this.schema.alterTable(this.tableName, table => {
      table.dropColumn('full_turbo_booster_at');
    });
  }
}
