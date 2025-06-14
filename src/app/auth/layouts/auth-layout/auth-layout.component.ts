import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { ErrorStateService } from '../../../shared/errors/error-state.service';
import { DetailedAlertComponent } from "../../../core/components/alerts/detailed-alert/detailed-alert.component";
import { AlertIconComponent } from "../../../core/components/alerts/components/alert-icon/alert-icon.component";
import { AlertTitleComponent } from "../../../core/components/alerts/components/alert-title/alert-title.component";
import { AlertDescriptionComponent } from "../../../core/components/alerts/components/alert-description/alert-description.component";
import { AlertActionsComponent } from "../../../core/components/alerts/components/alert-actions/alert-actions.component";
import { ThemeButtonComponent } from "../../../core/components/buttons/theme-button/theme-button.component";
import { SelectLanguageComponent } from "../../../core/components/inputs/select-language/select-language.component";
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'auth-layout',
  imports: [CommonModule, RouterOutlet, DetailedAlertComponent, AlertIconComponent, AlertTitleComponent, AlertDescriptionComponent, AlertActionsComponent, ThemeButtonComponent, SelectLanguageComponent, TranslatePipe],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.css',
  animations: [
    trigger('unexpectedError', [
      state('void', style({ opacity: 0, transform: 'translateX(100%)' })),  // Initial hidden state
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(100%)' }),
        animate('250ms ease-in-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('250ms ease-in-out', style({ opacity: 0, transform: 'translateX(100%)' }))
      ])
    ]),
  ],
})
export class AuthLayoutComponent implements OnInit {

  // Services
  private router: Router = inject(Router);

  public errorStateService: ErrorStateService = inject(ErrorStateService);

  // Properties
  public AUTH_URL_IMG:{ [key: string]: string } = {
    '/auth/sign-in': './assets/img/auth/sign-in.svg',
    '/auth/sign-up': './assets/img/auth/sign-up.svg',
  }; 
  public urlImg: string = './assets/img/auth/sign-in.svg';

  public ngOnInit(): void {
    this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe((event: NavigationEnd) => {
      this.urlImg = this.AUTH_URL_IMG[event.urlAfterRedirects] || './assets/img/auth/sign-in.svg';
    });
  }

}
