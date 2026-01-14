import Cliente from '#models/cliente'
import Email from '#models/email'
import Endereco from '#models/endereco'
import Telefone from '#models/telefone'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
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
    .preload('emails')
    .preload('telefones')
    .preload('enderecos')

    return clientes
  }

  async update({ auth, request, response }: HttpContext) {
    const user = auth.user

    if (!user) {
      return response.unauthorized({ message: 'Acesso não autorizado.' })
    }

    const id = request.param('id')
    const cliente = await Cliente.findOrFail(id)
    if (!cliente) return response.notFound({ message: 'Cliente não encontrado ou inexistente' })

    try {
      const data = request.only([
        'nome', 'cpf_cnpj', 'origem', 'segmento'
      ])

      cliente.merge(data)
      await cliente.save()
    } catch (error) {
      if (error.code === '23505') {
        return response.conflict({
          message: 'O CPF/CNPJ inserido já está em uso.'
        })
      }

      return response.internalServerError({
        message: 'Erro ao atualizar cliente.',
        error: error
      })
    }
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

  async deactivateCliente({ auth, request, response }: HttpContext) {
    const user = auth.user

    if (!user) {
      return response.unauthorized({
        message: 'Acesso não autorizado. Faça login para utilizar nossos serviços.'
      })
    }

    const clienteId = request.param('id')

    if (!clienteId) {
      return response.notFound({
        message: 'Cliente não encontrado ou inexistente.'
      })
    }

    try {
      await db.transaction(async (t) => {
        await Cliente.query({ client: t })
          .where('id', clienteId)
          .update({ ativo: false })
  
        await Email.query({ client: t })
          .where('id_cliente', clienteId)
          .update({ ativo: false })
  
        await Telefone.query({ client: t })
          .where('id_cliente', clienteId)
          .update({ ativo: false })
  
        await Endereco.query({ client: t })
          .where('id_cliente', clienteId)
          .update({ ativo: false })
      })
      return response.ok({
        message: 'Cliente e dados relacionados desativados com sucesso.'
      })
    } catch (error) {
      console.log(error)
    }
  }

  async toggleStatusCliente({ auth, request, response }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({
        message: 'Acesso não autorizado. Faça login para utilizar nossos serviços.'
      })
    }

    const clienteId = request.param('id')
    const newStatus = request.param('status')

    if (!clienteId) {
      return response.notFound({
        message: 'Cliente não encontrado ou inexistente.'
      })
    }
    
    if (newStatus !== 'ativar' && newStatus !== 'desativar') {
      return response.badRequest({ message: 'O campo "status" deve ser preenchido como "ativar" ou "desativar".'})
    }
    
    const status = newStatus === 'ativar'

    try {
      await db.transaction(async (t) => {
        const cliente = await Cliente.query({ client: t }).where('id', clienteId).firstOrFail()
        
        if (cliente.ativo === status) {
          throw new Error(`O cliente já está ${status ? 'ativo' : 'inativo'}.`)
        }

        cliente.ativo = status
        await cliente.save()
  
        // When reactivating, we only reactivate the main client entity.
        // Emails, phones, addresses that were individually deactivated should remain so.
        // if (status === true) {
        //   return
        // }

        await Email.query({ client: t })
          .where('id_cliente', clienteId)
          .update({ ativo: status })
  
        await Telefone.query({ client: t })
          .where('id_cliente', clienteId)
          .update({ ativo: status })
  
        await Endereco.query({ client: t })
          .where('id_cliente', clienteId)
          .update({ ativo: status })
      })

      return response.ok({
        message: `Cliente e dados relacionados ${status ? 'ativados' : 'desativados'} com sucesso.`
      })
    } catch (error) {
      if (error.message.includes('ativo') || error.message.includes('inativo')) {
        return response.conflict({ message: error.message })
      }
      return response.internalServerError({
        message: 'Ocorreu um erro ao atualizar o status do cliente.',
        error: error
      })
    }
  }

  async deactivateByType({ auth, request, response }: HttpContext) {
    const user = auth.user

    if (!user) {
      return response.unauthorized({
        message: 'Acesso não autorizado. Faça login para utilizar nossos serviços.'
      })
    }

    const clientId = request.param('id')
    const type = request.param('type')
    const targetId = request.param('targetId')
    const newStatus = request.param('status')

    if (!clientId && !type) {
      return response.notFound({
        message: 'Cliente não encontrado ou parâmetro incorreto.'
      })
    }

    const cliente = await Cliente.findOrFail(clientId)

    if (!cliente) {
      return response.notFound({ message: 'Cliente não encontrado.' })
    }

    if (!cliente.ativo) {
      return response.badRequest({ message: 'Não é possível alterar informações de um cliente inativo. Reative o cliente primeiro.' })
    }

    if (newStatus !== 'ativar' && newStatus !== 'desativar') {
      return response.badRequest({ message: 'O campo "status" deve ser preenchido como "ativar" ou "desativar".'})
    }

    try {
      switch (type) {
        case 'email':
          return this.toggleStatus(Email, clientId, targetId, newStatus, 'E-mail', response)
        case 'telefone':
          return this.toggleStatus(Telefone, clientId, targetId, newStatus, 'Telefone', response)
        case 'endereco':
          return this.toggleStatus(Endereco, clientId, targetId, newStatus, 'Endereço', response)
        default:
          return response.badRequest({ message: 'Tipo de desativação inválido.' })
      }
    } catch (error) {
      return response.internalServerError({ error: error })
    }
  }

  private async toggleStatus(Model: any, clienteId: number, targetId: number, newStatus: string, label: string, response: any) {
    const row = await Model.query().where('id_cliente', clienteId).where('id', targetId).first()

    if (!row) return response.notFound({ message: `${label} não encontrado.` })

    const status = newStatus === 'ativar'
    if (row.ativo && status) {
      return response.conflict({ message: `Esse ${label.toLowerCase()} já está ${status ? 'ativado' : 'desativado'}`})
    }

    row.ativo = status
    await row.save()
    return response.ok({ message: `${label} ${status ? 'ativado' : 'desativado'} com sucesso.` })
  }
}