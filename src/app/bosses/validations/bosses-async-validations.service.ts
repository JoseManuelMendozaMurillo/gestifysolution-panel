import { inject, Injectable } from '@angular/core';
import { BossesService } from '../services/bosses.service';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Phone } from '../../core/types/phone.type';

@Injectable({
  providedIn: 'root'
})
export class BossesAsyncValidationsService {

  constructor() { }

  // Services
  private bossesService: BossesService = inject(BossesService);

  // Validations
  public isPhoneExist(): AsyncValidatorFn {
    return async (control: AbstractControl): Promise<ValidationErrors | null> => {
      const phone: Phone|null = control.value ?? null;
      if(phone === null || phone.country === null || phone.phone === null) return null;
      const fullPhone: string = `+${phone.country.phoneExtension} ${phone.phone}`
      const isPhoneExist: boolean = await this.bossesService.isPhoneExist(fullPhone);
      await new Promise(resolve => setTimeout(resolve, 800));
      return isPhoneExist ? { phoneTaken: true } : null;
    }
  }

}
