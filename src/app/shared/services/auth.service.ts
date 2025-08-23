import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.baseURL;
  private accessToken: string | null = null;
  public userInfo: any;

  constructor(private http: HttpClient) {
    this.userInfo = 'notLogin';
  }

  decodeToken(): void {
    if (this.accessToken) {
      try {
        const decoded = jwtDecode(this.accessToken);
        this.userInfo = decoded;
      } catch (e) {
        this.userInfo = 'notLogin';
        console.error('Failed to decode access token:', e);
        this.accessToken = null;
      }
    } else {
      this.userInfo = 'notLogin';
    }
    console.log('userInfo', this.userInfo);

  }

  login(formData: FormData, lang: string): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/v1/user/login/`,
      formData,
      {
        headers: { 'Accept-Language': lang },
        withCredentials: true
      }
    ).pipe(
      tap(response => {
        if (response.access) {
          this.setAccessToken(response.access);
        }
      })
    );
  }

  refreshAccessToken(): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/v1/user/token/refresh/`,
      {},
      { withCredentials: true }
    ).pipe(
      tap(response => {
        if (response.access) {
          this.setAccessToken(response.access);
        } else {
          this.logout();
        }
      }),
      catchError(err => {
        this.logout();
        return throwError(() => err);
      })
    );
  }

    register(formData: FormData,lang:string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/v1/user/register/`,
      formData,
      {
        headers: {
          'Accept-Language': lang,
        },
      }
    );
  }

  setAccessToken(token: string): void {
    this.accessToken = token;
    this.decodeToken();
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  isAccessTokenExpired(): boolean {
    if (!this.accessToken) {
      return true;
    }
    try {
      const decoded: any = jwtDecode(this.accessToken);
      const exp = decoded.exp * 1000;
      return Date.now() > exp;
    } catch {
      return true;
    }
  }

  logout(): void {
    this.accessToken = null;
    this.userInfo = 'notLogin';
  }
}
