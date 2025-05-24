import { Component, computed, HostListener, inject } from '@angular/core';
import { SidebarComponent } from "../components/sidebar/sidebar.component";
import { NavbarComponent } from "../components/navbar/navbar.component";
import { RouterOutlet } from '@angular/router';
import { SidebarSatateService } from '../services/sidebar-satate.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Breakpoint } from '../../utils/enums/breakpoint.enum';
import { ErrorStateService } from '../../shared/errors/error-state.service';
import { DetailedAlertComponent } from "../../core/components/alerts/detailed-alert/detailed-alert.component";
import { AlertIconComponent } from "../../core/components/alerts/components/alert-icon/alert-icon.component";
import { AlertTitleComponent } from "../../core/components/alerts/components/alert-title/alert-title.component";
import { AlertDescriptionComponent } from "../../core/components/alerts/components/alert-description/alert-description.component";
import { AlertActionsComponent } from "../../core/components/alerts/components/alert-actions/alert-actions.component";
@Component({
  selector: 'app-layout',
  imports: [SidebarComponent, NavbarComponent, RouterOutlet, DetailedAlertComponent, AlertIconComponent, AlertTitleComponent, AlertDescriptionComponent, AlertActionsComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
  animations: [
    trigger('overlayAnimation', [
      state('visible', style({
        opacity: 0.5,
        visibility: 'visible'
      })),
      state('hidden', style({
        opacity: 0,
        visibility: 'hidden'
      })),
      transition('hidden => visible', [
        animate('200ms ease-in-out')
      ]),
      transition('visible => hidden', [
        animate('200ms ease-in-out')
      ])
    ]),
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
  ]
})
export class LayoutComponent {

  constructor() {
    const screenSize: number = window.innerWidth;
    const isLgScreen: boolean = screenSize >= Breakpoint.LG;
    this.sidebarStateService.isLargeScreen.set(isLgScreen);
  }

  // Services
  public sidebarStateService: SidebarSatateService = inject(SidebarSatateService);
  public errorStateService: ErrorStateService = inject(ErrorStateService);

  // Computed property for overlay state
  public overlayState = computed(() =>
    this.sidebarStateService.isOpen() ? 'visible' : 'hidden'
  );

  // Listen for window resize events
  @HostListener('window:resize')
  public onResize(): void {
    this.setScreenSize();
  }

  private setScreenSize(): void {
    const screenSize: number = window.innerWidth;
    this.sidebarStateService.screenSize.set(screenSize);
  }

}
