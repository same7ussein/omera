import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ForgetPassowrdService {
  constructor(private _HttpClient: HttpClient) {}

  passwordreset(email: FormData): Observable<any> {
    return this._HttpClient.post(
      `https://levado-ecommerce-api.onrender.com/api/v1/user/password-reset/`,
      email,
    );
  }
  createPassword(form: FormData): Observable<any> {
    return this._HttpClient.post(
      `https://levado-ecommerce-api.onrender.com/api/v1/user/password-change/`,
      form
    );
  }
}
