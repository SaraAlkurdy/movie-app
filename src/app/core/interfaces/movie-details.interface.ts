export interface MovieDetails {
    id: number;
    title: string;
    poster_path: string;
    backdrop_path: string;
    overview: string;
    release_date: string;
    vote_average: number;
    vote_count: number;
    genres: Genre[];
    runtime: number;
    budget: number;
    revenue: number;
  }
  
  export interface Genre {
    id: number;
    name: string;
  }
  