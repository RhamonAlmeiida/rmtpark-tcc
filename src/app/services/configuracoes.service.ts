import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Configuracoes {
  valorHora: number;
  valorDiaria: number;
  valorMensalista: number;
  arredondamento: number;
  formaPagamento: string;
}

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

  obterValorHora(): Observable<number> {
    return new Observable<number>(observer => {
      this.obterConfiguracoes().subscribe({
        next: (config) => {
          observer.next(config.valorHora);
          observer.complete();
        },
        error: () => {
          observer.next(10); // fallback
          observer.complete();
        }
      });
    });
  }
}
