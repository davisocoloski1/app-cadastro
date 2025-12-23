import { BaseSchema } from '@adonisjs/lucid/schema'
import { DateTime } from 'luxon'

export default class extends BaseSchema {
  protected tableName = 'clientes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('nome', 150).notNullable()
      table.string('cpf_cnpj', 20).notNullable().unique()
      table.boolean('ativo').notNullable().defaultTo(true)
      table.boolean('opt_in').nullable()
      table.timestamp('data_opt_in')
      table.timestamp('data_opt_out')
      table.string('origem', 100)
      table.string('segmento', 100)

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