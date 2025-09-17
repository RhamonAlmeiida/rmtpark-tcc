import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'http://127.0.0.1:8000'; 

  constructor(private http: HttpClient) {}

  // 🔑 Login
  login(email: string, senha: string): Observable<any> {
    const body = new URLSearchParams();
    body.set('username', email);
    body.set('password', senha);

    return this.http.post(`${this.apiUrl}/auth/login`, body.toString(), {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
    });
  }

  // 🆕 Cadastro
  cadastrar(dados: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/cadastrar`, dados);
  }

  // Salvar token no localStorage
  salvarToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Obter token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Logout
  logout(): void {
    localStorage.removeItem('token');
  }

  // Verifica se está logado
  estaLogado(): boolean {
    return !!this.getToken();
  }
}
