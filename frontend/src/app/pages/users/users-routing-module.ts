import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainUserPage } from './main-user-page/main-user-page';
import { authGuard } from '../../guards/auth-guard';
import { AlterarSenha } from './alterar-senha/alterar-senha';
import { AdminRegistroPage } from './admin-registro-page/admin-registro-page';

const routes: Routes = [
  {
    path: 'me',
    component: MainUserPage,
    canActivate: [authGuard]
  },
  {
    path: 'alterar-senha',
    component: AlterarSenha,
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    component: AdminRegistroPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
