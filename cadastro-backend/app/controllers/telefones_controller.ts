import Telefone from '#models/telefone'
import type { HttpContext } from '@adonisjs/core/http'
import { rules, schema } from '@adonisjs/validator'

export default class TelefonesController {
  async store({ auth, request, response }: HttpContext) {
    const user = auth.user

    if (!user) {
      return response.unauthorized({
        message: 'Você precisa fazer login para realizar essa ação.'
      })
    }

    const telefoneSchema = schema.create({
      numero: schema.string({}, [
        rules.required(),
        rules.regex(/^[1-9]{2}\d{9}$/),
        rules.maxLength(20)
      ]),
      tipo: schema.string({}, [
        rules.required(),
        rules.maxLength(30)
      ]),
      principal: schema.boolean([
        rules.required
      ])
    })

    const data = await request.validate({
      schema: telefoneSchema,
      messages: {}
    })

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
      const telefone = await Telefone.create(data)
      return response.created(telefone)
    } catch (error) {
      return response.status(500).json({
        message: error
      })
    }
  }
}