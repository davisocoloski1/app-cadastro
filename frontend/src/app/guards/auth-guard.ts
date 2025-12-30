import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  const expiresAt = localStorage.getItem('expiresAt')

  if (!token || !expiresAt) {
    router.navigate(['/auth/login'], {
      state: { msg: 'Faça login para utilizar nossos serviços.' }
    })
    return false
  }

  const exp = new Date(expiresAt).getTime()
  const now = Date.now()

  if (now >= exp) {
    localStorage.removeItem('token')
    localStorage.removeItem('expiresAt')

    router.navigate(['/auth/login'], {
      state: { msg: 'Sessão expirada. Faça login novamente.' }
    })
    return false
  }

  return true
};
