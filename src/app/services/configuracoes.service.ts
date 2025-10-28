import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Configuracoes } from '../models/configuracoes';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracoesService {
  private apiUrl = window.location.hostname === 'localhost'
    ? 'http://127.0.0.1:8000/api/vagas/configuracoes'
    : 'https://rmtpark-bd.onrender.com/api/vagas/configuracoes';

  constructor(private http: HttpClient, private loginService: LoginService) {}

  private getHeaders(): HttpHeaders {
    const token = this.loginService.getToken();
    if (!token) throw new Error('Usuário não autenticado');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  obterConfiguracoes(): Observable<Configuracoes> {
    return this.http.get<Configuracoes>(this.apiUrl, { headers: this.getHeaders() });
  }

  salvarConfiguracoes(config: Configuracoes): Observable<Configuracoes> {
    return this.http.post<Configuracoes>(this.apiUrl, config, { headers: this.getHeaders() });
  }

  obterValorHora(): Observable<number> {
    return this.obterConfiguracoes().pipe(
      map(config => config?.valorHora ?? 10)
    );
  }
}
