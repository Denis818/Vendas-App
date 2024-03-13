import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private unauthorizedErrorCount = 0;

  constructor(private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.unauthorizedErrorCount++;

          if (this.unauthorizedErrorCount >= 2) {
            this.router.navigate(['/login']);
            this.unauthorizedErrorCount = 0;
          }
        } else {
          this.unauthorizedErrorCount = 0;
        }

        return throwError(error);
      })
    );
  }
}
