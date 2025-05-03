import { trigger, transition, style, animate, state } from '@angular/animations';
import { AfterViewInit, Component, ContentChildren, DestroyRef, inject, Injector, input, InputSignal, OnDestroy, QueryList, runInInjectionContext, signal, WritableSignal } from '@angular/core';
import { combineLatest, map, startWith, Subscription, switchMap } from 'rxjs';
import { MenuListItemComponent } from '../menu-list-item/menu-list-item.component';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'menu-list',
  imports: [CommonModule],
  template: `
     <a
        (click)="this.isMenuListOpen.set(!this.isMenuListOpen())"
        class="flex items-center justify-between px-4 py-3 rounded-lg transition-colors text-neutral-800 hover:bg-primary-50"
        [ngClass]="{
          'text-white bg-primary-700 hover:bg-primary-700': isMenuListActive()
        }"
      >
        <div class="flex items-center gap-3">
          <div class="text-base">
            <ng-content select="[menu-item-icon]"></ng-content>
          </div>
          
          <div 
            class="text-base tracking-wide select-none"
            [ngClass]="{
              'font-semibold': !isMenuListActive(),
              'font-bold': isMenuListActive(),
            }" 
          >
            <ng-content select="[menu-item-title]"></ng-content>
          </div>
        </div>
        <i
          class="fa-solid fa-caret-down rotate-270"
          [@caretRotate]="isMenuListOpen() ? 'open' : 'closed'"
        >
        </i>
      </a>
      @if(this.isMenuListOpen()){
        <div
          class="overflow-hidden ps-8 py-2 flex flex-col gap-0.5"
          [@accordionBody]
        >
          <ng-content/>
        </div>
      }
  `,
  styles: ``,
  animations: [
    //Accordion body animation
    trigger('accordionBody', [
      transition(':enter', [
        style({
          height: '0',
          opacity: 0,
          paddingTop: '0',
          paddingBottom: '0',
          overflow: 'hidden',
          transform: 'scaleY(0.85)',
          //transform: 'translateY(-50%)'
        }),
        animate('200ms ease-in-out', style({
          height: '*',
          opacity: 1,
          paddingTop: '*',
          paddingBottom: '*',
          transform: 'scaleY(1)'
          //transform: 'translateY(0)'
        }))
      ]),
      transition(':leave', [
        animate('200ms ease-in-out', style({
          height: '0',
          opacity: 0,
          paddingTop: '0',
          paddingBottom: '0',
          transform: 'scaleY(0.85)'
          //transform: 'translateY(-50%)'
        }))
      ])
    ]),
    // Caret rotation animation
    trigger('caretRotate', [
      state('closed', style({
        transform: 'rotate(0deg)'
      })),
      state('open', style({
        transform: 'rotate(90deg)'
      })),
      transition('closed <=> open', [
        animate('200ms ease-in-out')
      ])
    ])
  ]
})
export class MenuListComponent implements AfterViewInit, OnDestroy{

  @ContentChildren(MenuListItemComponent) items!: QueryList<MenuListItemComponent>;
  
  // Services
  private destroyRef: DestroyRef = inject(DestroyRef);
  private injector: Injector = inject(Injector);
  
  // Properties
  public isMenuListOpen: WritableSignal<boolean> = signal(false);
  public isMenuListActive: WritableSignal<boolean> = signal(false);
  
  private activeRouteSubscription: Subscription | null = null;
  
  
  // Lifecycle hooks
  public ngAfterViewInit(): void {
    this.activeRouteSubscription = this.items.changes.pipe(
      startWith(this.items),
      switchMap((items: QueryList<MenuListItemComponent>) => {
        return combineLatest(
          items.map(item => 
            runInInjectionContext(this.injector, () => 
              toObservable(item.isActive)
            )
          )
        );
      }),
      map(activeStates => activeStates.some(state => state)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(anyActive => {
      this.isMenuListActive.set(anyActive);
    });

  }

  public ngOnDestroy(): void {
    this.activeRouteSubscription?.unsubscribe();
  }

}
