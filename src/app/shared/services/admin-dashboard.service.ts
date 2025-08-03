import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminDashboardService {
  constructor(private _HttpClient: HttpClient) {}
  getHomeData(vendorId: number): Observable<any> {
    return this._HttpClient.get(
      `https://levado-ecommerce-api.onrender.com/api/v1/vendor/stats/${vendorId}/`
    );
  }

  getAdminProduct(vendorId: number, lang: string): Observable<any> {
    return this._HttpClient.get(
      `https://levado-ecommerce-api.onrender.com/api/v1/vendor/products/${vendorId}/`,
      {
        headers: {
          'Accept-Language': lang,
        },
      }
    );
  }

  getAllOrders(vendorId: number, lang: string): Observable<any> {
    return this._HttpClient.get(
      `https://levado-ecommerce-api.onrender.com/api/v1/vendor/orders/${vendorId}/`,
      {
        headers: {
          'Accept-Language': lang,
        },
      }
    );
  }

  addProduct(productData: any): Observable<any> {
    return this._HttpClient.post(
      `https://levado-ecommerce-api.onrender.com/api/v1/vendor-product-create/`,
      productData
    );
  }

  // update product
  updateProductDetails(
    vendorId: number,
    productId: any,
    productData: any,
    vendorToken: any
  ): Observable<any> {
    return this._HttpClient.patch(
      `https://levado-ecommerce-api.onrender.com/api/v1/vendor-productDetail-update/${vendorId}/${productId}/`,
      productData,
      {
        headers: {
          'X-CSRFToken': vendorToken,
        },
      }
    );
  }
  // product gallery
  updateProductGalleryImage(
    vendorId: number,
    productId: any,
    productData: any,
    vendorToken: any
  ): Observable<any> {
    return this._HttpClient.patch(
      `https://levado-ecommerce-api.onrender.com/api/v1/vendor-productGallery-update/${vendorId}/${productId}/`,
      productData,
      {
        headers: {
          'X-CSRFToken': vendorToken,
        },
      }
    );
  }
  deleteProductGalleryImage(
    vendorId: number,
    productId: any,
    vendorToken: any,
    data: any
  ): Observable<any> {
    // because delete method take only max 2 params
    const options = {
      headers: {
        'X-CSRFToken': vendorToken,
      },
      body: data,
    };
    return this._HttpClient.delete(
      `https://levado-ecommerce-api.onrender.com/api/v1/vendor-productGallery-delete/${vendorId}/${productId}/`,
      options
    );
  }

  updateProductSpecifications(
    vendorId: number,
    productId: any,
    productData: any,
    vendorToken: any
  ): Observable<any> {
    return this._HttpClient.patch(
      `https://levado-ecommerce-api.onrender.com/api/v1/vendor-productSpecification-update/${vendorId}/${productId}/`,
      productData,
      {
        headers: {
          'X-CSRFToken': vendorToken,
        },
      }
    );
  }
  deleteProductSpecifications(
    vendorId: number,
    productId: any,
    vendorToken: any,
    data: any
  ): Observable<any> {
    // because delete method take only max 2 params
    const options = {
      headers: {
        'X-CSRFToken': vendorToken,
      },
      body: data,
    };
    return this._HttpClient.delete(
      `https://levado-ecommerce-api.onrender.com/api/v1/vendor-productSpecification-delete/${vendorId}/${productId}/`,
      options
    );
  }

  updateProductColor(
    vendorId: number,
    productId: any,
    productData: any,
    vendorToken: any
  ): Observable<any> {
    return this._HttpClient.patch(
      `https://levado-ecommerce-api.onrender.com/api/v1/vendor-productColor-update/${vendorId}/${productId}/`,
      productData,
      {
        headers: {
          'X-CSRFToken': vendorToken,
        },
      }
    );
  }
  deleteProductColor(
    vendorId: number,
    productId: any,
    vendorToken: any,
    data: any
  ): Observable<any> {
    // because delete method take only max 2 params
    const options = {
      headers: {
        'X-CSRFToken': vendorToken,
      },
      body: data,
    };
    return this._HttpClient.delete(
      `https://levado-ecommerce-api.onrender.com/api/v1/vendor-productColor-delete/${vendorId}/${productId}/`,
      options
    );
  }

  updateProductSize(
    vendorId: number,
    productId: any,
    productData: any,
    vendorToken: any
  ): Observable<any> {
    return this._HttpClient.patch(
      `https://levado-ecommerce-api.onrender.com/api/v1/vendor-productSize-update/${vendorId}/${productId}/`,
      productData,
      {
        headers: {
          'X-CSRFToken': vendorToken,
        },
      }
    );
  }
  deleteProductSize(
    vendorId: number,
    productId: any,
    vendorToken: any,
    data: any
  ): Observable<any> {
    const options = {
      headers: {
        'X-CSRFToken': vendorToken,
      },
      body: data,
    };

    return this._HttpClient.delete(
      `https://levado-ecommerce-api.onrender.com/api/v1/vendor-productSize-delete/${vendorId}/${productId}/`,
      options
    );
  }

  deleteProduct(vendorId: number, productId: any): Observable<any> {
    return this._HttpClient.delete(
      `https://levado-ecommerce-api.onrender.com/api/v1/vendor-product-delete/${vendorId}/${productId}/`
    );
  }
  getOrderDetails(id: number, Oid: string, lang: string): Observable<any> {
    return this._HttpClient.get(
      `https://levado-ecommerce-api.onrender.com/api/v1/vendor/orders/${id}/${Oid}/`,
      {
        headers: {
          'Accept-Language': lang,
        },
      }
    );
  }
  getProductDetails(vendorId: number, productId: string): Observable<any> {
    return this._HttpClient.get(
      `https://levado-ecommerce-api.onrender.com/api/v1/vendor-product-update/${vendorId}/${productId}/`
    );
  }
}
