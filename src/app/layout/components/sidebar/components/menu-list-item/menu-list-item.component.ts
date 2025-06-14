import { CommonModule } from '@angular/common';
import { Component, inject, input, InputSignal, signal, WritableSignal } from '@angular/core';
import { Router, NavigationEnd, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'menu-list-item',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <a
        class="flex items-center gap-2 px-4 py-3 rounded-lg transition-colors text-neutral-800 hover:bg-primary-50 dark:hover:bg-neutral-700"
        [routerLink]="link()"
        routerLinkActive="text-primary-600 bg-primary-900/30 hover:bg-primary-900/30 dark:hover:bg-primary-900/30"
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
            class="text-sm tracking-wide font-medium select-none text-nowrap overflow-hidden"
            [ngClass]="{
              'dark:text-white': !isActive()
            }"
        >
          {{titleTranslated()}}
        </div>
    </a>
  `,
  styles: ``
})
export class MenuListItemComponent {

  // Inputs
  public link: InputSignal<string> = input.required();
  public title: InputSignal<string> = input.required();

  // Services
  private router: Router = inject(Router);
  private translateService: TranslateService = inject(TranslateService);

  // Properties
  public isActive: WritableSignal<boolean> = signal(false);
  public titleTranslated: WritableSignal<string> = signal('');

  private activeRouteSubscription: Subscription | null = null;

  // Lifecycle methods
  public ngOnInit(): void {
    this.translateService.stream(this.title()).subscribe((title: string) => {
      this.titleTranslated.set(title);
    });

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
