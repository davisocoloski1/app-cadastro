import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  token = localStorage.getItem('token')
  isLogged = false

  ngOnInit(): void {
    if (this.token) this.isLogged = true
    else {
      this.isLogged = false
      window.location.reload
    }
  }
}
