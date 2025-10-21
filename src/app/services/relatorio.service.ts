import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Relatorio } from '../models/relatorio';

@Injectable({
  providedIn: 'root'
})
export class RelatorioService {
  private apiUrl = window.location.hostname === 'localhost'
    ? 'http://127.0.0.1:8000/api/relatorios/'
    : 'https://rmtpark-bd.onrender.com/api/relatorios/';

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('access_token') || '';
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : ''
    });
  }

  /**
   * Se passar `filters`, eles serão convertidos para query params:
   * { placa, tipo, forma_pagamento, start, end }
   */
  getRelatorios(filters?: any): Observable<Relatorio[]> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach(k => {
        if (filters[k] != null && filters[k] !== '') {
          params = params.set(k, filters[k].toString());
        }
      });
    }
    const headers = this.getAuthHeaders();
    return this.http.get<Relatorio[]>(this.apiUrl, { headers, params });
  }

  deleteRelatorio(id: number) {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}${id}`, { headers });
  }
}
