import { inject, Injectable } from '@angular/core';
import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import RegexUtils from '../../utils/regex.util';
import { Phone } from '../types/phone.type';
import { Country } from '../types/country.type';

// @ts-ignore
import { PhoneNumberUtil } from 'google-libphonenumber';
import { CountryService } from '../services/country.service';

@Injectable({
  providedIn: 'root',
})
export class CoreValidationsService {
  constructor() { }

  private phoneUtil = PhoneNumberUtil.getInstance();

  // Services
  private countryService: CountryService = inject(CountryService);

  public onlyNumbers(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) return null;

      return RegexUtils.NUMBERS_ONLY_PATTERN.test(value)
        ? null
        : { notOnlyNumbers: true };
    };
  }

  public internationalPhoneRequired(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value: Phone = control.value;

      if (!value || typeof value !== 'object') {
        return { phoneRequired: true };
      }

      const countryValidation = this.validateCountry(
        value.country
      );
      if (countryValidation) return countryValidation;

      const phoneValidation = CoreValidationsService.validatePhoneNumber(
        value.phone
      );
      if (phoneValidation) return phoneValidation;

      return null;
    };
  }

  public internationalPhoneValidation(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value: Phone | null = control.value;

      if (!value) {
        return null;
      }

      if (typeof value !== 'object') {
        return { phoneRequired: true };
      }

      if (value.country !== null && value.phone === null) {
        return null;
      }

      if (value.country === null && value.phone === null) {
        return null;
      }

      if (value.country === null && value.phone !== null) {
        return { countryRequired: true };
      }

      if (value.country !== null && value.phone !== null) {
        const countryValidation = this.validateCountry(value.country);
        if (countryValidation) return countryValidation;

        const phoneValidation = CoreValidationsService.validatePhoneNumber(value.phone);
        if (phoneValidation) return phoneValidation;

        const internationalValidation = this.validateInternationalPhoneNumbers(value);
        if (internationalValidation) return internationalValidation
      }

      return null;
    };
  }

  // Helper to validate Country object
  public validateCountry(country: Country | null | undefined): ValidationErrors | null {
    if (!country) {
      return { countryRequired: true };
    }

    const requiredProps: (keyof Country)[] = [
      'code',
      'name',
      'flag',
      'phoneExtension',
    ];

    for (const prop of requiredProps) {
      if (!country[prop]) {
        return { countryMissingProperty: true };
      }
    }

    const allowedProps = new Set(requiredProps);
    const actualProps = Object.keys(country);
    const extraProps = actualProps.filter(prop => !allowedProps.has(prop as keyof Country));
  
    if (extraProps.length > 0) {
      return { countryExtraProperties: true};
    }

    if (typeof country.phoneExtension !== 'number') {
      return { countryInvalidPhoneExtension: true };
    }

    if(!this.countryService.isCountryCodeValid(country.code)){
      return {countryCodeInvalid: true};
    }

    return null;
  }

  // Helper to validate phone number
  private static validatePhoneNumber(phone: number | null | string): ValidationErrors | null {
    if (phone === null || phone === undefined || phone === '') {
      return { phoneNumberRequired: true };
    }

    if (typeof phone !== 'number' || isNaN(phone)) {
      return { phoneNumberInvalidFormat: true };
    }

    return null;
  }

  // Helper to validate intenational phone numbers
  private validateInternationalPhoneNumbers(value: Phone): ValidationErrors | null {

    const phoneNumber: string = String(value.phone);

    if (phoneNumber.length === 1) {
      return { phoneNumberTooShort: true };
    }

    if (phoneNumber.length >= 17) {
      return { phoneNumberTooLong: true };
    }

    const countryCode: string = value!.country!.code;
    const phone = this.phoneUtil.parse(phoneNumber, countryCode)
    const isValid: boolean = this.phoneUtil.isValidNumberForRegion(phone, countryCode);

    if (!isValid) {
      return { phoneNumberInvalid: true };
    }

    return null;
  }




}
