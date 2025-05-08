import { Route } from '@angular/router';
import { inject } from '@angular/core';
import { AuthGuard } from '../core/guards/auth.guard';
import { movieDetailResolver } from './movie-detail.resolver';

export const movieRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./movie-list/movie-list.component').then(m => m.MovieListComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./movie-detail/movie-detail.component').then(m => m.MovieDetailComponent),
    resolve: { movie: movieDetailResolver }
  }
];
