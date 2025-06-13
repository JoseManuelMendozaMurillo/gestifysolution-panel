import { Component, inject, signal, WritableSignal } from '@angular/core';
import { LanguageService } from '../../../services/language.service';
import { CommonModule } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-select-language',
  imports: [CommonModule],
  templateUrl: './select-language.component.html',
  styleUrl: './select-language.component.css',
  animations: [
    trigger('caretRotate', [
      state('open', style({
        transform: 'rotate(180deg)'
      })),
      state('closed', style({
        transform: 'rotate(0deg)'
      })),
      transition('open <=> closed', [
        animate('150ms ease-out')
      ])
    ]),
    trigger('dropdownAnimation', [
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
  ],
})
export class SelectLanguageComponent {
  // Services
  public languageService: LanguageService = inject(LanguageService);

  // Propesties
  public isDropdownOpen: WritableSignal<boolean> = signal(false);

  public onChangeLanguage(code: string) {
    this.languageService.setLanguage(code);
    this.toggleDropdown();
  }

  public toggleDropdown(): void {
    this.isDropdownOpen.update(prev => !prev);
  }

}
