
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private publicUrls = [
    '/v1/user/login/',
    '/v1/user/register/',
    '/v1/user/token/refresh/',
    '/v1/user/password-reset/',
    '/v1/user/csr/',
    '/v1/productss/',
    '/v1/category/',
    '/v1/brand/',
    '/v1/product/',
    '/v1/product/category/',
    '/v1/product/brand/',
    '/v1/product-popular/',
    '/v1/product-bestseller/',
    '/v1/product-new/',
    '/v1/paymob/callback/',
    '/v1/shop/',
    '/assets/i18n/'
  ];

  private isRefreshing = false;

  constructor(private authService: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.publicUrls.some(url => req.url.includes(url)) || req.url.includes('token/refresh')) {
      return next.handle(req);
    }

    const accessToken = this.authService.getAccessToken();

    if (accessToken) {
      const clonedReq = this.addToken(req, accessToken);
      return next.handle(clonedReq).pipe(
        catchError(error => {
          if (error instanceof HttpErrorResponse && error.status === 401 && !this.isRefreshing) {
            this.isRefreshing = true;
            return this.authService.refreshAccessToken().pipe(
              switchMap((newToken: any) => {
                this.isRefreshing = false;
                const clonedReqWithNewToken = this.addToken(req, newToken.access);
                return next.handle(clonedReqWithNewToken);
              }),
              catchError(refreshError => {
                this.isRefreshing = false;

                this.router.navigate(['/login']);
                return throwError(() => refreshError);
              })
            );
          }
          return throwError(() => error);
        })
      );
    }
    return next.handle(req);
  }

  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      },
      withCredentials: true

    });
  }
}
