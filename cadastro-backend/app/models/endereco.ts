import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Endereco extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare id_cliente: number

  @column()
  declare logradouro: string

  @column()
  declare numero: string | null

  @column()
  declare complemento: string | null

  @column()
  declare bairro: string | null

  @column()
  declare cidade: string

  @column()
  declare estado: string
  
  @column()
  declare cep: string | null

  @column()
  declare pais: string

  @column()
  declare tipo: string | null

  @column()
  declare principal: boolean

  @column()
  declare ativo: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}