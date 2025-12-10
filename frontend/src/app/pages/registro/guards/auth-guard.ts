import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const token = localStorage.getItem('token')

  if (token && state.url.startsWith('/confirmar-conta')) {
    router.navigate(['/login'], {
      state: {
        message: 'O acesso à página foi negado devido à ordens de restritividade.'
      }
    })
    return false
  } else if (!token) {
    router.navigate(['/login'], {
      state: {
        message: 'Faça login para utilizar nossos serviços.'
      }
    })
    return false
  } else if (token && (state.url.startsWith('/registro') || state.url.startsWith('/login'))) {
    router.navigate([''], {
      state: {
        message: 'Você já está logado em nosso site.'
      }
    })
    return false
  }

  return true
};
