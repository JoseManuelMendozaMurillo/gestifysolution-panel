import { trigger, transition, style, animate, keyframes, state, animateChild, group, query } from '@angular/animations';
import { Component, computed, ElementRef, HostListener, inject, signal, WritableSignal } from '@angular/core';
import { SidebarSatateService } from '../../services/sidebar-satate.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';
import { ErrorStateService } from '../../../shared/errors/error-state.service';

@Component({
  selector: 'layout-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  animations: [
    trigger('titleAnimation', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateX(-10%)'
        }),
        animate('200ms 50ms ease-in-out', style({
          opacity: 1,
          transform: 'translateX(0)'
        }))
      ]),
      transition(':leave', [
        animate('200ms ease-in-out', style({
          opacity: 0,
          transform: 'translateX(-10%)'
        }))
      ])
    ]),
    trigger('rotateIcon', [
      transition('collapsed => expanded', [
        animate('250ms ease-in-out', keyframes([
          style({ transform: 'rotate(0deg)', offset: 0 }),
          style({ transform: 'rotate(360deg)', offset: 1 })
        ]))
      ]),
      transition('expanded => collapsed', [
        animate('250ms ease-in-out', keyframes([
          style({ transform: 'rotate(0deg)', offset: 0 }),
          style({ transform: 'rotate(-360deg)', offset: 1 })
        ]))
      ])
    ]),
    trigger('sidebarAnimation', [
      state('collapsed', style({
        width: '5rem',
        minWidth: '5rem'
      })),
      state('expanded', style({
        width: '20rem',
        minWidth: '20rem'
      })),
      transition('collapsed <=> expanded', animate('200ms ease-in-out'))
    ]),

    trigger('userProfileDropdownAnimation', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateY(-10%)'
        }),
        animate('150ms ease-in-out', style({
          opacity: 1,
          transform: 'translateY(0)'
        }))
      ]),
      transition(':leave', [
        animate('150ms ease-in-out', style({
          opacity: 0,
          transform: 'translateY(-10%)'
        }))
      ])
    ]),

    // New combined animation trigger for synchronizing multiple animations
    trigger('sidebarStateChange', [
      transition('collapsed => expanded', [
        group([
          // Sidebar width animation
          query('@sidebarAnimation', animateChild(), { optional: true }),
          // Icon rotation animation
          query('@rotateIcon', animateChild(), { optional: true }),
          // Title fade in animation
          query('@titleAnimation', animateChild(), { optional: true }),

        ])
      ]),
      transition('expanded => collapsed', [
        group([
          // Sidebar width animation
          query('@sidebarAnimation', animateChild(), { optional: true }),
          // Icon rotation animation
          query('@rotateIcon', animateChild(), { optional: true }),
          // Title fade out animation
          query('@titleAnimation', animateChild(), { optional: true }),
        ])
      ])
    ])
  ]
})
export class NavbarComponent {
  
  // Services
  private elementRef: ElementRef = inject(ElementRef);
  private router: Router = inject(Router);

  public sidebarStateService: SidebarSatateService = inject(SidebarSatateService);
  public authService: AuthService = inject(AuthService);

  private errorStateService: ErrorStateService = inject(ErrorStateService);


  // Properties
  public userProfileDropdownState: WritableSignal<boolean> = signal(false);
  public sidebarState = computed(() =>
    this.sidebarStateService.isOpen() ? 'expanded' : 'collapsed'
  );

  public toggleSidebar() {
    if (this.sidebarStateService.isOpen()) {
      this.sidebarStateService.requestClose();
    } else {
      this.sidebarStateService.requestOpen();
    }
  }

  public toggleUserProfileDropdown() {
    this.userProfileDropdownState.update((value: boolean) => !value)
  }

  @HostListener('document:click', ['$event.target'])
  public onClickOutside(target: HTMLElement) {
    const clickedInside = this.elementRef.nativeElement.contains(target);
    if (!clickedInside) {
      this.userProfileDropdownState.set(false);
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  public onKeyPressEscape(event: KeyboardEvent) {
    this.userProfileDropdownState.set(false);
  }

  public async logout(): Promise<void> {
    const isLogout: boolean = await this.authService.logout();
    if (isLogout) {
      this.router.navigateByUrl('/auth/sign-in');
    } else {
      this.errorStateService.title.set('Error al cerrar sesión');
      this.errorStateService.description.set('Porfavor intentelo de nuevo mas tarde');
      this.errorStateService.showError();
      console.error('Error al cerrar sesión');
      this.userProfileDropdownState.set(false);
    }
  }

}
