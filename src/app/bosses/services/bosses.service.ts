import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CrudService } from '../../shared/services/crud.service';
import { HttpClient } from '@angular/common/http';
import { Boss, CreateBoss, UpdateBoss } from '../interfaces/bosses.interface';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BossesService extends CrudService<CreateBoss, UpdateBoss, Boss, number> {

  constructor(
    http: HttpClient
  ) { 
    const apiUrl = `${environment.API_URL}/bosses`;
    super(http, apiUrl);
  }

  public async isPhoneExist(phone: string): Promise<boolean> {
      try {
        const response: any = await firstValueFrom(this.http.post(`${this.apiUrl}/check-phone`, { phone }));
        return response.exists;
      } catch (error: any) {
        console.error('An error occurred:', error.message);
        return false;
      }
  }

}
