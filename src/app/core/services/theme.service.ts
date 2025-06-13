import { effect, Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  // Use Angular signal for reactive theme state
  public darkMode: WritableSignal<boolean> = signal(false);

  constructor() {
    // Initialize from localStorage or system preference
    const savedTheme: string | null = localStorage.getItem('theme');
    const systemPrefersDark: boolean = window.matchMedia('(prefers-color-scheme: dark)').matches;

    this.darkMode.set(savedTheme ? savedTheme === 'dark' : systemPrefersDark);

    // Watch for changes and update DOM
    effect(() => {
      const isDark = this.darkMode();
      document.documentElement.classList.toggle('dark', isDark);
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  }

  public toggleTheme() {
    this.darkMode.update(prev => !prev);
  }
}
