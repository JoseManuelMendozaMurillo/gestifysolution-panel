import { trigger, transition, style, animate, state } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, inject, input, InputSignal, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { SidebarSatateService } from '../../../../services/sidebar-satate.service';

@Component({
  selector: 'menu-item',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <div class="relative">
      <a
        class="flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-colors text-neutral-800 hover:bg-primary-50"     
        (mouseenter)="isHovered.set(true)"
        (mouseleave)="isHovered.set(false)"
        [routerLink]="link()"
        routerLinkActive="text-white bg-primary-700 hover:bg-primary-700"
      >
          <div class="flex items-center gap-3 w-full max-w-58"
               [ngClass]="{
                 'justify-center': sidebarState.sidebarAnimationPhase() === 'close'
               }"    
          >
              <div class="text-base">
                <ng-content select="[menu-item-icon]"></ng-content>
              </div>
              
              @if(sidebarState.menuItemAnimationPhase() === 'opening' || 
                  sidebarState.menuItemAnimationPhase() === 'open'
              ){
                  <div 
                    [@menuItemAnimation]
                    [@.disabled]="sidebarState.skipAnimation()"
                    class="text-base tracking-wide select-none overflow-hidden"
                    [ngClass]="{
                      'font-semibold': !isActive(),
                      'font-bold': isActive(),
                    }" 
                  >
                    {{title()}}
                  </div>
              }
          </div>
  
          @if(sidebarState.menuItemAnimationPhase() === 'opening' || 
              sidebarState.menuItemAnimationPhase() === 'open'
          ){
              <i
                [@menuItemAnimation]
                [@.disabled]="sidebarState.skipAnimation()"
                class="fa-solid fa-caret-down rotate-270"
              >
              </i>
          }
      </a>

      @if(sidebarState.sidebarAnimationPhase() === 'close'){
          <div 
            [@tooltipAnimation]="isHovered()"
            class="absolute top-12 z-10 min-w-max overflow-x-visible
                  inline-block p-1 text-[0.65rem] text-white font-medium
                  rounded-sm bg-neutral-600 dark:bg-neutral-600
                  whitespace-nowrap select-none"
            [ngClass]="{
              'left-1/2 -translate-x-1/2': title().length <= 13,
              '-left-3': title().length >= 14
            }"
          >
            {{title()}}
          </div>
      }
    </div>
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
    trigger('tooltipAnimation', [
      state('false', style({
        opacity: 0,
        transform: 'scale(0.85)'
      })),
      state('true', style({
        opacity: 1,
        transform: 'scale(1)'
      })),
      transition('false <=> true', [
        animate('100ms ease-in-out')
      ])
    ])
  ]
})
export class MenuItemComponent implements OnInit, OnDestroy {

  // Inputs
  public link: InputSignal<string> = input.required();
  public title: InputSignal<string> = input.required();

  // Services
  private router: Router = inject(Router);

  public sidebarState: SidebarSatateService = inject(SidebarSatateService);

  // Properties
  public isActive: WritableSignal<boolean> = signal(false);
  public isHovered: WritableSignal<boolean> = signal(false);

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
