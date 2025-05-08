import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Movie } from '../../core/interfaces/movie.interface';

@Component({
  selector: 'app-movie-detail',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    RouterModule
  ],
  templateUrl: './movie-detail.component.html',
  styleUrl: './movie-detail.component.scss',
})
export class MovieDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  movie!: Movie;

  ngOnInit(): void {
    this.movie = this.route.snapshot.data['movie'];
  }

  getBackdropUrl(): string {
    if (this.movie?.backdrop_path) {
      return `https://image.tmdb.org/t/p/original${this.movie.backdrop_path}`;
    }
    return '';
  }

  getPosterUrl(): string {
    if (this.movie?.poster_path) {
      return `https://image.tmdb.org/t/p/w500${this.movie.poster_path}`;
    }
    return '';
  }

  formatRuntime(minutes: number | undefined): string {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }

  formatMoney(amount: number | undefined): string {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  }

  getYear(dateString: string): string {
    if (!dateString) return '';
    return new Date(dateString).getFullYear().toString();
  }

}
