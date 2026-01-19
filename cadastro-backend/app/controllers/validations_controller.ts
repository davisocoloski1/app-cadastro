import type { HttpContext } from '@adonisjs/core/http'

export default class ValidationsController {
  async validarCpf({ request, response }: HttpContext) {
    const cpf = request.input('cpf') || ''
    const cpfLimpo: string[] = cpf.replace(/\D/g, '').split('')
    
    const digitosIguais = cpfLimpo.every((item) => item === cpfLimpo[0])

    if (digitosIguais) {
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

  async validarCpnj({ request, response }: HttpContext) {
    const cnpj = request.input('cnpj') || ''
    const cnpjLimpo = cnpj.replace(/[^A-Z0-9]/g, '')

    const digitosIguais = cnpjLimpo === cnpjLimpo[0].repeat(14)

    if (digitosIguais) {
      return response.badRequest({
        message: 'CNPJ inválido.'
      })
    }

    let soma1 = 0
    for (let i = 0, peso = 5; i < cnpjLimpo.length - 2 ; peso--, i++) {
      if (peso < 2) peso = 9
      soma1 += Number(cnpjLimpo.charCodeAt(i) - 48) * peso
    }

    let digito1 = (11 - (soma1 % 11))
    if (digito1 === 10) digito1 = 1

    let soma2 = 0
    for (let i = 0, peso = 6; i < cnpjLimpo.length - 1 ; peso--, i++) {
      if (peso < 2) peso = 9
        soma2 += Number(cnpjLimpo.charCodeAt(i) - 48) * peso
    }

    let digito2 = (11 - (soma2 % 11))
    if (digito2 === 10) digito2 = 1

    const [dv1, dv2] = cnpjLimpo.slice(-2).split('').map(Number)
    if (digito1 === dv1 && digito2 === dv2) {
      return response.status(200).json({ valido: true })
    }

    return response.badRequest({ valido: false })
  }
}