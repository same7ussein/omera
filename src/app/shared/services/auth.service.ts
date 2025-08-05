import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.baseURL;
  constructor(private _HttpClient: HttpClient) {}

  userInfo:any;

  decodeToken(){
    const encode = localStorage.getItem('eToken')
    if (encode !== null ) {
      const decode = jwtDecode(encode)
      this.userInfo = decode
    }
    else {
      this.userInfo = 'notLogin'
    }
  }

  register(formData: FormData,lang:string): Observable<any> {
    return this._HttpClient.post(
      `${this.baseUrl}/v1/user/register/`,
      formData,
      {
        headers: {
          'Accept-Language': lang,
        },
      }
    );
  }

  login(formData: FormData,lang:string): Observable<any> {
    return this._HttpClient.post(
      `${this.baseUrl}/v1/user/login/`,
      formData,
      {
        headers: {
          'Accept-Language':lang
        }
      }
    );
  }
}
