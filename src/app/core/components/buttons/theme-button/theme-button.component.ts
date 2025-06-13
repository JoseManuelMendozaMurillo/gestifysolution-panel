import { Component, inject } from '@angular/core';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-theme-button',
  imports: [],
  template: `
    <button 
      class="text-xl p-2 w-11 h-11 rounded-full hover:bg-primary-50 transition-colors duration-200 ease-in-out cursor-pointer dark:hover:bg-neutral-700"
      (click)="themeService.toggleTheme()"
    >
      @if(themeService.darkMode()){
        <i class="fa-solid fa-moon text-white"></i>
      }@else {
        <i class="fa-regular fa-sun"></i>
      }
    </button>
  `,
  styles: ``
})
export class ThemeButtonComponent {

  // Services
  public themeService: ThemeService = inject(ThemeService);

}
