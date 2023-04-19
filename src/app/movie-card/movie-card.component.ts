import { Component } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

//import components
import { GenreComponent } from '../genre/genre.component';
import { DirectorComponent } from '../director/director.component';
import { MovieDetailsComponent } from '../movie-details/movie-details.component';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent {
  movies: any[] = [];
  favorites: any[] = [];
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getMovies();
    this.getFavoriteMovies();
  }

  /**
   * This function makes API call to get favorite movies of specific user
   * @function getFavoriteMovies
   * @returns array with movies id, which are included to the list of favorites
   */
  getFavoriteMovies(): void {
    this.fetchApiData.getUser().subscribe((resp: any) => {
      this.favorites = resp.FavoriteMovies;
      console.log(this.favorites);
      return this.favorites;
    });
  }

  /**
   * Checks if a movie is included in a user's favorite movies
   * @param {string} id
   * @returns boolean
   * @function isFavorite
   */

  isFavorite(id: string): boolean {
    return this.favorites.includes(id);
  }

  /**
   * Adds a movie to a user's favorites via an API call
   * @param {string} id
   * @function addToFavorites
   */

  addToFavorites(id: string): void {
    console.log(id);
    this.fetchApiData.addFavoriteMovie(id).subscribe((result) => {
      console.log(result);
      this.snackBar.open('Movie added to favorites', 'OK', {
        duration: 4000,
      });
      this.ngOnInit();
    });
  }

  /**
   * Removes a movie from a user's favorites via an API call
   * @param {string} id
   * @function removeFromFavorites
   */

  deleteFromFavorites(id: string): void {
    console.log(id);
    this.fetchApiData.deleteFavoriteMovie(id).subscribe((result) => {
      console.log(result);
      this.snackBar.open('Movie removed from favorites', 'OK', {
        duration: 4000,
      });
      this.ngOnInit();
    });
  }

  /**
   * Fetch movies via API and set movies state to returned JSON file
   * @returns array holding movies objects
   * @function getMovies
   */

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }

  /**
   * Opens genre information from GenreComponent
   * @param {string} name
   * @param {string} description
   * @function openGenre
   */

  openGenre(name: string, description: string): void {
    console.log(name);
    this.dialog.open(GenreComponent, {
      data: {
        Name: name,
        Description: description,
      },
    });
  }

  /**
   * Opens director information from DirectorComponent
   * @param {string} name
   * @param {string} bio
   * @param {string} birthday
   * @function openDirector
   */

  openDirector(name: string, bio: string, birthday: string): void {
    this.dialog.open(DirectorComponent, {
      data: {
        Name: name,
        Bio: bio,
        Birthday: birthday,
      },
    });
  }

  /**
   * his function opens dialog with detailed information about specific Movie
   * @param title of specific Movie (comes from specific movie card)
   * @param movieDirector of specific Movie (comes from specific movie card)
   * @param movieGenre of specific Movie (comes from specific movie card)
   * @param movieDescription of specific Movie (comes from specific movie card)
   * @param movieImagePath of specific Movie (comes from specific movie card)
   */

  openSummary(
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
        ImageURL: movieImagePath,
      },
    });
  }
}
