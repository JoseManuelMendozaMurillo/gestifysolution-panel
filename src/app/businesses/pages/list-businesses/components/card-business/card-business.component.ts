import { trigger, transition, style, animate } from '@angular/animations';
import { Component, input, InputSignal, signal } from '@angular/core';
import { Business } from '../../../../interfaces/businesses.interfaces';

@Component({
  selector: 'businesses-card-business',
  imports: [],
  templateUrl: './card-business.component.html',
  styleUrls: ['./card-business.component.css'],
  animations: [
    trigger('menuAnimation', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateY(-10%)'
        }),
        animate('150ms ease-in-out', style({
          opacity: 1,
          transform: 'translateY(0)'
        }))
      ]),
      transition(':leave', [
        animate('150ms ease-in-out', style({
          opacity: 0,
          transform: 'translateY(-10%)'
        }))
      ])
    ]),
  ]
})
export class CardBusinessComponent {

  // Inputs
  public business: InputSignal<Business> = input.required();

  // Properties
  public isMenuOpen = signal(false);

  toggleMenu() {
    this.isMenuOpen.update(value => !value);
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }

  onEdit() {
    console.log('Update clicked');
    this.closeMenu();
  }

  onDelete() {
    console.log('Delete clicked');
    this.closeMenu();
  }
}
