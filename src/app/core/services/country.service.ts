import { inject, Injectable, LOCALE_ID } from '@angular/core';

import { Country } from '../types/country.type';

// @ts-ignore
import { PhoneNumberUtil } from 'google-libphonenumber';


@Injectable({
  providedIn: 'root'
})
export class CountryService {

  private phoneUtil = PhoneNumberUtil.getInstance();
  private locale: string = inject(LOCALE_ID); // Get current locale

  constructor() { }

  public getCountries(): Country[] {
    return this.phoneUtil.getSupportedRegions().map((code: string) => ({
      code,
      name: this.getCountryName(code),
      flag: this.getFlagEmoji(code),
      phoneExtension: this.getCountryCallingCode(code),
    }));
  }

  public isCountryCodeValid(countryCode: string): string {
    const supportedRegions = this.phoneUtil.getSupportedRegions();
    return supportedRegions.includes(countryCode.toUpperCase());
  }

  public getCountryByCode(countryCode: string): Country | null {
    countryCode = countryCode.toUpperCase();
    const supportedRegions = this.phoneUtil.getSupportedRegions();
    if (!supportedRegions.includes(countryCode)) return null;
    return {
      code: countryCode,
      name: this.getCountryName(countryCode),
      flag: this.getFlagEmoji(countryCode),
      phoneExtension: this.getCountryCallingCode(countryCode)
    }
  }

  private getCountryName(code: string): string {
    return new Intl.DisplayNames([this.locale], { type: 'region' }).of(code) || code;
  }

  private getFlagEmoji(code: string): string {
    return code.toUpperCase().replace(/./g, (char) =>
      String.fromCodePoint(127397 + char.charCodeAt(0))
    );
  }

  private getCountryCallingCode(code: string): number {
    return this.phoneUtil.getCountryCodeForRegion(code);
  }


}
