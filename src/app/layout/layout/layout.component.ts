import { Component, computed, HostListener, inject } from '@angular/core';
import { SidebarComponent } from "../components/sidebar/sidebar.component";
import { NavbarComponent } from "../components/navbar/navbar.component";
import { RouterOutlet } from '@angular/router';
import { SidebarSatateService } from '../services/sidebar-satate.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Breakpoint } from '../../utils/enums/breakpoint.enum';
@Component({
  selector: 'app-layout',
  imports: [SidebarComponent, NavbarComponent, RouterOutlet],
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
    ])
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
