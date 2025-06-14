import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { firstValueFrom, map } from 'rxjs';
import { Login } from '../interfaces/login.interface';
import { AuthResponse } from '../interfaces/auth-response.interface';
import { AuthStatus } from '../types/auth-status.type';
import { decodeJWT } from '../../utils/jwt.util';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() {
    this.checkStatus();
  }

  // Services
  private http: HttpClient = inject(HttpClient);

  // Properties
  private apiUrl: string = `${environment.API_URL}/auth`;
  private _authResponse: WritableSignal<AuthResponse | null> = signal(null);
  private _authStatus: WritableSignal<AuthStatus> = signal('checking');
  private _lastHttpError: WritableSignal<HttpErrorResponse | null> = signal(null);

  public lastHttpError: Signal<HttpErrorResponse | null> = computed(() => this._lastHttpError());
  public authResponse: Signal<AuthResponse | null> = computed(() => this._authResponse());
  public authStatus: Signal<AuthStatus> = computed(() => {
    if (this._authStatus() === 'checking') return 'checking';
    if (this.authResponse()) return 'authenticated';
    return 'notAuthenticated';
  });
  public tokenPayload: Signal<JwtPayload|null> = computed(() => {
    if (this.authResponse() === null) return null
    const token: {header: any, payload: any} | null = decodeJWT(this.authResponse()!.accessToken);
    if (token === null) return null;
    return this.toJwtPayload(token.payload);
  })

  public async login(login: Login): Promise<boolean> {
    try {
      this._lastHttpError.set(null);
      const authResponse: AuthResponse = await firstValueFrom(
        this.http.post<AuthResponse>(`${this.apiUrl}/login`, login)
          .pipe(
            map((response: any) => ({
              accessToken: response.access_token,
              refreshToken: response.refresh_token,
              tokenType: response.token_type,
              expiresIn: response.expires_in,
              refreshExpiresIn: response.refresh_expires_in,
              sessionState: response.session_state,
              scope: response.scope
            }))
          )
      );
      this.handleAuthSuccess(authResponse);
      return true;
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        this._lastHttpError.set(error);
      }
      this.handleAuthError();
      return false;
    }
  }

  public async logout(): Promise<boolean> {
    try {
      this._lastHttpError.set(null);

      const authData: string | null = localStorage.getItem('authData');

      if (authData === null) {
        this.handleAuthError();
        return true;
      }

      const authResponse: AuthResponse = JSON.parse(authData);

      const response = await firstValueFrom(
        this.http.post(`${this.apiUrl}/logout`, { refreshToken: authResponse.refreshToken })
      );

      this.handleAuthError();
      return true;
    } catch (error) {

      if (error instanceof HttpErrorResponse) {
        this._lastHttpError.set(error);
      }

      return false;
    }
  }

  public async checkStatus(): Promise<boolean> {
    const authData: string | null = localStorage.getItem('authData');

    if (authData === null) {
      this.handleAuthError();
      return false;
    }

    const authResponse: AuthResponse = JSON.parse(authData);

    // check is token is valid
    const isTokenValid: boolean = await this.validateToken(authResponse.accessToken);
    if (isTokenValid) {
      this.handleAuthSuccess(authResponse);
      return true;
    }

    // check if refresh token is valid
    const isRefreshTokenValid: boolean = await this.validateToken(authResponse.refreshToken);
    if (isRefreshTokenValid) {
      const isTokenRefreshed: boolean = await this.refreshToken(authResponse.refreshToken);
      return isTokenRefreshed;
    }

    this.handleAuthError();
    return false;
  }

  public async validateToken(token: String): Promise<boolean> {
    try {
      this._lastHttpError.set(null);
      const response: any = await firstValueFrom(this.http.post(`${this.apiUrl}/validate-token`, { token }));
      return response.isValid;
    } catch (error: any) {
      if (error instanceof HttpErrorResponse) {
        this._lastHttpError.set(error);
      }
      console.error('An error occurred:', error.message);
      return false;
    }
  }

  public async refreshToken(refreshToken: string): Promise<boolean> {
    try {
      this._lastHttpError.set(null);
      const authResponse: AuthResponse = await firstValueFrom(
        this.http.post<AuthResponse>(`${this.apiUrl}/refresh-token`, { refreshToken })
          .pipe(
            map((response: any) => ({
              accessToken: response.access_token,
              refreshToken: response.refresh_token,
              tokenType: response.token_type,
              expiresIn: response.expires_in,
              refreshExpiresIn: response.refresh_expires_in,
              sessionState: response.session_state,
              scope: response.scope
            }))
          )
      );
      this.handleAuthSuccess(authResponse);
      return true;
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        this._lastHttpError.set(error);
      }
      this.handleAuthError();
      return false;
    }
  }

  public async isUsernameExist(username: string): Promise<boolean> {
    try {
      this._lastHttpError.set(null);
      const response: any = await firstValueFrom(this.http.post(`${this.apiUrl}/check-username`, { username }));
      return response.exists;
    } catch (error: any) {
      if (error instanceof HttpErrorResponse) {
        this._lastHttpError.set(error);
      }
      console.error('An error occurred:', error.message);
      return false;
    }
  }

  public async isEmailExist(email: string): Promise<boolean> {
    try {
      this._lastHttpError.set(null);
      const response: any = await firstValueFrom(this.http.post(`${this.apiUrl}/check-email`, { email }));
      return response.exists;
    } catch (error: any) {
      if (error instanceof HttpErrorResponse) {
        this._lastHttpError.set(error);
      }
      console.error('An error occurred:', error.message);
      return false;
    }
  }

  private handleAuthError(): void {
    this._authResponse.set(null);
    this._authStatus.set('notAuthenticated');
    localStorage.removeItem('authData');
  }

  private handleAuthSuccess(authResponse: AuthResponse): void {
    this._authResponse.set(authResponse);
    this._authStatus.set('authenticated');
    localStorage.setItem('authData', JSON.stringify(this.authResponse()));
  }

  private toJwtPayload(accessTokenPayload: any): JwtPayload {
    return {
      exp: accessTokenPayload.exp,
      iat: accessTokenPayload.iat,
      jti: accessTokenPayload.jti,
      iss: accessTokenPayload.iss,
      aud: accessTokenPayload.aud,
      sub: accessTokenPayload.sub,
      typ: accessTokenPayload.typ,
      azp: accessTokenPayload.azp,
      sid: accessTokenPayload.sid,
      acr: accessTokenPayload.acr,
      allowedOrigins: accessTokenPayload['allowed-origins'] || [],
      realmAccess: {
        roles: accessTokenPayload.realm_access?.roles || []
      },
      resourceAccess: {
        account: {
          roles: accessTokenPayload.resource_access?.account?.roles || []
        }
      },
      scope: accessTokenPayload.scope,
      emailVerified: accessTokenPayload.email_verified,
      name: accessTokenPayload.name,
      preferredUsername: accessTokenPayload.preferred_username,
      givenName: accessTokenPayload.given_name,
      familyName: accessTokenPayload.family_name,
      email: accessTokenPayload.email
    };
  }

}
