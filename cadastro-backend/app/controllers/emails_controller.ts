import Email from '#models/email'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { rules, schema } from '@adonisjs/validator'

export default class EmailsController {
  async store({ auth, request, response }: HttpContext) {
    const authUser = auth.user

    if (!authUser) {
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

    const emailSchema = schema.create({
      email: schema.string({}, [
        rules.required(),
        rules.email(),
        rules.maxLength(255)
      ]),
      tipo: schema.string({}, [
        rules.required(),
        rules.maxLength(50)
      ]),
    })

    const payload = await request.validate({
      schema: emailSchema,
      messages: {
        'email.required': 'O campo "E-mail" deve ser preenchido.',
        'email.email': 'Formato de e-mail inválido.',
        'email.maxLength': 'O campo "E-mail" deve possuir no máximo 255 caracteres.',

        'tipo.required': 'O campo "tipo" deve ser preenchido.',
        'tipo.maxLength': 'O campo "tipo" deve possuir no máximo 50 caracteres',
      }
    })

    const data = { ...payload, id_cliente: clienteId, principal: true }

    try {
      const existingEmail = await Email.query()
        .where('email', data.email)
        .where('ativo', true)
        .first()

      if (existingEmail) {
        return response.status(409).conflict({
          message: 'Este e-mail já está em uso.'
        })
      }
    } catch (error) {
      return response.status(500).json({
        message: error
      })
    }

    try {
      await db.transaction(async (trx) => {
        await Email.query({ client: trx })
          .where('id_cliente', clienteId)
          .where('ativo', true)
          .where('principal', true)
          .update({ principal: false })

        await Email.create(data, { client: trx })
      })
    } catch (error) {
      return response.status(500).json({
        message: error
      })
    }
  }  
}