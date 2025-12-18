import { BaseSeeder } from '@adonisjs/lucid/seeders'
import env from '#start/env'
import User from '#models/user'

export default class extends BaseSeeder {
  async run() {
    const email = String(env.get('ADMIN_EMAIL'))
    const password = String(env.get('ADMIN_PASSWORD'))
    const name = String(env.get('ADMIN_NAME'))
    const telefone = String(env.get('ADMIN_PHONE'))

    const existing = await User.query().where('email', email!).first()
    if (existing) return

    await User.create({
      name,
      email,
      telefone,
      password: String(password),
      confirmed: true,
      resetToken: null,
      resetExpiresAt: null,
      permission: 'admin',
      deletedAt: null
    })
  }
}