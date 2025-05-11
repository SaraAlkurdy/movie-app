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
import { debounceTime, Subject } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-movie-list',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    RouterLink,
    MatProgressSpinnerModule,
    FormsModule,
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,
  ],
  templateUrl: './movie-list.component.html',
  styleUrl: './movie-list.component.scss',
})
export class MovieListComponent implements OnInit {
  private api = inject(ApiService);
  allMovies = signal<Movie[]>([]);
  movies = signal<Movie[]>([]);
  filteredMovies = signal<Movie[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);
  currentPage = signal(1);
  totalPages = signal(1000);
  searchQuery = signal('');
  isSearchActive = signal(false);
  private searchSubject = new Subject<string>();

  itemsPerPage = 21;
  currentFilteredPage = signal(1);
  totalFilteredPages = signal(1);

  ngOnInit(): void {
    this.loadMovies();

    this.searchSubject.pipe(debounceTime(300)).subscribe((query) => {
      this.searchQuery.set(query);
      this.isSearchActive.set(!!query.trim());
      this.currentFilteredPage.set(1);
      this.filterMovies();
    });
  }

  loadMovies(page: number = 1): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.currentPage.set(page);

    this.api.getPopularMovies(page).subscribe({
      next: (response: MovieListResponse) => {
        if (response.results && response.results.length > 0) {
          this.movies.set(response.results);

          if (page === 1) {
            this.allMovies.set(response.results);
          } else {
            this.allMovies.set([...this.allMovies(), ...response.results]);
          }
          this.totalPages.set(Math.min(response.total_pages, 1000));

          if (this.isSearchActive()) {
            this.filterMovies();
          } else {
            this.filteredMovies.set(this.movies());
          }
        } else {
          this.error.set('No movies found.');
          this.filteredMovies.set([]);
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
    if (this.isSearchActive()) {
      // Handle filtered pagination
      if (this.currentFilteredPage() < this.totalFilteredPages()) {
        this.currentFilteredPage.set(this.currentFilteredPage() + 1);
        this.updateFilteredMoviesPage();
      }
    } else {
      // Handle API pagination
      if (this.currentPage() < this.totalPages()) {
        this.loadMovies(this.currentPage() + 1);
      }
    }
  }

  loadPreviousPage(): void {
    if (this.isSearchActive()) {
      // Handle filtered pagination
      if (this.currentFilteredPage() > 1) {
        this.currentFilteredPage.set(this.currentFilteredPage() - 1);
        this.updateFilteredMoviesPage();
      }
    } else {
      // Handle API pagination
      if (this.currentPage() > 1) {
        this.loadMovies(this.currentPage() - 1);
      }
    }
  }

  onSearchChange(query: string): void {
    this.searchSubject.next(query);
  }

  filterMovies(): void {
    const query = this.searchQuery().toLowerCase().trim();

    if (!query) {
      this.isSearchActive.set(false);
      this.filteredMovies.set(this.movies());
      return;
    }

    const allFiltered = this.allMovies().filter(
      (movie) =>
        movie.title.toLowerCase().includes(query) ||
        (movie.overview && movie.overview.toLowerCase().includes(query))
    );

    this.totalFilteredPages.set(
      Math.max(1, Math.ceil(allFiltered.length / this.itemsPerPage))
    );

    this.updateFilteredMoviesPage(allFiltered);
  }

  updateFilteredMoviesPage(allFiltered?: Movie[]): void {
    const filtered =
      allFiltered ||
      this.allMovies().filter(
        (movie) =>
          movie.title
            .toLowerCase()
            .includes(this.searchQuery().toLowerCase().trim()) ||
          (movie.overview &&
            movie.overview
              .toLowerCase()
              .includes(this.searchQuery().toLowerCase().trim()))
      );

    const startIndex = (this.currentFilteredPage() - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    this.filteredMovies.set(filtered.slice(startIndex, endIndex));
  }

  clearSearch(): void {
    this.searchQuery.set('');
    this.isSearchActive.set(false);
    this.filteredMovies.set(this.movies());
  }

  getCurrentPageNumber(): number {
    return this.isSearchActive()
      ? this.currentFilteredPage()
      : this.currentPage();
  }

  getTotalPages(): number {
    return this.isSearchActive()
      ? this.totalFilteredPages()
      : this.totalPages();
  }

  isNextDisabled(): boolean {
    return this.isSearchActive()
      ? this.currentFilteredPage() >= this.totalFilteredPages()
      : this.currentPage() >= this.totalPages();
  }

  isPrevDisabled(): boolean {
    return this.isSearchActive()
      ? this.currentFilteredPage() <= 1
      : this.currentPage() <= 1;
  }
}
