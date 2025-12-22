import { Component, OnInit } from '@angular/core';
import { UsersService } from '../services/users.service';
import { Router } from '@angular/router';
import { User } from '../models/user';

@Component({
  selector: 'app-admin-users-view',
  standalone: false,
  templateUrl: './admin-users-view.html',
  styleUrl: './admin-users-view.scss',
})
export class AdminUsersView implements OnInit {
  users: User[] = []

  constructor(
    private usersService: UsersService,
    private router: Router
  ) {}

  ngOnInit(): void {
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

  getOneUser(user: User) {
    this.router.navigate(['/users/admin/editar', user.id])
  }
}
