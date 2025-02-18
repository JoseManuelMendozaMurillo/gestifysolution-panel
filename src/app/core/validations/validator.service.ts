import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {

  public static validationMessages: { [key: string]: string } = {
    required: 'Este campo es obligatorio.',
    minlength: 'El valor ingresado es demasiado corto.',
    maxlength: 'El valor ingresado es demasiado largo.',
    email: 'Correo electrónico no valido',
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

  public static getFirstFieldError(field: FormControl): string | null {
    // Get the first error key
    if(field.invalid){
      const firstErrorKey: string[] = Object.keys(field.errors!);
      return firstErrorKey[0];
    }
    return null;
  }
  


  

}
