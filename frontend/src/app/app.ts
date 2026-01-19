import { Component, signal } from '@angular/core';
import { AuthService } from './pages/auth/services/auth.service';
import { Observable } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('cadastro-frontend');
  loggedIn$: Observable<boolean>;

  constructor(private authService: AuthService, private router: Router) {
    this.loggedIn$ = this.authService.loggedIn$;
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => {
        this.authService.checkTokenValidity();
      });
  }
}
