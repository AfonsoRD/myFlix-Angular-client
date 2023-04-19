import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { GenreComponent } from '../genre/genre.component';
import { DirectorComponent } from '../director/director.component';
import { MovieDetailsComponent } from '../movie-details/movie-details.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-favorite-movies',
  templateUrl: './user-favorite-movies.component.html',
  styleUrls: ['./user-favorite-movies.component.scss'],
})
export class UserFavoriteMoviesComponent {
  movies: any[] = [];
  favorites: any[] = [];
  favoriteMovies: any[] = [];
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getMovies();
    this.getFavorites();
    this.setFavoriteMovies();
  }

  // Push each movie object into an array if its Title matches a favorite
  async setFavoriteMovies() {
    let allMovies = await this.getMovies();
    let favoriteMoviesTitle = await this.setFavoriteMovies();
    console.log(allMovies);
    console.log(favoriteMoviesTitle);
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      return this.movies;
    });
  }

  // store user favorite Title in an array
  getFavorites(): void {
    this.fetchApiData.getUser().subscribe((resp: any) => {
      this.favorites = resp.FavoriteMovies;
      return this.favorites;
    });
  }

  isFavorite(title: string): boolean {
    return this.favorites.includes(title);
  }

  addToFavorites(title: string): void {
    this.fetchApiData.addFavoriteMovie(title).subscribe((result) => {
      console.log(result);
      this.snackBar.open('Movie added to favorites', 'OK', {
        duration: 4000,
      });
      this.ngOnInit();
    });
  }

  deleteFromFavorites(title: string): void {
    console.log(title);
    this.fetchApiData.deleteFavoriteMovie(title).subscribe((result) => {
      console.log(result);
      this.snackBar.open('Movie removed from favorites', 'OK', {
        duration: 4000,
      });
      this.ngOnInit();
    });
  }

  openGenre(name: string, description: string): void {
    console.log(name);
    this.dialog.open(GenreComponent, {
      data: {
        Name: name,
        Description: description,
      },
    });
  }

  openDirector(name: string, bio: string, birthday: string): void {
    console.log(name);
    this.dialog.open(DirectorComponent, {
      data: {
        Name: name,
        Bio: bio,
        Birthdays: birthday,
      },
    });
  }

  openMovieDetails(
    title: string,
    movieDirector: string,
    movieGenre: string,
    movieDescription: string,
    movieImagePath: string
  ): void {
    this.dialog.open(MovieDetailsComponent, {
      data: {
        Title: title,
        Director: movieDirector,
        Genre: movieGenre,
        Description: movieDescription,
        Image: movieImagePath,
      },
    });
  }
}
