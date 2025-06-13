import { effect, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Language } from '../types/language.type';
import { TranslateService } from '@ngx-translate/core';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es-MX';
import localeEn from '@angular/common/locales/en';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  // Services
  private translateService: TranslateService = inject(TranslateService);

  // Properties
  private readonly STORAGE_KEY = 'lenguage';
  public readonly availableLanguages: Language[] = [
    { code: 'en', flagIcon: 'fi fi-us', name: this.translateService.stream('languages.english') },
    { code: 'es', flagIcon: 'fi fi-es', name: this.translateService.stream('languages.spanish') }
  ];
  public currentLanguage: WritableSignal<Language> = signal({
    code: 'es',
    flagIcon: 'fi fi-es',
    name: this.translateService.stream('languages.spanish'),
  });

  constructor() { 
    // Register locales
    registerLocaleData(localeEs, 'es-MX');
    registerLocaleData(localeEn, 'en-US');

    // Set the default language
    this.translateService.setDefaultLang(this.currentLanguage().code)

    // Initialize from localStorage or browser's current language
    const savedLanguage: string | null = localStorage.getItem(this.STORAGE_KEY);
    const browserLanguage: string | undefined = this.translateService.getBrowserLang();

    if(savedLanguage){
      this.setLanguage(savedLanguage);
    }else if(browserLanguage){
      this.setLanguage(browserLanguage);
    }

    // Watch for changes and update the localstorage 
    effect(() => {
      const language: Language = this.currentLanguage();
      this.translateService.use(language.code);
      localStorage.setItem(this.STORAGE_KEY, language.code);
      
      // Update the document's lang attribute
      document.documentElement.lang = language.code;
      
      // Update the locale for date, number and currency formatting
      const locale = language.code === 'es' ? 'es-MX' : 'en-US';
      document.documentElement.setAttribute('data-locale', locale);

      // Update Angular's locale
      const script = document.createElement('script');
      script.textContent = `
        window.__localeId__ = '${language.code === 'es' ? 'es-MX' : 'en-US'}';
        document.documentElement.setAttribute('data-locale', '${locale}');
      `;
      document.head.appendChild(script);
      document.head.removeChild(script);
    });
  }

  public setLanguage(code: string) {
    const targetLanguage: Language|undefined = this.availableLanguages.find((language: Language) => language.code === code)
    if(targetLanguage !== undefined){
      this.currentLanguage.set(targetLanguage);
    }
  }
}
