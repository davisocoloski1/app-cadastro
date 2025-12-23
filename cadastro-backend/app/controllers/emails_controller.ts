import Email from '#models/email'
import type { HttpContext } from '@adonisjs/core/http'
import { rules, schema } from '@adonisjs/validator'

export default class EmailsController {
  async store({ auth, request, response }: HttpContext) {
    const authUser = auth.user

    if (!authUser) {
      return response.unauthorized({
        message: 'Você precisa fazer login para realizar essa ação.'
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
      principal: schema.boolean([
        rules.required()
      ])
    })

    const data = await request.validate({
      schema: emailSchema,
      messages: {
        'email.required': 'O campo "E-mail" deve ser preenchido.',
        'email.email': 'Formato de e-mail inválido.',
        'email.maxLength': 'O campo "E-mail" deve possuir no máximo 255 caracteres.',

        'tipo.required': 'O campo "tipo" deve ser preenchido.',
        'tipo.maxLength': 'O campo "tipo" deve possuir no máximo 50 caracteres',

        'principal.required': 'O campo "principal" deve ser preenchido',
      }
    })

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
      const email = Email.create(data)
      return response.created(email)
    } catch (error) {
      return response.status(500).json({
        message: error
      })
    }
  }  
}