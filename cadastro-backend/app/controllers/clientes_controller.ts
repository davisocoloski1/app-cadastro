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
        rules.regex(/^\d{11}$|^\[A-Z\d]{12}\d{2}$/)
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
        'cpf_cnpj.regex': 'Formato inválido. O formato deve ser 000.000.000-00 ou 00.000.000/0000-00',

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
      return response.created(cliente)
    } catch (error) {
      return response.status(500).json({
        message: error
      })
    }
  }

  async validarCpf({ request, response }: HttpContext) {
    const cpfLimpo: string[] = request.input('cpf').replace(/\D/g, '').split('')

    if (cpfLimpo.every(d => d === cpfLimpo[0])) {
      return response.badRequest({
        message: 'CPF inválido.'
      })
    }
    
    let soma1 = 0
    for (let i = 0, peso = 10; peso >= 2; peso--, i++) {
      soma1 += Number(cpfLimpo[i]) * peso
    }

    let digito1 = (soma1 * 10) % 11
    if (digito1 === 10) digito1 = 0
    
    let soma2 = 0
    for (let i = 0, peso = 11; peso >= 2; peso--, i++) {
      soma2 += Number(cpfLimpo[i]) * peso
    }

    let digito2 = (soma2 * 10) % 11
    if (digito2 === 10) digito2 = 0

    const [dv1, dv2] = cpfLimpo.slice(-2).map(Number)

    if (digito1 === dv1 && digito2 === dv2) {
      return response.status(200).json({ valido: true })
    }

    return response.badRequest({ valido: false })
  }
}