import { trigger, transition, style, animate, state } from '@angular/animations';
import { AfterViewInit, Component, ContentChild, ContentChildren, DestroyRef, effect, EffectRef, ElementRef, HostListener, inject, Injector, input, InputSignal, OnDestroy, QueryList, runInInjectionContext, signal, TemplateRef, untracked, WritableSignal } from '@angular/core';
import { combineLatest, map, startWith, Subscription, switchMap } from 'rxjs';
import { MenuListItemComponent } from '../menu-list-item/menu-list-item.component';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { SidebarSatateService } from '../../../../services/sidebar-satate.service';

@Component({
  selector: 'menu-list',
  imports: [CommonModule],
  template: `
    <div class="relative">
      <a
         (click)="onClickMenuList()"
         class="flex items-center justify-between px-4 py-3 rounded-lg transition-colors text-neutral-800 hover:bg-primary-50"
         [ngClass]="{
           'text-white bg-primary-700 hover:bg-primary-700': isMenuListActive()
         }"
       >
          <div 
            class="flex items-center w-full transition-all gap-3"
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
                    'font-semibold': !isMenuListActive(),
                    'font-bold': isMenuListActive(),
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
                [@caretRotate]="isMenuListOpen() ? 'open' : 'closed'"
              >
              </i>
          }
      </a>

       @if(isMenuListOpen() && isMenuListShown()){
            <div
              class="overflow-hidden ps-8 py-2 flex flex-col gap-0.5"
              [@accordionBody]
            >
                <ng-container [ngTemplateOutlet]="itemsContainer"></ng-container>
            </div>
       }
 
      
       @if(isMenuListPopoverOpen() && !sidebarState.isSidebarActive()){
            <div
              class="w-max p-4 flex flex-col gap-0.5 absolute left-17 top-0 bg-white rounded-lg"
              [@accordionBody]
            >   
                <div class="mb-3 text-base tracking-wide select-none font-semibold text-neutral-800">
                    <ng-content select="[menu-item-popover-title]"></ng-content>
                </div>

                <ng-container [ngTemplateOutlet]="itemsContainer"></ng-container>
            </div>
        }
    </div>
  `,
  styles: ``,
  animations: [
    // Accordion body animation
    trigger('accordionBody', [
      transition(':enter', [
        style({
          height: '0',
          opacity: 0,
          paddingTop: '0',
          paddingBottom: '0',
          overflow: 'hidden',
          transform: 'scaleY(0.85)',
        }),
        animate('200ms ease-in-out', style({
          height: '*',
          opacity: 1,
          paddingTop: '*',
          paddingBottom: '*',
          transform: 'scaleY(1)'
        }))
      ]),
      transition(':leave', [
        animate('200ms ease-in-out', style({
          height: '0',
          opacity: 0,
          paddingTop: '0',
          paddingBottom: '0',
          transform: 'scaleY(0.85)'
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
    ]),

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
export class MenuListComponent implements AfterViewInit, OnDestroy {


  @ContentChildren(MenuListItemComponent) items!: QueryList<MenuListItemComponent>;
  @ContentChild('menuListItemsContainer') itemsContainer!: TemplateRef<any>;

  // Services
  private elementRef: ElementRef = inject(ElementRef);
  private destroyRef: DestroyRef = inject(DestroyRef);
  private injector: Injector = inject(Injector);
  
  public sidebarState: SidebarSatateService = inject(SidebarSatateService);
  
  // Properties
  public isMenuListOpen: WritableSignal<boolean> = signal(false);
  public isMenuListOpenAux: WritableSignal<boolean> = signal(false);
  public isMenuListShown: WritableSignal<boolean> = signal(false);
  public isMenuListPopoverOpen: WritableSignal<boolean> = signal(false);
  public isMenuListActive: WritableSignal<boolean> = signal(false);

  private timeoutId: ReturnType<typeof setTimeout> | null = null;
  
  private isSidebarActiveEffect: EffectRef = effect(() => {
    this.clearTimeout();
    if (this.sidebarState.isSidebarActive()) {
      if (this.isMenuListActive()) this.isMenuListOpen.set(true);
      this.isMenuListPopoverOpen.set(false);
      this.timeoutId = setTimeout(() => {
        this.isMenuListShown.set(true);
      }, 200)
    } else {
      this.isMenuListPopoverOpen.set(false);
      this.isMenuListShown.set(false);
      untracked(() => this.isMenuListOpenAux.set(this.isMenuListOpen())); 
      this.isMenuListOpen.set(false);
      this.timeoutId = setTimeout(() => {
        this.isMenuListOpen.set(this.isMenuListOpenAux());
      }, 417)
    }
  });

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
      console.log({ anyActive })
    });

  }

  public ngOnDestroy(): void {
    this.activeRouteSubscription?.unsubscribe();
  }

  public onClickMenuList(): void {
    if (this.sidebarState.isSidebarActive()) {
      this.isMenuListOpen.set(!this.isMenuListOpen())
    } else {
      this.isMenuListPopoverOpen.set(!this.isMenuListPopoverOpen())
    }
  }

  @HostListener('document:click', ['$event.target'])
  public onClickOutside(target: HTMLElement) {
    const clickedInside = this.elementRef.nativeElement.contains(target);
    if (!clickedInside) {
      this.isMenuListPopoverOpen.set(false);
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  public onKeyPressEscape(event: KeyboardEvent) {
    this.isMenuListPopoverOpen.set(false);
  }

  private clearTimeout(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

}
