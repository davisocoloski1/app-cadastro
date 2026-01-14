import type { HttpContext } from '@adonisjs/core/http'
import { schema, rules } from '@adonisjs/validator'
import User from '#models/user'
import axios, { AxiosError } from 'axios'
import { randomBytes } from 'crypto'
import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'

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
        rules.regex(/^[1-9]{2}9\d{8}$/),
        rules.required()
      ]),
      password: schema.string({}, [
        rules.required(),
        rules.minLength(8),
        rules.maxLength(32),
        rules.regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])^[\x21-\x7e]{8,32}$/)
      ]),
      permission: schema.enum(['user', 'admin'], [
        rules.required()
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

        'telefone.regex': 'O formado do telefone está incorreto. Exemplo correto: XX9XXXXXXXX.',
        'telefone.required': 'O campo "Telefone" deve ser preenchido.',

        'password.required': 'O campo "Senha" deve ser preenchido.',
        'password.minLength': 'A senha deve possuir no mínimo 8 caracteres.',
        'password.maxLength': 'A senha deve possuir no máximo 32 caracteres.',
        'password.regex': `A senha deve possuir: 
        - Pelo menos 1 letra maiúscula
        - Pelo menos 1 letra minúscula
        - Pelo menos um digito numérico
        - Pelo menos um caractere especial
        - Entre 8 e 32 caracteres`
      }
    })

    let user

    try {
      user = await User.create(data)
      if (user.id === 1) {
        user.permission = 'admin'
        await user.save()
      }
    } catch (err) {
      if (err.code === '23505') {
        if (err.detail?.includes('email')) {
          return response.status(400).json({ message: 'Este e-mail já está em uso.' })
        } else if (err.detail?.includes('telefone')) {
          return response.status(400).json({ message: 'Este telefone já está em uso.' })
        }
      } else {
        throw err
      }
    }

    return response.created(user)
  }

  async adminStore({ auth, request, response }: HttpContext) {
    const admin = auth.user!.permission

    if (admin !== 'admin') {
      return response.unauthorized({
        message: 'Você não possui a permissão necessária para realizar essa ação.'
      })
    }

    const createUser = schema.create({
      name: schema.string({}, [
        rules.required(),
        rules.minLength(3),
        rules.maxLength(100),
      ]),
      email: schema.string({}, [
        rules.required(),
        rules.email()
      ]),
      telefone: schema.string({}, [
        rules.required(),
        rules.regex(/^55\d{11}$/)
      ]),
      password: schema.string({}, [
        rules.required(),
        rules.minLength(6),
        rules.maxLength(20)
      ]),
      permission: schema.enum(['user', 'admin'], [
        rules.required(),
      ])
    })

    const data = await request.validate({
      schema: createUser,
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
        'password.maxLength': 'A senha deve possuir no máximo 20 caracteres.',

        'permission.enum': 'A categoria do usuário deve ser selecionada como "Usuário" ou "Admin"',
        'permission.required': 'A categoria do usuário é um campo obrigatório.'
      }
    })

    try {
      const user = await User.create(data)
      return response.created(user)
    } catch (error) {
      if (error.code === '23505') {
        if (error.detail?.includes('email')) {
          return response.status(400).json({ message: 'Este e-mail já está em uso.' })
        } else if (error.detail?.includes('telefone')) {
          return response.status(400).json({ message: 'Este telefone já está em uso.' })
        }
      } else {
        console.log(error)
      }
    }
  }

  async login({ auth, request, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    try {
      const user = await User.verifyCredentials(email, password)

      if (!user || user.deletedAt) {
        return response.unauthorized({
          message: 'Credenciais inválidas.'
        })
      }

      const token = await auth.use('api').createToken(user, [], { expiresIn: '6h' })

      return response.ok({
        user,
        token: token.value!.release(),
        expiresAt: token.expiresAt?.toISOString()
      })
    } catch (error) {
      return response.unauthorized({
        message: 'Credenciais inválidas.',
        error: error
      })
    }
  }

  async logout({ auth, response }: HttpContext) {
    await auth.use('api').invalidateToken()

    return response.ok({
      message: 'Logout realizado com sucesso.'
    })
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

  async getUserInfo({ auth, response }: HttpContext) {
    const user = auth.user!

    try {
      const getUser = await User.query()
      .where('id', user.id)
      .whereNotNull('confirmed')
      .whereNull('deleted_at')
      .first()

      if (!user) {
        return response.status(404).json({
          message: "Usuário não encontrado ou não confirmado."
        })
      }

      return response.ok({
        id: getUser?.id,
        name: getUser?.name,
        email: getUser?.email,
        telefone: getUser?.telefone,
        password: getUser?.password,
        permission: getUser?.permission,
        confirmed: getUser?.confirmed,
      })
    } catch (error) {
      console.error(error)
      return response.status(500).json({
        message: "Erro ao captar informações do usuário."
      })
    }
  }

  async index({ auth, response }: HttpContext) {
    const user = auth.user

    if (!user) {
      return response.unauthorized({
        message: 'Você precisa está logado para acessar.'
      })
    }

    const admin = auth.user.permission === 'admin'

    if (!admin) {
      return response.unauthorized({
        message: 'Acesso restrito a administradores.'
      })
    }

    const users = await User.query()
    .whereNull('deleted_at')
    .select(
      'id',
      'name',
      'email',
      'telefone',
      'permission',
      'confirmed',
    )

    return users
  }

  async getUserById({ request }: HttpContext) {
    const { id } = request.only(['id'])

    const getUser = await User.query()
    .where('id', id)
    .select(
      'id',
      'name',
      'email',
      'telefone',
      'permission',
      'confirmed',
    )

    return getUser
  }

  async searchUser({ request, response }: HttpContext) {
    const { query } = request.only(['query'])

    const userFound = await User.query()
    .whereILike('email', `%${query}%`)
    .orWhereILike('name', `%${query}%`)

    if (!userFound) {
      return response.notFound({
        message: 'Usuário não encontrado ou inexistente.'
      })
    }

    return response.ok(userFound)
  }

  async update({ auth, request, response }: HttpContext) {
    const authUser = auth.user
    const idFromRequest = request.input('id')

    if (!authUser) {
      return response.unauthorized({
        message: 'Ação não autorizada.'
      })
    }

    if (!authUser.confirmed) {
      return response.unauthorized({
        message: 'Você precisa verificar sua conta para editar as informações.'
      })
    }

    const updateUser = schema.create({
      name: schema.string.optional({ trim: true }, [
        rules.minLength(3),
        rules.maxLength(100),
      ]),
      email: schema.string.optional({}, [
        rules.email(),
        rules.maxLength(254),
      ]),
      telefone: schema.string.optional({}, [
        rules.regex(/^[1-9]{2}9\d{8}$/),
      ]),
    })

    const data = await request.validate({
      schema: updateUser,
      messages: {
        'name.string': 'O nome deve ser um texto válido.',
        'name.minLength': 'O nome deve possuir no mínimo 3 caracteres.',
        'name.maxLength': 'O nome deve possuir no máximo 100 caracteres.',

        'email.email': 'O e-mail digitado é inválido.',
        'email.maxLength': 'O e-mail deve possuir no máximo 254 caracteres.',

        'telefone.regex':
          'O formato do telefone está incorreto. Exemplo correto: XX9XXXXXXXX.',
      },
    })

    let userIdToUpdate: number

    if (authUser.permission === 'admin') {
      if (!idFromRequest) {
        return response.badRequest({ message: 'ID do usuário é obrigatório.' })
      }
      userIdToUpdate = Number(idFromRequest)
    } else {
      userIdToUpdate = authUser.id
    }

    const user = await User.findOrFail(userIdToUpdate)

    if (data.name !== undefined) {
      user.name = data.name
    }

    if (data.telefone !== undefined) {
      user.telefone = data.telefone
    }

    try {
      if (data.email) {
        const emailExists = await User.query()
        .where('email', data.email)
        .orWhere('unconfirmed_email', data.email)
        .whereNot('id', user.id)
        .first()

        if (emailExists && !(user.email === data.email)) {
          return response.badRequest({
            message: 'O e-mail informado já está em uso.'
          })
        }
      }

      if (data.telefone) {
        const telefoneExists = await User.query()
        .where('telefone', data.telefone)
        .whereNot('id', user.id)
        .first()

        if (telefoneExists) {
          return response.badRequest({
            message: 'O telefone informado já está em uso.'
          })
        }
      }

      if (data.email && user.email !== data.email) {
        const existingToken = user.resetToken && user.resetExpiresAt && user.resetExpiresAt > DateTime.now()
    
        if (existingToken) {
          return response.status(200).ok({
            message: `Um link de confirmação já foi enviado para o e-mail.`
          })
        }
        
        const token = randomBytes(32).toString('hex')
        user.unconfirmedEmail = data.email
        user.resetToken = token
        user.resetExpiresAt = DateTime.now().plus({ minutes: 15 })
        
        try {
          await axios.post(`${this.pythonApi}/send_change_mail_link`, { email: data.email, token: token })
        } catch (error) {
          console.log(error)
        }
      }

      await user.save()
    } catch (error: any) {
      console.error(error)
      return response.status(500).json({
        message: 'Erro ao atualizar os dados de usuário.'
      })
    } 

    return response.ok({
      id: user.id,
      name: user.name,
      email: user.email,
      telefone: user.telefone,
      confirmed: user.confirmed
    })
  }

  async confirmEmailUpdate({ request, response }: HttpContext) {
    const confirmEmailSchema = schema.create({
      token: schema.string({}, [rules.required()]),
    })

    const { token } = await request.validate({
      schema: confirmEmailSchema,
      messages: {
        'token.required': 'Link inválido ou expirado.',
      },
    })

    const user = await User.query()
      .where('reset_token', token)
      .where('reset_expires_at', '>', DateTime.now().toISO())
      .first()

    if (!user) {
      return response.badRequest({ message: 'Link inválido ou expirado.' })
    }

    if (user.unconfirmedEmail) {
      user.email = user.unconfirmedEmail
      user.unconfirmedEmail = null
      user.resetToken = null
      user.resetExpiresAt = null
      await user.save()

      return response.ok({ message: 'E-mail alterado com sucesso.' })
    }

    return response.badRequest({ message: 'Nenhuma alteração de e-mail pendente.' })
  }

  async updatePassword({ auth, request, response }: HttpContext) {
    const authUser = auth.user!

    if (!authUser) {
      return response.unauthorized({
        message: 'Ação não autorizada.'
      })
    }

    const updatePassword = schema.create({
      password: schema.string({}, [
        rules.required(),
        rules.minLength(6),
        rules.maxLength(20),
        rules.regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])^[\x21-\x7e]{8,32}$/)
      ]),
      password_confirmation: schema.string({}, [
        rules.confirmed('password'),
        rules.required(),
      ])
    })

    const data = await request.validate({
      schema: updatePassword,
      messages: {
        'confirmed': 'As senhas não conferem.',
        'password.required': 'A senha é obrigatória.',
        'password.minLength': 'A senha deve possuir no mínimo 6 caracteres.',
        'password.maxLength': 'A senha deve possuir no máximo 20 caracteres.',
        'password_confirmation.required': 'A confirmação de senha é obrigatória.',
        'password.regex': `A senha deve possuir: 
        - Pelo menos 1 letra maiúscula
        - Pelo menos 1 letra minúscula
        - Pelo menos um digito numérico
        - Pelo menos um caractere especial
        - Entre 8 e 32 caracteres`,
      }
    })

    try {
      const user = await User.findOrFail(authUser.id)

      user.password = data.password
      await user.save()
    } catch (error: any) {
      console.log(error.messages)
      return response.status(500).json({
        msg: 'Ocorreu um erro ao alterar a senha.'
      })
    }
  }

  async enviarRecuperacao({ request, response }: HttpContext) {
    const { email } = request.only(['email'])
    
    const user = await User.findBy('email', email)
    
    if (!user) {
      return response.status(404).notFound({
        message: 'Email não encontrado, inválido ou não cadastrado.\nVerifique erros de digitação.'
      })
    }
    
    const existingToken = user.resetToken && user.resetExpiresAt && user.resetExpiresAt > DateTime.now()
    
    if (existingToken) {
      return response.status(200).ok({
        message: `E-mail enviado`
      })
    }
    
    const token = randomBytes(32).toString('hex')
    user.resetToken = token
    user.resetExpiresAt = DateTime.now().plus({ minutes: 15 })
    await user.save()

    try {
      await axios.post(`${this.pythonApi}/send_recuperation_link`, { email, token }, { timeout: 10000 })
      console.log("OK")
    } catch (error) {
      console.log('AXIOS CODE:', error.code)
      console.log('AXIOS MESSAGE:', error.message)
      console.log('AXIOS RESPONSE:', error.response?.status, error.response?.data)
      return response.status(500).json({ msg: 'Erro ao enviar email.' })
    }

    return response.ok({
      message: `E-mail enviado.`
    })
  }

  async validarToken({ request, response }: HttpContext) {
    const { token } = request.only(['token'])

    if (!token) {
      return response.badRequest({
        message: 'Link inválido ou expirado.'
      })
    }

    const user = await User.query()
    .where('reset_token', token)
    .where('reset_expires_at', '>', DateTime.now().toJSDate())
    .first()

    if (!user) {
      return response.badRequest({
        message: 'Link inválido ou expirado.'
      })
    }

    return response.ok({ valid: true })
  }

  async recuperarSenha({ request, response }: HttpContext) {
    const updatePassword = schema.create({
      token: schema.string({}, [rules.required()]),
      password: schema.string({}, [
        rules.required(),
        rules.minLength(6),
        rules.maxLength(20),
        rules.regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])^[\x21-\x7e]{8,32}$/)
      ]),
      password_confirmation: schema.string({}, [
        rules.required(),
        rules.confirmed('password')
      ])
    })

    const data = await request.validate({
      schema: updatePassword,
      messages: {
        'token.required': 'Link inválido ou expirado.',
        'password.required': 'A senha é obrigatória.',
        'password.minLength': 'A senha deve possuir no mínimo 6 caracteres.',
        'password.maxLength': 'A senha deve possuir no máximo 20 caracteres.',
        'password_confirmation.required': 'A confirmação de senha é obrigatória.',
        'password.regex': `A senha deve possuir: 
        - Pelo menos 1 letra maiúscula
        - Pelo menos 1 letra minúscula
        - Pelo menos um digito numérico
        - Pelo menos um caractere especial
        - Entre 8 e 32 caracteres`,
        'confirmed': 'As senhas não conferem.'
      }
    })

    try {
      const user = await User.query()
      .where('reset_token', data.token)
      .where('reset_expires_at', '>', DateTime.now().toJSDate())
      .first()

      if (!user) {
        return response.status(400).json({
          message: 'Link inválido ou expirado.'
        })
      }

      user.password = data.password
      user.resetExpiresAt = null
      user.resetToken = null
      await user.save()
    } catch (error: any) {
      console.log(error.messages)
      return response.status(500).json({
        msg: 'Ocorreu um erro ao alterar a senha.'
      })
    }

    return response.ok({
      message: 'Senha alterada com sucesso.'
    })
  }

  async destroy({ auth, request, response }: HttpContext) {
    const authUser = auth.user
    const password = request.input('password')
    const idFromRequest = request.input('id')

    if (!authUser) {
      return response.unauthorized({
        message: 'Acesso não autorizado.'
      })
    }

    if (authUser.id === idFromRequest) {
      return response.forbidden({
        message: 'Você não pode deletar sua própria conta.'
      })
    }

    let userToDelete: User | null = null

    if (authUser.permission === 'admin') {
      if (!idFromRequest) {
        return response.badRequest({
          message: 'ID do usuário é obrigatório.'
        })
      }

      userToDelete = await User.find(idFromRequest)

      if (!userToDelete) {
        return response.notFound({
          message: 'Usuário não encontrado.'
        })
      }
    } else {
      if (!password) {
        return response.badRequest({
          message: 'Senha obrigatória para excluir a conta.'
        })
      }

      userToDelete = await User.find(authUser.id)

      if (!userToDelete) {
        return response.notFound({
          message: 'Usuário não encontrado.'
        })
      }

      const ok = await hash.verify(userToDelete.password, password)
      if (!ok) {
        return response.unauthorized({
          message: 'Senha inválida.'
        })
      }
    }

    userToDelete.deletedAt = DateTime.now()
    userToDelete.confirmed = false
    userToDelete.resetToken = null
    userToDelete.resetExpiresAt = null

    await userToDelete.save()

    return response.ok({
      message: 'Usuário deletado com sucesso.'
    })
  }
}