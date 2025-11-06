import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface LoginResponse {
  access_token: string;
  token_type: string;
  is_admin: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = `${environment.apiUrl}`;
  private loggedIn = new BehaviorSubject<boolean>(!!localStorage.getItem('access_token'));
  isLoggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient) { }

  login(email: string, senha: string): Observable<LoginResponse> {
    const body = new HttpParams()
      .set('username', email)
      .set('password', senha);

    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, body.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).pipe(
      tap(res => this.salvarToken(res.access_token, res.is_admin, email))
    );
  }

  salvarToken(token: string, isAdmin: boolean = false, email?: string): void {
    localStorage.setItem('access_token', token);
    localStorage.setItem('is_admin', isAdmin ? 'true' : 'false');
    if (email) localStorage.setItem('user_email', email);
    this.loggedIn.next(true);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getHeaders(): any {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  estaLogado(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return localStorage.getItem('is_admin') === 'true';
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('is_admin');
    localStorage.removeItem('user_email');
    this.loggedIn.next(false);
  }

  recuperarSenha(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/recuperar-senha`, { email });
  }
}