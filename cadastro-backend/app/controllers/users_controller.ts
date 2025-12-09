import type { HttpContext } from '@adonisjs/core/http'
import { schema, rules } from '@adonisjs/validator'
import User from '#models/user'
import axios from 'axios'

export default class UsersController {
  private pythonApi = 'http://localhost:8000/send_mail_confirmation'

  async store({ request, response }: HttpContext) {
    const newUser = schema.create({
      nome: schema.string({}, [
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
        rules.required()
      ])
    })

    const data = await request.validate({
      schema: newUser,
      messages: {
        'nome.string': 'O nome não deve possuir dígitos numéricos.',
        'nome.minLength': 'O nome deve possuir no mínimo 3 caracteres.',
        'nome.maxLength': 'O nome deve possuir no máximo 100 caracteres',
        'nome.required': 'O campo "Nome" deve ser preenchido.',

        'email.email': 'O e-mail digitado é inválido.',
        'email.required': 'O campo "E-mail" deve ser preenchido.',

        'telefone.regex': 'O formado do telefone está incorreto. Exemplo correto: 55XX9XXXXXXXX.',
        'telefone.required': 'O campo "Telefone" deve ser preenchido.',

        'passoword.required': 'O campo "Senha" deve ser preenchido.'
      }
    })

    const user = await User.create(data)
    
    try {
      await axios.post(this.pythonApi, { email: data.email, name: data.nome })
    } catch (err: any) {
      console.log(err)
    }

    return response.created(user)
  } 
}