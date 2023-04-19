import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog'; // Close dialog on success
import { FetchApiDataService } from '../fetch-api-data.service'; // API
import { MatSnackBar } from '@angular/material/snack-bar'; // Notifications
import { Router } from '@angular/router'; // Routing

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  user: any = {};
  movies: any[] = [];
  favorites: any[] = [];

  @Input() updatedUser = {
    Username: '',
    Password: '',
    Email: '',
    Birthday: '',
  };

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.getUser();
  }

  /**
   * Fetch user data via API
   * @returns object with user information
   * @function getUserInfo
   */

  getUser(): void {
    this.fetchApiData.getUser().subscribe((resp: any) => {
      this.user = resp;
      console.log(this.user);
      this.updatedUser.Username = this.user.Username;
      this.updatedUser.Email = this.user.Email;
      this.updatedUser.Birthday = this.user.Birthday;
      console.log(this.updatedUser);
      return this.user;
    });
  }

  /**
   * Update user data, such as username, password, email, or birthday
   * @function updateUserInfo
   */

  updateUserData(): void {
    this.fetchApiData.updateUser(this.updatedUser).subscribe((result) => {
      console.log(result);
      this.snackBar.open('User profile was successfuly updated', 'OK', {
        duration: 4000,
      });
      localStorage.setItem('username', result.Username);
      window.location.reload();
    });
  }

  /**
   * Delete user data for the user that is logged in
   * @function deleteAccount
   */

  deleteUser(): void {
    if (
      confirm(
        'You are going to delete your account FOREVER. All data will be lost. Are you sure?'
      )
    ) {
      this.router.navigate(['welcome']).then(() => {
        this.snackBar.open(
          'You have successfully deleted your account - we are sorry to see you go!',
          'OK',
          {
            duration: 4000,
          }
        );
      });
      this.fetchApiData.deleteUser().subscribe((result) => {
        localStorage.clear();
      });
    }
  }
}
