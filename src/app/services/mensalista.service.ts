import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mensalista } from '../models/mensalista';
import { MensalistaCadastro } from '../models/mensalista-cadastro';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class MensalistaService {
  private readonly API_URL = window.location.hostname === 'localhost'
    ? 'http://127.0.0.1:8000/api/mensalistas'
    : 'https://rmtpark-bd.onrender.com/api/mensalistas';

  constructor(private http: HttpClient, private loginService: LoginService) {}

private getHeaders(): HttpHeaders {
  const token = this.loginService.getToken();
  if (!token) throw new Error('Usuário não autenticado');

  return new HttpHeaders({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  });
}

  cadastrar(mensalista: MensalistaCadastro): Observable<Mensalista> {
    return this.http.post<Mensalista>(this.API_URL, mensalista, { headers: this.getHeaders() });
  }

  obterTodos(): Observable<Mensalista[]> {
    return this.http.get<Mensalista[]>(this.API_URL, { headers: this.getHeaders() });
  }

  obterPorId(id: number): Observable<Mensalista> {
    return this.http.get<Mensalista>(`${this.API_URL}/${id}`, { headers: this.getHeaders() });
  }

  apagar(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`, { headers: this.getHeaders() });
  }
}
