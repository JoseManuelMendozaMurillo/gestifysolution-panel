import { CommonModule } from '@angular/common';
import { Component, inject, input, InputSignal, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, Subscription } from 'rxjs';



@Component({
  selector: 'menu-item',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <a
      class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-neutral-800 hover:bg-primary-50"
      [routerLink]="link()"
      routerLinkActive="text-white bg-primary-700 hover:bg-primary-700"
    >
        <div 
          class="text-base"
        >
          <ng-content select="[menu-item-icon]"></ng-content>
        </div>
      <div 
        [ngClass]="{
          'font-semibold': !isActive(),
          'font-bold': isActive(),
        }"
        class="text-base tracking-wide select-none"
      >
        <ng-content select="[menu-item-title]"></ng-content>
      </div>
    </a>
  `,
  styles: ``
})
export class MenuItemComponent implements OnInit, OnDestroy {

  // Inputs
  public link: InputSignal<string> = input.required<string>();

  // Services
  private router: Router = inject(Router);

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
