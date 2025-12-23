import { BaseSchema } from '@adonisjs/lucid/schema'
import { DateTime } from 'luxon'

export default class extends BaseSchema {
  protected tableName = 'enderecos'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table
        .integer('id_cliente')
        .notNullable()
        .references('id')
        .inTable('clientes')
        .onDelete('CASCADE')
      table.string('logradouro', 200).notNullable()
      table.string('numero', 20)
      table.string('complemento', 100)
      table.string('bairro', 100)
      table.string('cidade', 100).notNullable()
      table.string('estado', 50).notNullable()
      table.string('cep', 15)
      table.string('pais', 100).notNullable().defaultTo('Brasil')
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