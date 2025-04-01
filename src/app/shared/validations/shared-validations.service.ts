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

      return RegexUtils.USERNAME_PATTERN.test(username) ? null : {notValidUsername: true}
    };
  }

}
