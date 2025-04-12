import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import RegexUtils from '../../utils/regex.util';

@Injectable({
  providedIn: 'root'
})
export class SharedValidationsService {

  constructor() { }

  public usernamePattern(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

      const username = control.value;

      return RegexUtils.USERNAME_PATTERN.test(username) ? null : { notValidUsername: true }
    };
  }

  public emailPattern(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

      const email = control.value;

      return RegexUtils.EMAIL_PATTERN.test(email) ? null : { notValidEmail: true }
    };
  }

  public namePattern(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

      const name = control.value;

      return RegexUtils.NAME_PATTERN.test(name) ? null : { notValidName: true }
    };
  }

  public pastOrPresentDate(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

      const dateString = control.value;

      if (!dateString) return null;

      // Validate format yyyy-mm-dd
      if (!RegexUtils.DATE_PATTERN.test(dateString)) {
        return { invalidFormat: true };
      }

      // Parse date components
      const [year, month, day] = dateString.split('-').map(Number);
      const jsMonth: number = month - 1; // JavaScript months are 0-based

      // Create Date object (local time)
      const inputDate: Date = new Date(year, jsMonth, day);

      // Validate valid date construction
      if (
        inputDate.getFullYear() !== year ||
        inputDate.getMonth() !== jsMonth ||
        inputDate.getDate() !== day
      ) {
        return { invalidDate: true };
      }

      // Compare dates (time-zone safe comparison)
      const today: Date = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to midnight
      inputDate.setHours(0, 0, 0, 0);

      return inputDate > today ? { futureDate: true } : null;

    };
  }

}
