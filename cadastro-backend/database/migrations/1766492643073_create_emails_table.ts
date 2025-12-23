import { BaseSchema } from '@adonisjs/lucid/schema'
import { DateTime } from 'luxon'

export default class extends BaseSchema {
  protected tableName = 'emails'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table
        .integer('id_cliente')
        .notNullable()
        .references('id')
        .inTable('clientes')
        .onDelete('CASCADE')
      table.string('email', 255).notNullable().unique()
      table.string('tipo', 50)
      table.boolean('principal').notNullable().defaultTo(false)
      table.boolean('ativo').notNullable().defaultTo(true)

      table
        .timestamp('created_at')
        .notNullable()
        .defaultTo(DateTime.now())
      table
        .timestamp('updated_at')
        .notNullable()
        .defaultTo(DateTime.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}