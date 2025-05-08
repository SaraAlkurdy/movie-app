import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { ApiService } from '../core/services/api.service';
import { catchError, EMPTY } from 'rxjs';
import { Movie } from '../core/interfaces/movie.interface';

export const movieDetailResolver: ResolveFn<Movie> = (route, state) => {
  const apiService = inject(ApiService);
  const router = inject(Router);
  const id = route.paramMap.get('id');

  if (!id) {
    router.navigate(['/movies']);
    return EMPTY;
  }

  return apiService.getMovieDetails(parseInt(id)).pipe(
    catchError((error) => {
      console.error('Error fetching movie details:', error);
      router.navigate(['/movies']);
      return EMPTY;
    })
  );
};
