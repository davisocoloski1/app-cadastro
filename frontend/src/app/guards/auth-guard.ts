import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  const url = state.url;

  const isPublic =
    url.startsWith('/login') ||
    url.startsWith('/registro') ||
    url.startsWith('/confirmar-conta');

  if (!token) {
    if (isPublic) return true;

    router.navigate(['/login'], {
      state: { msg: 'Faça login para utilizar nossos serviços.' }
    });
    return false;
  }

  if (token && (url.startsWith('/login') || url.startsWith('/registro'))) {
    router.navigate(['/users/me'], {
      state: { msg: 'Você já está logado em nosso site.' }
    });
    return false;
  }

  return true;
};
