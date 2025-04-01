import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  private http: HttpClient = inject(HttpClient);

  private apiUrl = `${environment.API_URL}auth`;

  public async isUsernameExist(username: string): Promise<boolean> {
    try {
      const response: any = await firstValueFrom(this.http.post(`${this.apiUrl}/check-username`, { username }));
      return response.exists;
    } catch (error: any) {
      console.error('An error occurred:', error.message);
      return false;
    }
  }

}
