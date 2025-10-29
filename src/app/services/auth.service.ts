// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface LoginResp { access_token: string; is_admin: boolean; token_type?: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient, private router: Router) { }

  login(email: string, senha: string): Observable<LoginResp> {
    const body = new HttpParams()
      .set('username', email)
      .set('password', senha);
    return this.http.post<LoginResp>(`${this.apiUrl}/auth/login`, body.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).pipe(
      tap(res => {
        localStorage.setItem('access_token', res.access_token);
        localStorage.setItem('is_admin', String(res.is_admin));
      })
    );
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('is_admin');
    this.router.navigate(['/login']);
  }

  getToken(): string | null { return localStorage.getItem('access_token'); }
  isAdmin(): boolean { return localStorage.getItem('is_admin') === 'true'; }
  isLogged(): boolean { return !!this.getToken(); }
}
