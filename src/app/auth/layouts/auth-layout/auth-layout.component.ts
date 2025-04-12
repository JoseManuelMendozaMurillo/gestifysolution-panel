import { Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'auth-layout',
  imports: [RouterOutlet],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.css'
})
export class AuthLayoutComponent implements OnInit {

  // Services
  private router: Router = inject(Router);

  // Properties
  public AUTH_URL_IMG:{ [key: string]: string } = {
    '/auth/sign-in': './assets/img/auth/sign-in.jpeg',
    '/auth/sign-up': './assets/img/auth/sign-up.jpeg',
  }; 
  public urlImg: string = './assets/img/auth/sign-in.jpeg';

  public ngOnInit(): void {
    this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe((event: NavigationEnd) => {
      this.urlImg = this.AUTH_URL_IMG[event.urlAfterRedirects] || './assets/img/auth/sign-in.jpeg';
    });
  }

}
