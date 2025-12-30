import { Component, OnInit } from '@angular/core';
import { UsersService } from '../services/users.service';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-admin-users-view',
  standalone: false,
  templateUrl: './admin-users-view.html',
  styleUrl: './admin-users-view.scss',
})
export class AdminUsersView implements OnInit {
  users: User[] = []
  deleteUserConfirmation = false
  userToDelete: User | null = null
  loggedUser!: User
  errorMsg = ''
  successMsg = ''
  searchBar = new FormControl('');
  searchBarPlaceholder = 'Buscar por e-mail/nome'

  constructor(
    private usersService: UsersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.usersService.getUsers().subscribe({
      next: (res: any) => {
        this.loggedUser = res
      }, error: (err: any) => {
        console.log(err)
      }
    })

    this.usersService.index().subscribe({
      next: (res: any) => {
        this.users = res
      },
      error: (err: any) => console.log(err)
    })
  }

  trackById(index: number, user: any) {
    return user.id;
  }

  searchUser() {
    const query = this.searchBar.value

    if (!query) {
      this.searchBarPlaceholder = 'Nada para pesquisar...'
      this.usersService.index().subscribe({
        next: (res: any) => {
          this.errorMsg = ''
          this.users = res
        },
        error: (err: any) => console.log(err)
      })
      setTimeout(() => { this.searchBarPlaceholder = 'Buscar por e-mail/nome' }, 3500)
      return
    }

    this.usersService.pesquisarUsuario(query!).subscribe({
      next: (res: any) => {
        this.errorMsg = ''
        this.users = res
        if (this.users.length === 0) {
          this.errorMsg = 'Nenhum usuário encontrado.'
        }
      }, error: (err: any) => {
        console.log(err)
      }
    })
  }

  getOneUser(user: User) {
    this.router.navigate(['/users/admin/editar', user.id])
  }

  delete(user: User) {  
    this.usersService.deleteUser({ id: user.id }).subscribe({
      next: () => {
        this.errorMsg = ''
        this.users = this.users.filter(u => u.id !== user.id)
        this.userToDelete = null
        this.successMsg = 'Usuário deletado.'
      }, error: (err: any) => {
        this.successMsg = ''
        if (err.error.message) {
          this.errorMsg = err.error.message
        } else {
          this.errorMsg = err.error
        }
        console.log(err)
        this.userToDelete = null
      }
    })
  }
}
