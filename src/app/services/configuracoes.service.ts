import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Empresa } from '../models/configuracoes';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracoesService {
  private readonly API_URL = window.location.hostname === 'localhost'
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

  salvarConfiguracoes(empresa: Empresa): Observable<Empresa> {
    return this.http.post<Empresa>(this.API_URL, empresa, { headers: this.getHeaders() });
  }

  obterConfiguracoes(): Observable<Empresa> {
    return this.http.get<Empresa>(this.API_URL, { headers: this.getHeaders() });
  }

  obterValorHora(): Observable<number> {
    return this.http.get<any>(this.API_URL, { headers: this.getHeaders() }).pipe(
      map(config => config.valor_hora ?? 10) // fallback se backend não retornar
    );
  }
}
