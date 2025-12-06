import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BusinessesService {

  constructor() { }

  // Services
  private http: HttpClient = inject(HttpClient);

  // Properties
  private apiUrl: string = `${environment.API_URL}/businesses`;
}
