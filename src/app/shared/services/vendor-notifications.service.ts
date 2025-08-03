import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VendorNotificationsService {

  constructor(private _HttpClient:HttpClient ) { }

  getAllNotifivationsCount(vendorId:number):Observable<any>
  {
    return this._HttpClient.get(`https://levado-ecommerce-api.onrender.com/api/v1/vendor-notifications-summary/${vendorId}/`)
  }
  getUnreadNotifivations(vendorId:number):Observable<any>
  {
    return this._HttpClient.get(`https://levado-ecommerce-api.onrender.com/api/v1/vendor-notifications-unseen/${vendorId}/`)
  }
  getAllReadNotifivations(vendorId:number):Observable<any>
  {
    return this._HttpClient.get(`https://levado-ecommerce-api.onrender.com/api/v1/vendor-notifications-seen/${vendorId}/`)
  }
  markAsRead(vendorId:number , notificationId:number):Observable<any>
  {
    return this._HttpClient.get(`https://levado-ecommerce-api.onrender.com/api/v1/vendor-notifications-mark-as-seen/${vendorId}/${notificationId}/`)
  }
}
