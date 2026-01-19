import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../pages/auth/services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  authService.checkTokenValidity();
  if (authService.isLoggedIn()) {
    return true;
  }

  router.navigate(['/auth/login'], {
    state: { msg: 'Faça login para utilizar nossos serviços.' },
  });
  return false;
};
