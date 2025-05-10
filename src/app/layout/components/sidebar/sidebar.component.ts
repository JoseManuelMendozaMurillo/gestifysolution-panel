import { AfterViewInit, Component, computed, ContentChildren, effect, inject, model, ModelSignal, QueryList, signal, untracked, ViewChildren, WritableSignal } from '@angular/core';
import { MenuItemComponent } from "./components/menu-item/menu-item.component";
import { MenuListComponent } from "./components/menu-list/menu-list.component";
import { MenuListItemComponent } from "./components/menu-list-item/menu-list-item.component";
import { trigger, state, style, transition, animate } from '@angular/animations';
import { SidebarSatateService } from '../../services/sidebar-satate.service';

@Component({
  selector: 'layout-sidebar',
  imports: [MenuItemComponent, MenuListComponent, MenuListItemComponent],
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
  ]
})
export class SidebarComponent {
  
  // Services
  public sidebarState: SidebarSatateService = inject(SidebarSatateService);

  @ViewChildren(MenuListComponent) menuLists?: QueryList<MenuListComponent>;

  constructor() {

    effect(() => {
      const isActive = this.sidebarState.isSidebarActive();
      
      // Use untracked for any non-tracked dependencies
      const menuLists = untracked(() => this.menuLists);
      
      if (!isActive) {
        const isAnyMenuListOpen = menuLists?.some(menuList => {
          return untracked(() => menuList.isMenuListOpen());
        });
        
        if (isAnyMenuListOpen !== undefined) {
          this.sidebarState.isAnyMenuListOpen.set(isAnyMenuListOpen);
        }
      }
    });
  
  }

}
