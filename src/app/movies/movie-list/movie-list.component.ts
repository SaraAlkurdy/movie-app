import { Component, inject, OnInit, signal } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  Movie,
  MovieListResponse,
} from '../../core/interfaces/movie.interface';

@Component({
  selector: 'app-movie-list',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    RouterLink,
    MatProgressSpinnerModule,
  ],
  templateUrl: './movie-list.component.html',
  styleUrl: './movie-list.component.scss',
})
export class MovieListComponent implements OnInit {
  private api = inject(ApiService);
  movies = signal<Movie[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);
  currentPage = signal(1);
  totalPages = signal(0);

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies(page: number = 1): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.currentPage.set(page);

    this.api.getPopularMovies(page).subscribe({
      next: (response: MovieListResponse) => {
        if (response.results && response.results.length > 0) {
          this.movies.set(response.results);
          this.totalPages.set(response.total_pages);
        } else {
          this.error.set('No movies found.');
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Unhandled error in movie fetch:', err);
        this.error.set('An unexpected error occurred. Please try again later.');
        this.isLoading.set(false);
      },
    });
  }

  loadNextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.loadMovies(this.currentPage() + 1);
    }
  }

  loadPreviousPage(): void {
    if (this.currentPage() > 1) {
      this.loadMovies(this.currentPage() - 1);
    }
  }
}
