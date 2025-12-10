import type { HttpContext } from '@adonisjs/core/http'
import { schema, rules } from '@adonisjs/validator'
import User from '#models/user'
import axios, { AxiosError } from 'axios'

export default class UsersController {
  private pythonApi = 'http://localhost:8000'

  async store({ request, response }: HttpContext) {
    const newUser = schema.create({
      name: schema.string({}, [
        rules.minLength(3),
        rules.maxLength(100),
        rules.required()
      ]),
      email: schema.string({}, [
        rules.email(),
        rules.required()
      ]),
      telefone: schema.string({}, [
        rules.regex(/^55\d{11}$/),
        rules.required()
      ]),
      password: schema.string({}, [
        rules.required(),
        rules.minLength(6),
        rules.maxLength(20)
      ])
    })

    const data = await request.validate({
      schema: newUser,
      messages: {
        'name.string': 'O nome não deve possuir dígitos numéricos.',
        'name.minLength': 'O nome deve possuir no mínimo 3 caracteres.',
        'name.maxLength': 'O nome deve possuir no máximo 100 caracteres',
        'name.required': 'O campo "Nome" deve ser preenchido.',

        'email.email': 'O e-mail digitado é inválido.',
        'email.required': 'O campo "E-mail" deve ser preenchido.',

        'telefone.regex': 'O formado do telefone está incorreto. Exemplo correto: 55XX9XXXXXXXX.',
        'telefone.required': 'O campo "Telefone" deve ser preenchido.',

        'password.required': 'O campo "Senha" deve ser preenchido.',
        'password.minLength': 'A senha deve possuir no mínimo 6 caracteres.',
        'password.maxLength': 'A senha deve possuir no máximo 20 caracteres.'
      }
    })

    const resend = request.input('resend')
    const resendNumber = Number(resend) || 0
    let user

    try {
      user = await User.create(data)
    } catch (err) {
      if (err.code === '23505') {
        if (err.detail?.includes('email')) {
          return response.status(400).json({ message: 'Este e-mail já está em uso.' })
        } else if (err.detail?.includes('telefone')) {
          return response.status(400).json({ message: 'Este telefone já está em uso.' })
        }
      }
    }

    try {
      await axios.post(`${this.pythonApi}/send_mail_confirmation`, { email: data.email, name: data.name }, { params: { resend: resendNumber } })
    } catch (err: any) {
      console.log(err.response.data || err.message)
      return response.status(500).json(
        {message: 'Erro ao enviar código de confirmação'}
      )
    }

    return response.created(user)
  }

  async login({ request, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    try {
      const user = await User.verifyCredentials(email, password)
      const token = await User.accessTokens.create(user)

      return response.ok({
        user,
        token: token.value!.release()
      })
    } catch {
      return response.unauthorized({
        message: "Credenciais inválidas."
      })
    }
  }

  async resendConfirmationCode({ request, response }: HttpContext) {
    const { email, name, resend } = request.only(['email', 'name', 'resend'])
    const resendNumber = Number(resend) || 0

    try {
      await axios.post(`${this.pythonApi}/send_mail_confirmation`, { email: email, name: name }, { params: { resend: resendNumber } })
    } catch (err: any) {
      console.log(err.response.data || err.message)
      return response.status(500).json(
        {message: 'Erro ao enviar código de confirmação'}
      )
    }

    return response.ok({ resend: resendNumber })
  }

  async account_confirmation({ request, response }: HttpContext) {
    const { email, code } = request.body()

    try {
      const is_valid = await axios.get(`${this.pythonApi}/receive_confirmation_code`, {
        params: { email, code }
      })

      if (is_valid.data) {
        await User.query().where('email', email).update({ confirmed: true })
        return response.ok("Código validado com sucesso!")
      } else {
        return response.badRequest("O código recebido é inválido.")
      }
    } catch (err: any) {
      const error = err as AxiosError

      if (error.response) {
        console.log('Status', error.response.status)
        console.log('Data:', error.response.data)
        console.log('Headers', error.response.headers)
      } else if (error.request) {
        console.log('Request error', error.request)
      } else {
        console.log('Erro: ', error.message)
      }

      return response.internalServerError('Ocorreu um erro ao validar o código.')
    }
  }
}