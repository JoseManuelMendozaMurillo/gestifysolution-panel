import { trigger, transition, style, animate, keyframes } from '@angular/animations';
import { Component, inject, WritableSignal } from '@angular/core';
import { SidebarSatateService } from '../../services/sidebar-satate.service';

@Component({
  selector: 'layout-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  animations: [
    trigger('sidebarAnimation', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateX(-10%)'
        }),
        animate('200ms ease-in-out', style({
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
      transition('false => true', [
        animate('300ms ease-in-out', keyframes([
          style({ transform: 'rotate(0deg)', offset: 0 }),
          style({ transform: 'rotate(360deg)', offset: 1 })
        ]))
      ]),
      transition('true => false', [
        animate('300ms ease-in-out', keyframes([
          style({ transform: 'rotate(0deg)', offset: 0 }),
          style({ transform: 'rotate(-360deg)', offset: 1 })
        ]))
      ])
    ])
  ]
})
export class NavbarComponent {

  // Services
  public sidebarState: SidebarSatateService = inject(SidebarSatateService);

  get isSidebarActive(): WritableSignal<boolean> {
    return this.sidebarState.isSidebarActive;
  }

}
