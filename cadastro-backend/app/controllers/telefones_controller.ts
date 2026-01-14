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
      messages: {
       'numero.required': 'O campo "Número" é obrigatório.',
       'numero.regex': 'O campo "Número" deve possuir 11 dígitos numéricos no formato (00) 00000-0000.',
       'numero.maxLength': 'O campo "Número" deve possuir 11 dígitos numéricos.',

       'tipo.required': 'O campo "Tipo" é obrigatório.',
       'tipo.maxLength': 'O campo "Tipo" deve possuir no máximo 30 caracteres.'
      }
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
  
  async update({ auth, request, response }: HttpContext) {
    const user = auth.user
    if (!user) return response.unauthorized({ message: 'Acesso não autorizado, faça login para realizar essa ação.' })

    try {
      const id = request.param('id')
      const telefone = await Telefone.findOrFail(id)
      if (!telefone) return response.notFound({ message: 'Telefone não encontrado ou inexistente.' })
  
      const data = request.only([
        'numero',
        'tipo',
      ])
  
      telefone.merge(data)
      await telefone.save()
  
      return response.ok({
        message: 'Telefone atualizado com sucesso.',
        data: telefone
      })
    } catch (error) {
      if (error.code === '23505') {
        return response.conflict({
          message: 'Este telefone já está em uso.'
        })
      }

      return response.internalServerError({
        message: 'Erro ao atualizar telefone.',
        error: error
      })
    }
  }
}