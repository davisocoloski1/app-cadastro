import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Email extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare id_cliente: number

  @column()
  declare email: string

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