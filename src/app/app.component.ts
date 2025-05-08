import { Component, signal } from '@angular/core';
import { NavigationEnd, RouterModule, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { filter } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, HttpClientModule, MatIconModule, MatToolbarModule, MatButtonModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  isLoggedIn = signal(false);
  currentUrl: string = '';

  constructor(protected authService: AuthService, private router: Router) {
    this.isLoggedIn.set(this.authService.isAuthenticated());
    this.currentUrl = this.router.url;
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentUrl = event.url;
      this.isLoggedIn.set(this.authService.isAuthenticated());

    });
  }

  isLoginPage(): boolean {
    return this.router.url === '/login';
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn.set(false);
    this.router.navigate(['/login']);
  }
}
