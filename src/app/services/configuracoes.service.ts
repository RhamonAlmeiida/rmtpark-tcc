import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Configuracoes } from '../models/configuracoes';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracoesService {
  private apiUrl = window.location.hostname === 'localhost'
    ? 'http://127.0.0.1:8000/api/vagas/configuracoes'
    : 'https://rmtpark-bd.onrender.com/api/vagas/configuracoes';

  constructor(private http: HttpClient) {}

  obterConfiguracoes(): Observable<Configuracoes> {
    return this.http.get<Configuracoes>(this.apiUrl);
  }

  salvarConfiguracoes(config: Configuracoes): Observable<Configuracoes> {
    return this.http.post<Configuracoes>(this.apiUrl, config);
  }

  // NOVO método
  obterValorHora(): Observable<number> {
    return this.obterConfiguracoes().pipe(
      map(config => config.valorHora) // supondo que Configuracoes tem a propriedade valorHora
    );
  }
}
