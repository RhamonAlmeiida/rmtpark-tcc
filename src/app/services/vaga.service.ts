import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VagaCadastro } from '../models/vaga-cadastro';
import { Vaga } from '../models/vaga';
import { LoginService } from './login.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VagaService {
  private apiUrl = `${environment.apiUrl}/vagas`;

  constructor(private http: HttpClient, private loginService: LoginService) {}

  private getHeaders(): HttpHeaders {
    const token = this.loginService.getToken();
    if (!token) throw new Error('Usuário não autenticado');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  /** Obter todas as vagas */
  obterTodos(): Observable<Vaga[]> {
    return this.http.get<Vaga[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  /** Cadastrar uma nova vaga */
  cadastrar(vaga: VagaCadastro): Observable<Vaga> {
    const payload = {
      placa: vaga.placa,
      tipo: vaga.tipo,
      data_hora: vaga.dataHora?.toISOString() ?? new Date().toISOString()
    };
    return this.http.post<Vaga>(this.apiUrl, payload, { headers: this.getHeaders() });
  }

  /** Registrar saída de um veículo */
  registrarSaida(vagaId: number, dados: { saida: string; duracao: string; valor: number; formaPagamento?: string }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${vagaId}/saida`, dados, { headers: this.getHeaders() });
  }

  /** Deletar vaga */
  deletar(vagaId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${vagaId}`, { headers: this.getHeaders() });
  }
}
