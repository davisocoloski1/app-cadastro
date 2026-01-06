import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StepperService {
  
  private state = new BehaviorSubject<any>({
    cliente: {},
    email: {},
    telefone: {},
    endereco: {}
  })

  state$ = this.state.asObservable()

  update(part: string, data: any) {
    this.state.next({
      ...this.state.value,
      [part]: { ...this.state.value[part], ...data }
    })
  }

  get value() {
    return this.state.value
  }
}
