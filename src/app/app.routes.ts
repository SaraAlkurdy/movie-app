import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'movies',
    loadChildren: () => import('./movies/movies.routes').then(m => m.movieRoutes),
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: 'login' }
];
