import Endereco from '#models/endereco'
import type { HttpContext } from '@adonisjs/core/http'
import { rules, schema } from '@adonisjs/validator'

export default class EnderecosController {
  async store({ auth, request, response }: HttpContext) {
    const authUser = auth.user

    if (!authUser) {
      return response.unauthorized({
        message: 'Você precisa fazer login para realizar essa ação.'
      })
    }

    const enderecoSchema = schema.create({
      logradouro: schema.string({}, [
        rules.required(),
        rules.maxLength(200)
      ]),
      numero: schema.string({}, [
        rules.required(),
        rules.maxLength(20),
        rules.regex(/^\d+$/)
      ]),
      complemento: schema.string({}, [
        rules.required(),
        rules.maxLength(100)
      ]),
      bairro: schema.string({}, [
        rules.required(),
        rules.maxLength(100)
      ]),
      cidade: schema.string({}, [
        rules.required(),
        rules.maxLength(100)
      ]),
      estado: schema.string({}, [
        rules.required(),
        rules.maxLength(50)
      ]),
      cep: schema.string({}, [
        rules.required(),
        rules.maxLength(15),
        rules.regex(/^\d{8}$/)
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
      schema: enderecoSchema,
      messages: {}
    })

    try {
      const endereco = await Endereco.create(data)
      return response.created(endereco)
    } catch (error) {
      return response.status(500).json({
        message: error.detail
      })
    }
  }
}