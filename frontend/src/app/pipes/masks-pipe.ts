import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'masks',
  standalone: false
})
export class MasksPipe implements PipeTransform {

  transform(value: string, type: 'cpf' | 'cnpj' | 'tel' | 'doc' | 'cep') {
    if (!value) return ''

    switch (type) {
      case 'cpf':
        return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
      case 'cnpj':
        return value.replace(/([A-Z0-9]{2})([A-Z0-9]{3})([A-Z0-9]{3})([A-Z0-9]={4})([A-Z0-9]{2})/, `$1.$2.$3/$4-$5`)
      case 'tel':
        if (value.length === 10) {
          return value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
        }
        return value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
      case 'doc':
        if (value.length === 11) {
          return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
        } else {
          return value.replace(/([A-Z0-9]{2})([A-Z0-9]{3})([A-Z0-9]{3})([A-Z0-9]{4})(\d{2})/, `$1.$2.$3/$4-$5`)
        }
      case 'cep': 
        return value.replace(/(\d{5})(\d{3})/, '$1-$2')
    }
  }
}
