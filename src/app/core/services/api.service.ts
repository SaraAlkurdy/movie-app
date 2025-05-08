import { Injectable, signal } from '@angular/core';
import { Movie, MovieListResponse } from '../interfaces/movie.interface';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly apiKey = environment.tmdbApiKey;
  private readonly baseUrl = environment.tmdbBaseUrl;

  constructor(private http: HttpClient) {}

  getPopularMovies(page: number): Observable<MovieListResponse> {
    return this.http.get<MovieListResponse>(
      `${this.baseUrl}/movie/popular?api_key=${this.apiKey}&language=en-US&page=${page}`
    );
  }

  getMovieDetails(id: number): Observable<Movie> {
    return this.http.get<Movie>(
      `${this.baseUrl}/movie/${id}?api_key=${this.apiKey}&language=en-US`
    );
  }
}
