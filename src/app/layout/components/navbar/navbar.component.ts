import { trigger, transition, style, animate, keyframes, state, animateChild, group, query } from '@angular/animations';
import { Component, computed, inject } from '@angular/core';
import { SidebarSatateService } from '../../services/sidebar-satate.service';
import { CommonModule } from '@angular/common';

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
  public sidebarStateService: SidebarSatateService = inject(SidebarSatateService);

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

}
