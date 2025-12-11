import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainUserPage } from './main-user-page/main-user-page';
import { authGuard } from '../../guards/auth-guard';

const routes: Routes = [
  {
    path: 'me',
    component: MainUserPage,
    canActivate: [authGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
