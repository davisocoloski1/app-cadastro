import type { HttpContext } from '@adonisjs/core/http'

export default class ValidationsController {
  async validarCpf({ request, response }: HttpContext) {
    const cpfLimpo = request.input('cpf').replace(/\D/g, '').split('')
    
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

    console.log(cpfLimpo.slice(-2))
    const [dv1, dv2] = cpfLimpo.slice(-2).map(Number)

    if (digito1 === dv1 && digito2 === dv2) {
      return response.status(200).json({ valido: true })
    }

    return response.badRequest({ valido: false })
  }
}