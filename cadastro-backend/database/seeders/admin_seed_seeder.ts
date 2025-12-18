import { BaseSeeder } from '@adonisjs/lucid/seeders'
import hash from '@adonisjs/core/services/hash'
import env from '#start/env'
import User from '#models/user'

export default class extends BaseSeeder {
  async run() {
    const email = env.get('ADMIN_EMAIL')
    const password = env.get('ADMIN_PASSWORD')
    const name = env.get('ADMIN_NAME')
    const telefone = env.get('ADMIN_PHONE')

    const existing = await User.query().where('email', email!).first()
    if (existing) return

    await User.create({
      name,
      email,
      telefone,
      password: await hash.make(password!),
      confirmed: true,
      resetToken: null,
      resetExpiresAt: null,
      permission: 'admin',
      deletedAt: null
    })
  }
}