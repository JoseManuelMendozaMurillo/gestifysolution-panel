import { Component, computed, effect, inject, QueryList, untracked, ViewChildren } from '@angular/core';
import { MenuItemComponent } from "./components/menu-item/menu-item.component";
import { MenuListComponent } from "./components/menu-list/menu-list.component";
import { MenuListItemComponent } from "./components/menu-list-item/menu-list-item.component";
import { trigger, state, style, transition, animate, AnimationEvent } from '@angular/animations';
import { SidebarSatateService } from '../../services/sidebar-satate.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'layout-sidebar',
  imports: [CommonModule, MenuListComponent, MenuListItemComponent, MenuItemComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  animations: [
    trigger('sidebarAnimation', [
      state('collapsed', style({
        width: '5rem',
        minWidth: '5rem'
      })),
      state('expanded', style({
        width: '20rem',
        minWidth: '20rem'
      })),
      transition('collapsed <=> expanded', animate('200ms ease-in-out'))
    ]),

    trigger('mobileSidebarAnimation', [
      state('collapsed', style({
        width: '18rem',
        minWidth: '18rem',
        transform: 'translateX(-100%)'
      })),
      state('expanded', style({
        width: '18rem',
        minWidth: '18rem',
        transform: 'translateX(0)'
      })),
      // No animation duration for mobile
      transition('collapsed <=> expanded', animate('300ms ease-in-out'))
    ])
  ]
})
export class SidebarComponent {
  
  // Services
  public sidebarStateService: SidebarSatateService = inject(SidebarSatateService);

  //Properties
  private timeoutOpensidebar: ReturnType<typeof setTimeout> | null = null;
  private timeoutCloseSidebar: ReturnType<typeof setTimeout> | null = null;

  @ViewChildren(MenuListComponent) menuLists?: QueryList<MenuListComponent>;

  constructor() {
    effect(() => {
      if (this.sidebarStateService.pendingClose()) {
        // Force close all open menus
        this.menuLists
          ?.filter((menuList) => menuList.isMenuListOpen())
          .forEach(async (menuList) => {
            menuList.isMenuListOpen.set(false);
            menuList.isTemporarilyClosed.set(true);
          });
      }
    })

    effect(() => {
      if (this.sidebarStateService.pendingOpen()) {
        this.menuLists
          ?.filter((menuList) => menuList.isMenuListPopoverOpen())
          .forEach((menuList) => menuList.isMenuListPopoverOpen.set(false))
      }
    })
  }

  public sidebarState = computed(() => {
    return this.sidebarStateService.isOpen() ? 'expanded' : 'collapsed'
  });

  public onStartSidebarAnimation($event: AnimationEvent) {
    if (!this.sidebarStateService.isLargeScreen()) return;

    this.clearTimeout();

    // Open sidebar
    if ($event.fromState === 'collapsed' && $event.toState === 'expanded') {
      this.sidebarStateService.sidebarAnimationPhase.set('opening');
      this.sidebarStateService.animationPhase.set('opening-sidebar');
      this.timeoutOpensidebar = setTimeout(() => {
        this.sidebarStateService.menuItemAnimationPhase.set('opening');
      }, 20);
    }

    // Close sidebar
    if ($event.fromState === 'expanded' && $event.toState === 'collapsed') {
      this.sidebarStateService.menuItemAnimationPhase.set('closing');
      this.sidebarStateService.animationPhase.set('closing-sidebar');
      this.timeoutCloseSidebar = setTimeout(() => {
        this.sidebarStateService.sidebarAnimationPhase.set('closing');
      }, 20);
    }

  }

  public onDoneSidebarAnimation($event: AnimationEvent) {
    if (!this.sidebarStateService.isLargeScreen()) return;

    this.clearTimeout();

    // Open sidebar
    if ($event.fromState === 'collapsed' && $event.toState === 'expanded') {
      this.sidebarStateService.sidebarAnimationPhase.set('open');
      this.sidebarStateService.animationPhase.set('open-sidebar');

      const isAnyMenuListOpen = this.isAnyMenuListOpen();
      if (!isAnyMenuListOpen) {
        this.sidebarStateService.animationPhase.set('open');
      }
    }

    // Close sidebar
    if ($event.fromState === 'expanded' && $event.toState === 'collapsed') {
      this.sidebarStateService.sidebarAnimationPhase.set('close');
      this.sidebarStateService.animationPhase.set('close');
      this.sidebarStateService.requestedState.set(null);
    }

  }

  public onStartMobileSidebarAnimation($event: AnimationEvent) {
    if (this.sidebarStateService.isLargeScreen()) return;
    
    if($event.fromState === 'collapsed' && $event.toState === 'expanded'){
      this.sidebarStateService.sidebarAnimationPhase.set('opening');
      this.sidebarStateService.animationPhase.set('opening-sidebar');
      this.sidebarStateService.menuItemAnimationPhase.set('open');
    }

    if ($event.fromState === 'expanded' && $event.toState === 'collapsed') {
      this.sidebarStateService.sidebarAnimationPhase.set('closing');
      this.sidebarStateService.animationPhase.set('closing-sidebar');
      this.sidebarStateService.menuItemAnimationPhase.set('open');
    }
  }

  public onDoneMobileSidebarAnimation($event: AnimationEvent) {
    if (this.sidebarStateService.isLargeScreen()) return;

    if ($event.fromState === 'collapsed' && $event.toState === 'expanded') {
      this.sidebarStateService.sidebarAnimationPhase.set('open');
      this.sidebarStateService.animationPhase.set('open-sidebar');

      const isAnyMenuListOpen = this.isAnyMenuListOpen();
      if (!isAnyMenuListOpen) {
        this.sidebarStateService.animationPhase.set('open');
      }
    }

    // Close sidebar
    if ($event.fromState === 'expanded' && $event.toState === 'collapsed') {
      this.sidebarStateService.sidebarAnimationPhase.set('close');
      this.sidebarStateService.animationPhase.set('close');
      this.sidebarStateService.menuItemAnimationPhase.set('close');
      this.sidebarStateService.requestedState.set(null);
    }
  }

  private isAnyMenuListOpen(): boolean {
    if (this.menuLists === undefined) return false;
    const isAnyMenuListOpen: boolean = this.menuLists?.some(menuList => {
      return untracked(() => menuList.isMenuListOpen());
    });
    return isAnyMenuListOpen;
  }

  private clearTimeout(): void {
    if (this.timeoutOpensidebar) {
      clearTimeout(this.timeoutOpensidebar);
      this.timeoutOpensidebar = null;
    }

    if (this.timeoutCloseSidebar) {
      clearTimeout(this.timeoutCloseSidebar);
      this.timeoutCloseSidebar = null;
    }
  }

  public toggleSidebar() {
    if (this.sidebarStateService.isOpen()) {
      this.sidebarStateService.requestClose();
    } else {
      this.sidebarStateService.requestOpen();
    }
  }

}
