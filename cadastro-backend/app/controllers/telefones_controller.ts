import Telefone from '#models/telefone'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { rules, schema } from '@adonisjs/validator'

export default class TelefonesController {
  async store({ auth, request, response }: HttpContext) {
    const user = auth.user

    if (!user) {
      return response.unauthorized({
        message: 'Você precisa fazer login para realizar essa ação.'
      })
    }
    
    const clienteId = request.param('id')
    if (!clienteId) {
      return response.notFound({
        message: 'ID do cliente inexistente ou não encontrado.'
      })
    }

    const telefoneSchema = schema.create({
      numero: schema.string({}, [
        rules.required(),
        rules.regex(/^[1-9]{2}\d{9}$/),
        rules.maxLength(11)
      ]),
      tipo: schema.string({}, [
        rules.required(),
        rules.maxLength(30)
      ]),
    })

    const payload = await request.validate({
      schema: telefoneSchema,
      messages: {}
    })

    const data = { ...payload, id_cliente: clienteId, principal: true }

    try {
      const existingTelefone = await Telefone.query().where('numero', data.numero).where('ativo', true).first()

      if (existingTelefone) {
        return response.status(409).json({
          message: 'Este número de telefone já está em uso'
        })
      }
    } catch (error) {
      return response.status(500).json({
        message: error
      })
    }

    try {
      await db.transaction(async (trx) => {
        await Telefone.query({ client: trx })
          .where('id_cliente', clienteId)
          .where('ativo', true)
          .where('principal', true)
          .update({ principal: false })

        await Telefone.create(data, { client: trx })
      })

      // const telefone = await Telefone.create(data)
      // return response.created(telefone)
    } catch (error) {
      return response.status(500).json({
        message: error
      })
    }
  }
}