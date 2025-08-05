import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private baseUrl = environment.baseUrl;

  constructor(private _HttpClient:HttpClient) { }

  applyCopon(coponData:any):Observable<any>
  {
    return this._HttpClient.post(`${this.baseUrl}/v1/coupon/` , coponData)
  }

  paymentSuccess(orderId:string , orderData:any):Observable<any>
  {
    return this._HttpClient.post(`${this.baseUrl}/v1/payment-success/${orderId}/` , orderData)
  }
}
