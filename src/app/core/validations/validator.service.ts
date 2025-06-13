import { inject, Injectable } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { ValidationError } from '../../shared/interfaces/bad-request.interface';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {

  // Services
  private translateService: TranslateService = inject(TranslateService);

  public static validationMessages: { [key: string]: string } = {
    required: 'app.validations.required',
    email: 'app.validations.email.invalid',

    // Custom validations
    unknownError: 'app.validations.unknownError',
    notValidEmail: 'app.validations.email.invalid',
    notValidUsername: 'app.validations.user.invalid',
    notValidName: 'app.validations.name.invalid',
    invalidDate: 'app.validations.date.invalid',
    invalidPassword: 'app.validations.password.invalid',
    futureDate: 'app.validations.date.future',
    usernameTaken: 'app.validations.user.taken',
    usernameNotExist: 'app.validations.user.notExist',
    emailTaken: 'app.validations.email.taken',
    phoneTaken: 'app.validations.phone.taken',
    notOnlyNumbers: 'app.validations.number.onlyNumbers',

    // Phone validations
    phoneRequired: 'app.validations.phone.required',
    phoneNumberRequired: 'app.validations.phone.numberRequired',
    phoneNumberInvalidFormat: 'app.validations.phone.numberInvalidFormat',
    phoneNumberTooShort: 'app.validations.phone.numberTooShort',
    phoneNumberTooLong: 'app.validations.phone.numberTooLong',
    phoneNumberInvalid: 'app.validations.phone.numberInvalid',


    // Country validations
    countryRequired: 'app.validations.country.required',
    countryMissingProperty: 'app.validations.country.missingProperty',
    countryExtraProperties: 'app.validations.country.extraProperties',
    countryInvalidPhoneExtension: 'app.validations.country.invalidPhoneExtension',
    countryCodeInvalid: 'app.validations.country.codeInvalid'

  };

  public static isFormFieldValid(form: FormGroup, field: string): boolean {
    return form.controls[field].invalid && form.controls[field].touched;
  }

  public static getFormFieldErrors(form: FormGroup, field: string): string[] {
    const control = form.get(field);

    if (!control || !control.errors) {
      return [];
    }

    // Get the errors as an array of error keys
    return Object.keys(control.errors).map(errorKey => {
      return errorKey;
    });
  }

  public static getFirstFormFieldError(form: FormGroup, field: string): string | null {
    const control = form.get(field);

    if (!control || !control.errors) {
      return null;
    }

    // Get the first error key
    const firstErrorKey = Object.keys(control.errors)[0];

    return firstErrorKey;
  }

  public static getFirstFieldError(field: FormControl | FormGroup): string | null {
    // Get the first error key
    if (field.invalid) {
      if (field.errors === null) {
        field.setErrors({ unknownError: true })
        return 'unknownError';
      }
      const firstErrorKey: string[] = Object.keys(field.errors);
      return firstErrorKey[0];
    }
    return null;
  }

  private getErrorMessage(keyError: string, error: any): Observable<string> {
    const unknownError: string = ValidatorService.validationMessages['unknownError'];
    let errorMessage: Observable<string> = this.translateService.stream(unknownError);

    if (typeof error === 'boolean') {
      const error: string = ValidatorService.validationMessages[keyError] ?? unknownError;
      errorMessage = this.translateService.stream(error);
    } else if (typeof error === 'string') {
      errorMessage = this.translateService.stream(error);
    } else if (typeof error === 'object') {
      switch (keyError) {
        case 'minlength':
          errorMessage = this.translateService.stream('app.validations.length.min', { length: error.requiredLength });
          break;
        case 'maxlength':
          errorMessage = this.translateService.stream('app.validations.length.max', { length: error.requiredLength });
          break;
        case 'pattern':
          errorMessage = this.translateService.stream('app.validations.pattern.invalid');
          break;
      }
    }

    return errorMessage;
  }

  public getFieldErrorMessage(field: FormControl, keyError: string): Observable<string> {
    const error: any = field.getError(keyError);
    return this.getErrorMessage(keyError, error);
  }

  public getGroupErrorMessage(group: FormGroup, keyError: string): Observable<string> {
    let error = group.getError(keyError);
    if (error !== null) {
      return this.getErrorMessage(keyError, error);
    }

    for (const controlName of Object.keys(group.controls)) {
      const control = group.get(controlName);

      if (control instanceof FormControl) {
        error = control.getError(keyError);
        if (error !== null) {
          return this.getErrorMessage(keyError, error); // Retorna inmediatamente
        }
      } else if (control instanceof FormGroup) {
        const nestedError = this.getGroupErrorMessage(control, keyError);
        if (nestedError) {
          return nestedError;
        }
      }
    }

    return this.getErrorMessage(keyError, null);
  }
  public static setValidationErrors(errors: ValidationError[], form: FormGroup): void {
    if (errors.length === 0) return;
    errors.forEach((error) => {
      // Extract the field name from the pointer
      const fieldPath: string[] = error.pointer.split('/').slice(1); // Removes the leading '#/' and splits the path
      const fieldName: string = fieldPath[fieldPath.length - 1];

      // Retrieve the form control using the field name
      const control: AbstractControl | null = form.get(fieldName);

      if (control) {
        // Set the error on the form control
        control.setErrors({ serverError: error.detail });
      }
    });
  }





}
