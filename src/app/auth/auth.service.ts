import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import users from '../../assets/users.json';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  login(username: string, password: string): Observable<boolean> {

    // Find user with matching credentials
    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      try {
        localStorage.setItem('authToken', 'dummy-token');
        localStorage.setItem('currentUser', JSON.stringify(user));
        return of(true);
      } catch (error) {
        console.error('Error storing auth data:', error);
        return of(false);
      }
    }
    return of(false);
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  }

  isAuthenticated(): boolean {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      return !!token;
    }
    return false;
  }
}
