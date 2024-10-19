import { BaseSchema } from "@adonisjs/lucid/schema"

export default class extends BaseSchema {
  protected tableName = "leagues"

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      return table.string("country_code", 10).nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn("country_code")
    })
  }
}
