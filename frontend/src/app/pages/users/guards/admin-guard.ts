import { CanActivateFn, Router } from '@angular/router';
import { UsersService } from '../services/users.service';
import { inject } from '@angular/core';
import { catchError, map, of } from 'rxjs';

export const adminGuard: CanActivateFn = () => {
  const usersService = inject(UsersService);
  const router = inject(Router);
  const expiresAt = localStorage.getItem('expiresAt')

  if (!expiresAt) {
    router.navigate(['/auth/login'], {
      state: { msg: 'Acesso não autorizado ou usuário desconectado. Faça login novamente.' }
    })
    return false
  }

  const exp = new Date(expiresAt!).getTime()
  const now = Date.now()

  if (now >= exp) {
    localStorage.removeItem('expiresAt')
    localStorage.removeItem('token')

    router.navigate(['/auth/login'], {
      state: { msg: 'Sessão expirada. Faça login novamente.'}
    })
    return false
  }

  return usersService.getUsers().pipe(
    map((res: any) => {
      if (res?.permission === 'admin') {
        return true;
      }

      router.navigateByUrl('', {
        state: {
          reason: 'not-admin',
          message: 'Acesso restrito a administradores.'
        }
      });

      return false;
    }),
    catchError(() => {
      router.navigateByUrl('', {
        state: {
          reason: 'error',
          message: 'Erro ao validar permissões.'
        }
      });

      return of(false);
    })
  );
};

