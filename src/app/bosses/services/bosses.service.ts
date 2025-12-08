import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CrudService } from '../../shared/services/crud.service';
import { HttpClient } from '@angular/common/http';
import { Boss, CreateBoss, UpdateBoss } from '../interfaces/bosses.interfaces';
import { firstValueFrom } from 'rxjs';
import { Business } from '../../businesses/interfaces/businesses.interfaces';
import { Pagination } from '../../shared/interfaces/pagination.interface';

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

  public async getBusinessesByBossId(bossId: number, params: { size: number, page: number }): Promise<Pagination<Business> | null> {
    return await this.getBusinessesByBoss(bossId, params);
  }

  public async getBusinessesByBossUsername(bossUsername: string, params: { size: number, page: number }): Promise<Pagination<Business> | null> {
    return await this.getBusinessesByBoss(bossUsername, params);
  }

  private async getBusinessesByBoss(bossIdOrUsername: number | string, params: { size: number, page: number }): Promise<Pagination<Business> | null> {
    try {
      const endpoint: string = `${this.apiUrl}/${bossIdOrUsername}/businesses?size=${params.size}&page=${params.page}`;
      const response: Pagination<Business> = await firstValueFrom(this.http.get<Pagination<Business>>(endpoint));
      return response;
    } catch (error: any) {
      console.error('An error occurred:', error.message);
      return null;
    }
  }

} 