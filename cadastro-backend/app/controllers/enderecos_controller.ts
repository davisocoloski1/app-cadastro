import Endereco from '#models/endereco'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { rules, schema } from '@adonisjs/validator'

export default class EnderecosController {
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
    })

    const payload = await request.validate({
      schema: enderecoSchema,
      messages: {}
    })

    const data = { ...payload, id_cliente: clienteId, principal: true }

    try {
      await db.transaction(async (trx) => {
        await Endereco.query({ client: trx })
          .where('id_cliente', clienteId)
          .where('ativo', true)
          .where('principal', true)
          .update({ principal: false })

        await Endereco.create(data, { client: trx })
      })
    } catch (error) {
      return response.status(500).json({
        message: error.detail
      })
    }
  }

  async update({ auth, request, response }: HttpContext) {
    const user = auth.user
    if (!user) return response.unauthorized({ message: 'Acesso não autorizado, faça login para realizar essa ação.' })

    try {
      const id = request.param('id')
      const endereco = await Endereco.findOrFail(id)
      if (!endereco) return response.notFound({ message: 'Endereço não encontrado ou inexistente.' })
  
      const data = request.only([
        'logradouro',
        'numero',
        'complemento',
        'bairro',
        'cidade',
        'estado',
        'cep',
        'tipo'
      ])
  
      endereco.merge(data)
      await endereco.save()
  
      return response.ok({
        message: 'Endreço atualizado com sucesso.',
        data: endereco
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Erro ao atualizar Endereço.',
        error: error
      })
    }
  }
}