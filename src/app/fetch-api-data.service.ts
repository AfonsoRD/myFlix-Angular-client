import { Injectable } from '@angular/core';
import { catchError } from 'rxjs';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs';

//Declaring the api url that will provide data for the client app
const apiUrl = 'https://movie-api-drab.vercel.app';

/** to tell Angular that this service will be available everywhere (hence the root)
If the @Injectable decorator is missing
and you try to import the service to other files/components, you will receive the error */
@Injectable({
  providedIn: 'root',
})

/**
 * This @service is responsible for definin methods to make API calls to backend endpoints
 */
export class FetchApiDataService {
  /** Conctructor makes HttpClient available via this.http inside the class
   * @param http HttpClient
   */
  constructor(private http: HttpClient) {}
  // Making the api call for the user registration endpoint
  public userRegistration(userDetails: any): Observable<any> {
    console.log('user created: ', userDetails);
    return this.http
      .post(`${apiUrl}/users`, userDetails)
      .pipe(catchError(this.handleError));
  }

  private loggedInStatus = false;
  setloggedInStatus(token: any) {
    if (token) {
      this.loggedInStatus = true;
    }
    if (!token) {
      this.loggedInStatus = false;
    }

    return this.loggedInStatus;
  }

  /**
   * This function makes an API call to user login endpoind on back end
   * @function userLogin
   * @service POST to the API endpoint https://movie-api-zhikiki.herokuapp.com/login?Username={Username}&Password={Password}
   * @param userDetails Username, Password
   * @returns A JSON object holding data about the logged user with token
   */

  //user log in with the user and pass
  public userLogin(userDetails: any): Observable<any> {
    console.log('user logged in: ', userDetails);
    return this.http
      .post(`${apiUrl}/login`, userDetails)
      .pipe(catchError(this.handleError));
  }

  // get a JSON object of ALL movies
  public getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(`${apiUrl}/movies`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // get a JSON object of one movie
  public getMovie(title: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(`${apiUrl}/movies/${title}`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // get a JSON object of Director
  public getDirector(directorName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies/directors/' + directorName, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // get the description of a genre
  public getGenre(genreName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(`${apiUrl}/genre/${genreName}`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // get a JSON object of one user by username
  public getUser(): Observable<any> {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('user');
    return this.http
      .get(`${apiUrl}/users/${username}`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // get an array of a user's favorite movies by username
  public getFavoriteMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('user');
    return this.http
      .get(`${apiUrl}/users/${username}`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(
        map(this.extractResponseData),
        map((data) => data.FavoriteMovies),
        catchError(this.handleError)
      );
  }

  // Adds a Favorite movie to a user's list
  public addFavoriteMovie(movieID: string): Observable<any> {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('user');

    return this.http
      .post(
        `${apiUrl}/users/${username}/movies/${movieID}`,
        { FavoriteMovie: movieID },
        {
          headers: new HttpHeaders({
            Authorization: 'Bearer ' + token,
          }),
        }
      )
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Removes a movie from a user's list of favorite movies
  public deleteFavoriteMovie(movieId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('user');
    return this.http
      .delete(`${apiUrl}/users/${username}/movies/${movieId}`, {
        headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Updates the information of a user by username
  public updateUser(updateUserInfo: any): Observable<any> {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    return this.http
      .put(`${apiUrl}users/${username}`, updateUserInfo, {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Deletes an existing user from the database by user username
  public deleteUser(): Observable<any> {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    return this.http
      .delete(`${apiUrl}users/${username}`, {
        headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  private extractResponseData(res: any): any {
    const body = res;
    return body || {};
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status},` + `Error body is: ${error.error}`
      );
    }
    return throwError('Something bad happened; please try again later');
  }
}
