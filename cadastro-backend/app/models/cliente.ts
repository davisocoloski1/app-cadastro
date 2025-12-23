import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Cliente extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nome: string

  @column()
  declare cpf_cnpj: string

  @column()
  declare ativo: boolean

  @column()
  declare opt_in: boolean | null

  @column.dateTime()
  declare data_opt_in: DateTime | null

  @column.dateTime()
  declare data_opt_out: DateTime | null

  @column()
  declare origem: string

  @column()
  declare segmento: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}