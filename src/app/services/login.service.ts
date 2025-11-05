import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, mapTo } from 'rxjs/operators';
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

  private admin = {
    email: 'admin@rmtpark.com',
    senha: 'admin@123'
  };

  constructor(private http: HttpClient) { }


  login(email: string, senha: string): Observable<LoginResponse> {
    if (email === this.admin.email && senha === this.admin.senha) {
      const fakeResponse: LoginResponse = {
        access_token: 'admin-local-token',
        token_type: 'bearer',
        is_admin: true
      };
      this.salvarToken(fakeResponse.access_token, fakeResponse.is_admin, email);
      return of(fakeResponse);
    }

    // Envia login normal para o backend
    const body = new HttpParams()
      .set('username', email)
      .set('password', senha);
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, body.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
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

  // ---------------- RECUPERAÇÃO DE SENHA ----------------
  recuperarSenha(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/recuperar-senha`, { email });
  }

}
