import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  constructor(public router: Router) {}
  ngOnInit(): void {}

  // Navigates to movies page
  allMovies(): void {
    this.router.navigate(['movies']);
  }

  // Navigates to user profile
  userProfile(): void {
    this.router.navigate(['profile']);
  }

  // logs out user, clears token and username from local storage
  logout(): void {
    this.router.navigate(['welcome']);
    localStorage.clear();
  }
}
