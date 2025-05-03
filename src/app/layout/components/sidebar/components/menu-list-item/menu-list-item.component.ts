import { CommonModule } from '@angular/common';
import { Component, inject, input, InputSignal, signal, WritableSignal } from '@angular/core';
import { Router, NavigationEnd, RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'menu-list-item',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <a
        class="flex items-center gap-2 px-4 py-3 rounded-lg transition-colors text-neutral-800 hover:bg-primary-50"
        [routerLink]="link()"
        routerLinkActive="text-primary-600 bg-primary-200 hover:bg-primary-300"
    >
        <input
            type="radio"
            [checked]="isActive()"
            class="w-3 h-3 text-primary-600 border-neutral-800 ring-primary-600"
            [ngClass]="{
              'ring-1': isActive()
            }"
        />
        <div 
            class="text-sm tracking-wide font-medium select-none"
        >
          <ng-content select="[menu-item-title]"></ng-content>
        </div>
    </a>
  `,
  styles: ``
})
export class MenuListItemComponent {

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
