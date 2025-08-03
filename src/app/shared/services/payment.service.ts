import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private _HttpClient:HttpClient) { }

  applyCopon(coponData:any):Observable<any>
  {
    return this._HttpClient.post(`https://levado-ecommerce-api.onrender.com/api/v1/coupon/` , coponData)
  }

  paymentSuccess(orderId:string , orderData:any):Observable<any>
  {
    return this._HttpClient.post(`https://levado-ecommerce-api.onrender.com/api/v1/payment-success/${orderId}/` , orderData)
  }
}
