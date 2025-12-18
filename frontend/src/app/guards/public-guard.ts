import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const publicGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const token = localStorage.getItem('token')

  if (!token) {
    return true
  }

  router.navigate([''], {
    state: { msg: 'Você já está conectado.' }
  })
  return false
};
