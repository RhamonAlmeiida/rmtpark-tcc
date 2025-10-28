import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, mapTo } from 'rxjs/operators';

export interface LoginResponse {
  access_token: string;
  token_type: string;
  is_admin: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = window.location.hostname === 'localhost'
    ? 'http://127.0.0.1:8000/api'
    : 'https://rmtpark-bd.onrender.com/api';

  private loggedIn = new BehaviorSubject<boolean>(!!localStorage.getItem('access_token'));
  isLoggedIn$ = this.loggedIn.asObservable();

  private admin = {
    email: 'admin@rmtpark.com',
    senha: 'admin@123'
  };

  constructor(private http: HttpClient) {}

  // ---------------- LOGIN ----------------
  login(email: string, senha: string): Observable<boolean> {
    if (email === this.admin.email && senha === this.admin.senha) {
      this.salvarToken('admin-local-token', true, email);
      return of(true);
    }

    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, { username: email, password: senha }).pipe(
      tap(res => this.salvarToken(res.access_token, res.is_admin, email)),
      mapTo(true)
    );
  }

  // ---------------- TOKEN ----------------
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

  // ---------------- RECUPERAÇÃO DE SENHA ----------------
  recuperarSenha(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/recuperar-senha`, { email });
  }

  redefinirSenha(token: string, novaSenha: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/redefinir-senha`, { token, nova_senha: novaSenha });
  }
}
