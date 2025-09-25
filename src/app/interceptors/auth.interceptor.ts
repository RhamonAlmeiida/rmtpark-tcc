// src/app/interceptors/auth.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router, private messageService: MessageService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('access_token');

    let authReq = req;
    if (token) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        // Token inválido ou expirado
        if (error.status === 401 || error.status === 403) {
          this.messageService.add({
            severity: 'warn',
            summary: 'Sessão expirada',
            detail: 'Por favor, faça login novamente.'
          });
          localStorage.removeItem('access_token');
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}
