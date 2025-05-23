import { trigger, transition, style, animate, state, AnimationEvent } from '@angular/animations';
import { AfterViewInit, Component, ContentChild, ContentChildren, DestroyRef, effect, EffectRef, ElementRef, HostListener, inject, Injector, input, InputSignal, OnDestroy, QueryList, runInInjectionContext, signal, TemplateRef, untracked, WritableSignal } from '@angular/core';
import { combineLatest, map, startWith, Subscription, switchMap } from 'rxjs';
import { MenuListItemComponent } from '../menu-list-item/menu-list-item.component';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { SidebarSatateService } from '../../../../services/sidebar-satate.service';

type Deferred<T> = {
  promise: Promise<T>;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: any) => void;
};

@Component({
  selector: 'menu-list',
  imports: [CommonModule],
  template: `
    <div 
      class="relative cursor-pointer"
    >
      <a
         (click)="onClickMenuList()"
         (mouseenter)="isHovered.set(true)"
         (mouseleave)="isHovered.set(false)"
         class="flex items-center justify-between px-4 py-3 rounded-lg transition-colors text-neutral-800 hover:bg-primary-50"
         [ngClass]="{
           'text-white bg-primary-700 hover:bg-primary-700': isMenuListActive()
         }"
        
       >
          <div 
            class="flex items-center gap-3 w-full max-w-58"
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
                  (@menuItemAnimation.done)="onMenuItemAnimationDone($event)"
                  class="text-base tracking-wide select-none overflow-hidden"
                  [ngClass]="{
                    'font-semibold': !isMenuListActive(),
                    'font-bold': isMenuListActive(),
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
                [@caretRotate]="isMenuListOpen() ? 'open' : 'closed'"
              >
              </i>
          }
      </a>

       @if((isMenuListOpen() && sidebarState.sidebarAnimationPhase() === 'open') || 
           (isMenuListOpen() && !sidebarState.isLargeScreen())
       ){
            <div
              class="overflow-hidden ps-8 py-2 flex flex-col gap-0.5"
              [@accordionBody]
              [@.disabled]="sidebarState.skipAnimation()"
              (@accordionBody.start)="onStartAccordionBodyAnimationSidebarOpen($event)"
              (@accordionBody.done)="onDoneAccordionBodyAnimationSidebarOpen($event)"
            >
                <ng-container [ngTemplateOutlet]="itemsContainer"></ng-container>
            </div>
       }
 
      
       @if(isMenuListPopoverOpen() && sidebarState.sidebarAnimationPhase() === 'close'){
            <div
              class="w-max p-4 flex flex-col gap-0.5 absolute left-17 top-0 bg-white rounded-lg"
              [@accordionBody]
              [@.disabled]="sidebarState.skipAnimation()"
              (@accordionBody.start)="onStartAccordionBodyAnimationSidebarClose($event)"
              (@accordionBody.done)="onDoneAccordionBodyAnimationSidebarClose($event)"
            >   
                <div class="mb-3 text-base tracking-wide select-none font-semibold text-neutral-800">
                    {{title()}}
                </div>

                <ng-container [ngTemplateOutlet]="itemsContainer"></ng-container>
            </div>
        }


        @if(sidebarState.sidebarAnimationPhase() === 'close' && !isMenuListPopoverOpen()){
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
export class MenuListComponent implements AfterViewInit, OnDestroy {

  @ContentChildren(MenuListItemComponent) items!: QueryList<MenuListItemComponent>;
  @ContentChild('menuListItemsContainer') itemsContainer!: TemplateRef<any>;

  // Inputs
  public title: InputSignal<string> = input.required();

  // Services
  private elementRef: ElementRef = inject(ElementRef);
  private destroyRef: DestroyRef = inject(DestroyRef);
  private injector: Injector = inject(Injector);

  public sidebarState: SidebarSatateService = inject(SidebarSatateService);

  // Properties
  public menuId = crypto.randomUUID();
  public isMenuListOpen: WritableSignal<boolean> = signal(false);
  public isMenuListPopoverOpen: WritableSignal<boolean> = signal(false);
  public isMenuListActive: WritableSignal<boolean> = signal(false);
  public isTemporarilyClosed: WritableSignal<boolean> = signal(false);
  public isHovered = signal(false);

  private closeAnimationPromise: Deferred<void> | null = null;
  private openAnimationPromise: Deferred<void> | null = null;
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
    this.deleteMenuFromMenuListOpen();
    this.deleteMenuFromMenuPopoverListOpen();
  }

  public onClickMenuList(): void {
    if (this.sidebarState.isOpen()) {
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

  public async closeMenu() {
    this.createCloseAnimationPromise();
    try {
      await this.closeAnimationPromise?.promise;
    } finally {
      this.closeAnimationPromise = null;
    }
  }

  private async openMenu() {
    this.createOpenAnimationPromise();
    try {
      await this.openAnimationPromise?.promise;
    } finally {
      this.openAnimationPromise = null;
    }
  }

  public onMenuItemAnimationDone($event: AnimationEvent) {
    // Open menu item
    if ($event.fromState === 'void' && this.sidebarState.menuItemAnimationPhase() === 'opening') {
      this.sidebarState.menuItemAnimationPhase.set('open');
    }

    // Close menu item
    if ($event.toState === 'void' && this.sidebarState.menuItemAnimationPhase() === 'closing') {
      this.sidebarState.menuItemAnimationPhase.set('close');
    }
  }

  public onStartAccordionBodyAnimationSidebarOpen($event: AnimationEvent) {
    if (!this.sidebarState.isLargeScreen()) return;

    if (this.sidebarState.animationPhase() === 'open-sidebar') {
      this.sidebarState.animationPhase.set('opening-menu-list');
      this.sidebarState.menuListAnimationPhase.set('opening');
    }

    if (!this.sidebarState.isOpen()) {
      this.sidebarState.menuListAnimationPhase.set('closing');
      this.sidebarState.animationPhase.set('closing-menu-list');
    }

    if ($event.fromState === 'void') {
      // Start animation start
      this.addMenuFromMenuListOpen();
    }

    if ($event.toState === 'void') {
      // Close animation start
    }

  }

  public onDoneAccordionBodyAnimationSidebarOpen($event: AnimationEvent) {
    if (!this.sidebarState.isLargeScreen()) return;

    if (this.sidebarState.animationPhase() === 'opening-menu-list') {
      // Open menu list
      if ($event.fromState === 'void') {
        this.sidebarState.animationPhase.set('open');
        this.sidebarState.menuListAnimationPhase.set('open');
      }

    }

    if (!this.sidebarState.isOpen()) {
      // Open menu list
      if ($event.toState === 'void') {
        this.sidebarState.menuListAnimationPhase.set('close');
        this.sidebarState.animationPhase.set('close-menu-list');
      }
    }

    if ($event.fromState === 'void') {
      // Open animation end
      if (this.openAnimationPromise) {
        this.openAnimationPromise.resolve();
      }
    }

    if ($event.toState === 'void') {
      // Close animation end
      this.deleteMenuFromMenuListOpen();
      if (this.closeAnimationPromise) {
        this.closeAnimationPromise.resolve();
      }
    }


  }

  public onStartAccordionBodyAnimationSidebarClose($event: AnimationEvent) {
    if ($event.fromState === 'void') {
      // Open popover menu animation starts
      this.addMenuFromMenuPopoverListOpen()
    }
  }

  public onDoneAccordionBodyAnimationSidebarClose($event: AnimationEvent) {
    if ($event.toState === 'void') {
      // Close popover menu animation ends
      this.deleteMenuFromMenuPopoverListOpen();
    }
  }

  private temporarilyClosedEffect: EffectRef = effect(async () => {
    const isTemporarilyClosed: boolean = untracked(() => this.isTemporarilyClosed());
    const animationPhase = this.sidebarState.animationPhase();
    if (animationPhase === 'close' && isTemporarilyClosed) {
      this.isMenuListOpen.set(true);
      this.isTemporarilyClosed.set(false);
    }
  })

  private openMenuListEffect: EffectRef = effect(async () => {
    const animationPhase = untracked(() => this.sidebarState.animationPhase());
    const isMenuListOpen: boolean = this.isMenuListOpen();
    if (isMenuListOpen) {
      if (animationPhase === 'open') {
        await this.openMenu()
      }
    } else {
      if (animationPhase === 'open') {
        await this.closeMenu();
      }
    }
  })

  private largeScreenEffect: EffectRef = effect(() => {
    if (!this.sidebarState.isLargeScreen()) {
      this.isMenuListPopoverOpen.set(false);
    }
  })

  private createOpenAnimationPromise(): void {
    let resolveFn!: (value: void | PromiseLike<void>) => void;
    let rejectFn!: (reason?: any) => void;
    const promise = new Promise<void>((resolve, reject) => {
      resolveFn = resolve;
      rejectFn = reject;
    });

    this.openAnimationPromise = {
      promise: promise,
      resolve: resolveFn,
      reject: rejectFn
    }
  }

  private createCloseAnimationPromise(): void {
    let resolveFn!: (value: void | PromiseLike<void>) => void;
    let rejectFn!: (reason?: any) => void;
    const promise = new Promise<void>((resolve, reject) => {
      resolveFn = resolve;
      rejectFn = reject;
    });

    this.closeAnimationPromise = {
      promise: promise,
      resolve: resolveFn,
      reject: rejectFn
    }
  }

  private deleteMenuFromMenuListOpen(): void {
    this.sidebarState.openMenuLists.update(lists => {
      lists.delete(this.menuId);
      return lists;
    });
    this.sidebarState.checkPendingClose();
  }

  private addMenuFromMenuListOpen(): void {
    this.sidebarState.openMenuLists.update(lists =>
      lists.add(this.menuId)
    );
  }

  private deleteMenuFromMenuPopoverListOpen(): void {
    this.sidebarState.openPopoverMenuLists.update(lists => {
      lists.delete(this.menuId);
      return lists;
    });
    this.sidebarState.checkPendingOpen();
  }

  private addMenuFromMenuPopoverListOpen(): void {
    this.sidebarState.openPopoverMenuLists.update(lists =>
      lists.add(this.menuId)
    );
  }
}
