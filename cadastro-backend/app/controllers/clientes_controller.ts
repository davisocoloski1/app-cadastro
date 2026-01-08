import Cliente from '#models/cliente'
import type { HttpContext } from '@adonisjs/core/http'
import { rules, schema } from '@adonisjs/validator'

export default class ClientesController {
  public async store({ auth, request, response }: HttpContext) {
    const authUser = auth.user

    if (!authUser) {
      return response.unauthorized({
        message: 'Você precisa fazer login para realizar essa ação.'
      })
    }
    
    const clientSchema = schema.create({
      nome: schema.string({}, [
        rules.minLength(3),
        rules.maxLength(150),
        rules.required()
      ]),
      cpf_cnpj: schema.string({}, [
        rules.minLength(11),
        rules.maxLength(14),
        rules.required(),
        rules.regex(/^\d{11}$|^[A-Z\d]{12}\d{2}$/)
      ]),
      origem: schema.string({}, [
        rules.maxLength(100),
        rules.required()
      ]),
      segmento: schema.string({}, [
        rules.maxLength(100),
        rules.required()
      ])
    })

    const data = await request.validate({
      schema: clientSchema,
      messages: {
        'nome.minLength': 'O campo "nome" deve possuir no mínimo 3 caracteres.',
        'nome.maxLength': 'O campo "nome" deve possuir no máximo 150 caracteres.',
        'nome.required': 'O campo "nome" deve ser preenchido.',

        'cpf_cnpj.minLength': 'O campo "CPF/CNPJ" deve possuir no mínimo 11 dígitos.',
        'cpf_cnpj.maxLength': 'O campo "CPF/CNPJ" deve possuir no máximo 14 dígitos.',
        'cpf_cnpj.required': 'O campo "CPF/CNPJ" deve ser preenchido.',
        'cpf_cnpj.regex': 'O formato do CPF/CNPJ deve ser 000.000.000-00 ou 00.000.000/0000-00',

        'origem.maxLength': 'O campo "Origem" deve possuir no máximo 100 caracteres.',
        'origem.required': 'O campo "Origem" deve ser preenchido.',

        'segmento.maxLength': 'O campo "Segmento" deve possuir no máximo 100 caracteres.',
        'segmento.required': 'O campo "Segmento" deve ser preenchido.'
      }
    })

    try {
      const existingCpf = await Cliente.query()
        .where('cpf_cnpj', data.cpf_cnpj)
        .where('ativo', true)
        .first()

      if (existingCpf) {
        return response.status(409).json({
          message: 'Esse CPF já está em uso.'
        })
      }
    } catch (error) {
      return response.status(500).json({
        message: error
      })
    }

    try {
      const cliente = await Cliente.create(data)
      return response.created({ cliente: cliente, cliente_id: cliente.id})
    } catch (error) {
      return response.status(500).json({
        message: error
      })
    }
  }

  async index({ auth, response }: HttpContext) {
    const user = auth.user

    if (!user) {
      return response.unauthorized({
        message: 'Acesso não autorizado. Faça login para utilizar nossos serviços.'
      })
    }

    const clientes = await Cliente.query()
    .where('ativo', true) 
    .preload('emails')
    .preload('telefones')
    .preload('enderecos')

    return clientes
  }

  async searchCliente({ auth, request, response }: HttpContext) {
    const user = auth.user

    if (!user) {
      return response.unauthorized({
        message: 'Acesso não autorizado. Faça login para utilizar nossos serviços.'
      })
    }

    const { query: searchTerm } = request.only(['query'])

    const clientes = await Cliente.query()
    .where((mainQuery) => {
      mainQuery
        .whereILike('nome', `%${searchTerm}%`)
        .orWhereILike('cpf_cnpj', `%${searchTerm}%`)

      mainQuery.orWhereHas('emails', (query) => {
        query.whereILike('email', `%${searchTerm}%`)
      })

      mainQuery.orWhereHas('telefones', (query) => {
        query.whereILike('numero', `%${searchTerm}%`)
      })
    })
    .preload('emails')
    .preload('telefones')
    .preload('enderecos')

    if (clientes.length === 0) {
      return response.notFound({
        message: 'Cliente não encontrado ou inexistente.'
      })
    }

    return clientes
  }

  async getById({ auth, request, response }: HttpContext) {
    const user = auth.user

    if (!user) {
      return response.unauthorized({
        message: 'Acesso não autorizado. Faça login para utilizar nossos serviços.'
      })
    }

    const id  = request.param('id')

    if (!id) {
      return response.conflict({
        message: 'O ID do usuário deve ser indicado.'
      })
    }

    const cliente = await Cliente.query()
    .where('id', id)
    .preload('emails')
    .preload('telefones')
    .preload('enderecos')
    
    return cliente
  }
}