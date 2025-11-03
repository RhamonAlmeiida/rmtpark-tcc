import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LoginService } from '../services/login.service';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const messageService = inject(MessageService);
  const loginService = inject(LoginService);

  const token = localStorage.getItem('access_token');
  let authReq = req;

  if (token) {
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        messageService.add({
          severity: 'warn',
          summary: 'Sessão expirada',
          detail: 'Por favor, faça login novamente.'
        });

        loginService.logout();
        if (router.url !== '/login') {
          router.navigate(['/login']);
        }
      } else if (error.status === 403) {
        messageService.add({
          severity: 'warn',
          summary: 'Ação proibida',
          detail: error.error?.detail || 'Você não tem permissão para realizar esta ação.'
        });
      }

      return throwError(() => error);
    })
  );
};
