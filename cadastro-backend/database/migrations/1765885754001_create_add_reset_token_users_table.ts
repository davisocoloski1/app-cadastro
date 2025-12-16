import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddResetTokenUsers extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('confirmed').notNullable().defaultTo(false).alter()
      table.string('reset_token', 255).nullable().index()
      table.timestamp('reset_expires_at', { useTz: true }).nullable() 
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('reset_token')
      table.dropColumn('reset_expires_at')
      table.boolean('confirmed').nullable().alter()
    })
  }
}