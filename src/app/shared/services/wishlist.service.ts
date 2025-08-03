import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  wishlistNumber:BehaviorSubject<number> = new BehaviorSubject(0);
  constructor(private _HttpClient: HttpClient) {}

  addWishlist(data: FormData): Observable<any> {
    return this._HttpClient.post(
      `https://levado-ecommerce-api.onrender.com/api/v1/customer/wishlist/create/`,
      data
    );
  }

  getWishlist(currency:string ,userID: number , lang:string): Observable<any> {
    return this._HttpClient.get(
      `https://levado-ecommerce-api.onrender.com/api/v1/customer/wishlist/${currency}/${userID}/`,
      {
        headers: {
          'Accept-Language':lang
        }
      }
    );
  }
}
