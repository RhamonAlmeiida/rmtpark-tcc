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
    : 'https://rmtpark-bd.onrender.com/api/vagas/';


  constructor(private http: HttpClient, private loginService: LoginService) {}

  // Gera headers com token automaticamente
private getHeaders(): HttpHeaders {
  const token = this.loginService.getToken();
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
  const payload = {
    placa: vaga.placa,
    tipo: vaga.tipo,
    data_hora: vaga.dataHora?.toISOString() // envia como string ISO
  };
  return this.http.post<VagaCadastro>(this.apiUrl, payload, { headers: this.getHeaders() });
}


deletar(id: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
}

registrarSaida(vagaId: number, dados: any): Observable<any> {
  return this.http.put<any>(`${this.apiUrl}${vagaId}/saida`, dados, { headers: this.getHeaders() });
}






}
