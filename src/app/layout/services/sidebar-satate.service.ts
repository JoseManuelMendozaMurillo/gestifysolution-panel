import { computed, effect, Injectable, signal, WritableSignal } from '@angular/core';
import { Breakpoint } from '../../utils/enums/breakpoint.enum';

@Injectable({
  providedIn: 'root'
})
export class SidebarSatateService {

  public isOpen = signal(false);
  public skipAnimation = signal(false);
  public screenSize: WritableSignal<number | null> = signal(null);
  public isLargeScreen: WritableSignal<boolean | null> = signal(null);
  public requestedState = signal<'open' | 'close' | null>(null);
  public animationPhase = signal<'open' | 'close' | 'opening-sidebar' | 'open-sidebar' | 'closing-sidebar' | 'opening-menu-list' | 'closing-menu-list' | 'close-menu-list'>('close')
  public sidebarAnimationPhase = signal<'open' | 'close' | 'opening' | 'closing'>('close');
  public menuItemAnimationPhase = signal<'open' | 'close' | 'opening' | 'closing'>('close');
  public menuListAnimationPhase = signal<'open' | 'close' | 'opening' | 'closing'>('close');
  public openMenuLists = signal<Set<string>>(new Set());
  public openPopoverMenuLists = signal<Set<string>>(new Set());

  private timeoutSkipAnimation: ReturnType<typeof setTimeout> | null = null;

  public pendingClose = computed(() =>
    this.requestedState() === 'close' && this.openMenuLists().size > 0
  );
  public pendingOpen = computed(() =>
    this.requestedState() === 'open' && this.openPopoverMenuLists().size > 0
  );

  private effectLargeScreen = effect(() => {
    this.isOpen.set(false)
    this.animationPhase.set('close');
    this.sidebarAnimationPhase.set('close');
    this.menuItemAnimationPhase.set('close');
    this.menuListAnimationPhase.set('close');

    if (!this.isLargeScreen()) {
      this.openMenuLists().clear();
      this.openPopoverMenuLists().clear();
    }
  });

  private effectScreenSize = effect(() => {
    const screenSize: number | null = this.screenSize();
    if (screenSize === null) return;

    // Synchronously set skipAnimation and process changes
    this.skipAnimation.set(true);
    this.clearTimeoutSkipAnimation();

    // Force immediate change detection
    queueMicrotask(() => {
        const isLgScreen: boolean = screenSize >= Breakpoint.LG;
        this.isLargeScreen.set(isLgScreen);
        
        // Schedule reset after Angular has processed changes
        this.timeoutSkipAnimation = setTimeout(() => {
            this.skipAnimation.set(false);
        }, 1000);
    });
  });

  public requestClose() {
    if (this.openMenuLists().size > 0) {
      this.requestedState.set('close');
    } else {
      this.isOpen.set(false);
    }
  }

  public requestOpen() {
    if (this.openPopoverMenuLists().size > 0) {
      this.requestedState.set('open');
    } else {
      this.isOpen.set(true);
    }
  }

  public checkPendingClose() {
    if (this.pendingClose() && this.openMenuLists().size === 0) {
      this.isOpen.set(false);
      this.requestedState.set(null);
    }
  }

  public checkPendingOpen() {
    if (this.requestedState() === 'open' && this.openPopoverMenuLists().size === 0) {
      this.isOpen.set(true);
      this.requestedState.set(null);
    }
  }


  private clearTimeoutSkipAnimation(): void {
    if (this.timeoutSkipAnimation) {
      clearTimeout(this.timeoutSkipAnimation);
      this.timeoutSkipAnimation = null;
    }
  }

}


