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
      messages: {
        'logradouro.required': 'O campo "Logradouro" é obrigatório.',
        'logradouro.maxLength': 'O campo "Logradouro" deve possuir no máximo 100 caracteres.',

        'numero.required': 'O campo "Número" é obrigatório.',
        'numero.maxLength': 'O campo "Número" deve possuir no máximo 20 caracteres.',
        'numero.regex': 'O campo "Número" deve ser composto apenas por dígitos numéricos.',

        'complemento.maxLength': 'O campo "Complemento" deve possuir no máximo 100 caracteres.',
        'complemento.required': 'O campo "Complemento" é obrigatório.',

        'bairro.maxLength': 'O campo "Bairro" deve possuir no máximo 100 caracteres.',
        'bairro.required': 'O campo "Bairro" é obrigatório.',

        'cidade.maxLength': 'O campo "Cidade" deve possuir no máximo 100 caracteres.',
        'cidade.required': 'O campo "Cidade" é obrigatório.',

        'estado.maxLength': 'O campo "Estado" deve possuir no máximo 100 caracteres.',
        'estado.required': 'O campo "Estado" é obrigatório.',

        'cep.maxLength': 'O campo "CEP" deve possuir no máximo 100 caracteres.',
        'cep.required': 'O campo "CEP" é obrigatório.',
        'cep.regex': 'O campo "CEP" deve ser composto por 8 dígitos numéricos.',

        'tipo.maxLength': 'O campo "Tipo" deve possuir no máximo 100 caracteres.',
        'tipo.required': 'O campo "Tipo" é obrigatório',
      }
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
      if (error.code === '23505') {
        return response.conflict({
          message: 'Este endereço já está em uso.'
        })
      }

      return response.internalServerError({
        message: 'Erro ao atualizar Endereço.',
        error: error
      })
    }
  }
}