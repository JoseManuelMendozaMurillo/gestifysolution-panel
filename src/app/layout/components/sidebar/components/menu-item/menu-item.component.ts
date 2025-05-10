import { trigger, transition, style, animate} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, InputSignal, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { SidebarSatateService } from '../../../../services/sidebar-satate.service';

@Component({
  selector: 'menu-item',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <a
      class="flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-colors text-neutral-800 hover:bg-primary-50"     
      [routerLink]="link()"
      routerLinkActive="text-white bg-primary-700 hover:bg-primary-700"
    >
        <div class="flex items-center w-full transition-all gap-3"
             [ngClass]="{
               'justify-center': !sidebarState.isCenterIcon()
             }"    
        >
            <div class="text-base">
              <ng-content select="[menu-item-icon]"></ng-content>
            </div>
            
            @if(sidebarState.isMenuItemShown()){
                <div 
                  [@menuItemAnimation]
                  class="text-base tracking-wide select-none"
                  [ngClass]="{
                    'font-semibold': !isActive(),
                    'font-bold': isActive(),
                  }" 
                >
                  <ng-content select="[menu-item-title]"></ng-content>
                </div>
            }
        </div>

        @if(sidebarState.isMenuItemShown()){
            <i
              [@menuItemAnimation]
              class="fa-solid fa-caret-down rotate-270"
            >
            </i>
        }
    </a>
  `,
  styles: ``,
  animations: [
    trigger('menuItemAnimation', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateX(-10%)'
        }),
        animate('180ms ease-in-out', style({
          opacity: 1,
          transform: 'translateX(0)'
        }))
      ]),
      transition(':leave', [
        animate('180ms ease-in-out', style({
          opacity: 0,
          transform: 'translateX(-10%)'
        }))
      ])
    ]),
  ]
})
export class MenuItemComponent implements OnInit, OnDestroy {

  // Inputs
  public link: InputSignal<string> = input.required<string>();

  // Services
  private router: Router = inject(Router);

  public sidebarState: SidebarSatateService = inject(SidebarSatateService);

  // Properties
  public isActive: WritableSignal<boolean> = signal(false);

  private activeRouteSubscription: Subscription | null = null;

  // Lifecycle methods
  public ngOnInit(): void {
    this.activeRouteSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const isRouteActive: boolean = this.router.isActive(this.link(), {
          paths: 'exact',
          queryParams: 'ignored',
          matrixParams: 'ignored',
          fragment: 'ignored'
        });
        this.isActive.set(isRouteActive);
      });
  }

  public ngOnDestroy(): void {
    this.activeRouteSubscription?.unsubscribe();
  }

}
