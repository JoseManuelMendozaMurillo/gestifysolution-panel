import { Component} from '@angular/core';
import { MenuItemComponent } from "./components/menu-item/menu-item.component";
import { MenuListComponent } from "./components/menu-list/menu-list.component";
import { MenuListItemComponent } from "./components/menu-list-item/menu-list-item.component";

@Component({
  selector: 'layout-sidebar',
  imports: [MenuItemComponent, MenuListComponent, MenuListItemComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {

}
