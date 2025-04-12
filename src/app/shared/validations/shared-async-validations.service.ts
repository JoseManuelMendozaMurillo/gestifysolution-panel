import { inject, Injectable } from '@angular/core';
import { AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SharedAsyncValidationsService {

  constructor() { }

  private authService: AuthService = inject(AuthService);

  public isUsernameExist(): AsyncValidatorFn {
    return async (control: AbstractControl): Promise<ValidationErrors | null> => {
      const username: string = control.value;
      const isUsernameExist: boolean = await this.authService.isUsernameExist(username);
      await new Promise(resolve => setTimeout(resolve, 800));
      return isUsernameExist ? {usernameTaken: true} : null;
    }
  }

  public isEmailExist(): AsyncValidatorFn {
    return async (control: AbstractControl): Promise<ValidationErrors | null> => {
      const email: string = control.value;
      const isEmailExist: boolean = await this.authService.isEmailExist(email);
      await new Promise(resolve => setTimeout(resolve, 800));
      return isEmailExist ? {emailTaken: true} : null;
    }
  }

  
}
