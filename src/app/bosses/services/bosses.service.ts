import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CrudService } from '../../shared/services/crud.service';
import { HttpClient } from '@angular/common/http';
import { Boss, CreateBoss, UpdateBoss } from '../interfaces/bosses.interface';

@Injectable({
  providedIn: 'root'
})
export class BossesService extends CrudService<CreateBoss, UpdateBoss, Boss, number> {

  constructor(
    http: HttpClient
  ) { 
    const apiUrl = `${environment.API_URL}bosses`;
    super(http, apiUrl);
  }

  


  

  

}
