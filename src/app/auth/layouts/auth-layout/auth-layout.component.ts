import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { ErrorStateService } from '../../../shared/errors/error-state.service';

@Component({
  selector: 'auth-layout',
  imports: [RouterOutlet],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.css',
  animations: [
    trigger('unexpectedError', [
      state('void', style({ opacity: 0, transform: 'translateX(10px)' })),
      state('visible', style({ opacity: 1, transform: 'translateX(0)' })),
      state('hidden', style({ opacity: 0, transform: 'translateX(10px)' })),
      transition('void => visible', [animate('100ms ease-in-out')]),
      transition('visible <=> hidden', [animate('100ms ease-in-out')]),
    ]),
  ],
})
export class AuthLayoutComponent implements OnInit {

  // Services
  private router: Router = inject(Router);

  public errorStateService: ErrorStateService = inject(ErrorStateService);

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
