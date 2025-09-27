import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'https://rmtpark-api.onrender.com/api';

  constructor(private http: HttpClient) {}

  // 🔑 Login
  login(email: string, senha: string): Observable<{ access_token: string; token_type: string }> {
    const body = new URLSearchParams();
    body.set('username', email);
    body.set('password', senha);

    return this.http.post<{ access_token: string; token_type: string }>(
      `${this.apiUrl}/auth/login`,
      body.toString(),
      { headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }) }
    ).pipe(
      tap(res => this.salvarToken(res.access_token))
    );
  }

  // 🆕 Cadastro de empresa
  cadastrar(dados: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/cadastrar`, dados);
  }

  // 📧 Recuperar senha
  recuperarSenha(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/recuperar-senha`, { email });
  }

  // 🔑 Redefinir senha
  redefinirSenha(token: string, novaSenha: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/redefinir-senha`, {
      token,
      nova_senha: novaSenha
    });
  }

  // 💾 Gerenciar token local
  salvarToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  logout(): void {
    localStorage.removeItem('access_token');
  }

  estaLogado(): boolean {
    return !!this.getToken();
  }
}
