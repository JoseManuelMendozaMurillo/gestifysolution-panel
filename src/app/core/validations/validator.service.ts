import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { ValidationError } from '../../shared/interfaces/bad-request.interface';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {

  public static validationMessages: { [key: string]: string } = {
    required: 'Este campo es obligatorio.',
    email: 'Correo electrónico no valido',

    // Custom validations
    unknownError: 'Error desconocido',
    notValidUsername: 'El usuario contiene caracteres invalidos',
    usernameTaken: 'Este usuario ya esta registrado',
    notOnlyNumbers: 'Este campo solo admite numeros',

    // Phone validations
    phoneRequired: 'Estructura de objeto de teléfono no válida',
    phoneNumberRequired: 'El número de teléfono es obligatorio',
    phoneNumberInvalidFormat: 'El teléfono debe ser un número válido',
    phoneNumberTooShort: 'El número de teléfono es demasiado corto',
    phoneNumberTooLong: 'El número de teléfono es demasiado largo',
    phoneNumberInvalid: 'El número de teléfono no es válido',


    // Country validations
    countryRequired: 'Debe seleccionar un país',
    countryMissingProperty: 'Propiedad faltante en el objeto país',
    countryExtraProperties: 'Proiedades inesperadas en el objeto país',
    countryInvalidPhoneExtension: 'Formato de extensión telefónica no válido',
    countryCodeInvalid: 'El codigo de país no es valido'

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

  private static getErrorMessage(keyError: string, error: any): string {
    let errorMessage: string = "Error desconocido";

    console.log({ controlError: keyError, error });

    if (typeof error === 'boolean') {
      errorMessage = ValidatorService.validationMessages[keyError] ?? errorMessage;
    } else if (typeof error === 'string') {
      errorMessage = error.toString();
    } else if (typeof error === 'object') {
      switch (keyError) {
        case 'minlength':
          errorMessage = `Este campo requiere minimo ${error.requiredLength} caracteres.`
          break;
        case 'maxlength':
          errorMessage = `Este campo requiere maximo ${error.requiredLength} caracteres.`
          break;
        case 'pattern':
          errorMessage = `Este campo contiene caracteres invalidos o un formato invalido.`
          break;
      }
    }

    return errorMessage;
  }

  public static getFieldErrorMessage(field: FormControl, keyError: string): string {
    const error: any = field.getError(keyError);
    return ValidatorService.getErrorMessage(keyError, error);
  }

  public static getGroupErrorMessage(group: FormGroup, keyError: string): string {
    let error = group.getError(keyError);
    if (error !== null) {
      return ValidatorService.getErrorMessage(keyError, error);
    }

    for (const controlName of Object.keys(group.controls)) {
      const control = group.get(controlName);

      if (control instanceof FormControl) {
        error = control.getError(keyError);
        if (error !== null) {
          return ValidatorService.getErrorMessage(keyError, error); // Retorna inmediatamente
        }
      } else if (control instanceof FormGroup) {
        const nestedError = ValidatorService.getGroupErrorMessage(control, keyError);
        if (nestedError) {
          return nestedError;
        }
      }
    }

    return ValidatorService.getErrorMessage(keyError, null);
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
