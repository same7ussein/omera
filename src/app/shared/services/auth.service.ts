import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
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
      `https://levado-ecommerce-api.onrender.com/api/v1/user/register/`,
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
      `https://levado-ecommerce-api.onrender.com/api/v1/user/login/`,
      formData,
      {
        headers: {
          'Accept-Language':lang
        }
      }
    );
  }
}
