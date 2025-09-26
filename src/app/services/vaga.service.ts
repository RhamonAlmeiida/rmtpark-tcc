import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VagaCadastro } from '../models/vaga-cadastro';
import { LoginService } from './login.service';
import { VagaSaida } from './vagaSaida';

@Injectable({
  providedIn: 'root'
})
export class VagaService {
  private apiUrl = window.location.hostname === 'localhost'
    ? 'http://127.0.0.1:8000/api/vagas/'
    : 'https://api.rmt-park.com/api/vagas/';

  constructor(private http: HttpClient, private loginService: LoginService) {}

  // Gera headers com token automaticamente
  private getHeaders(): HttpHeaders {
    const token = this.loginService.getToken(); // pega token do serviço
    if (!token) throw new Error('Usuário não autenticado');

    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  obterTodos(): Observable<VagaCadastro[]> {
    return this.http.get<VagaCadastro[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  cadastrar(vaga: VagaCadastro): Observable<VagaCadastro> {
    return this.http.post<VagaCadastro>(this.apiUrl, vaga, { headers: this.getHeaders() });
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}`, { headers: this.getHeaders() });
  }

  registrarSaida(id: number, dados: VagaSaida): Observable<VagaCadastro> {
    return this.http.put<VagaCadastro>(`${this.apiUrl}${id}/saida`, dados, { headers: this.getHeaders() });
  }
}
