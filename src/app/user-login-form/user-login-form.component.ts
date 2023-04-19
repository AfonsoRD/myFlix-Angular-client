import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss'],
})
export class UserLoginFormComponent implements OnInit {
  @Input() loginData = {
    Username: '',
    Password: '',
  };

  constructor(
    public FetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {}

  // This is the function responsible for sending the form inputs to the backend
  loginUser(): void {
    this.FetchApiData.userLogin(this.loginData).subscribe({
      // if success, localStorage setItem token and user
      // open snackBar to inform and close the login dialog
      next: (result) => {
        localStorage.setItem('username', result.user.Username);
        localStorage.setItem('token', result.token);
        this.dialogRef.close(); // this will close the modal on success
        // information message about successfull login
        this.snackBar.open('User logged in successfully!', 'OK', {
          duration: 4000,
        });
        this.router.navigate(['movies']);
      },
      error: (result) => {
        this.snackBar.open(result, 'OK', { duration: 4000 });
        console.log(result);
      },
    });
  }
}
