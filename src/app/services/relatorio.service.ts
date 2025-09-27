import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Relatorio } from '../models/relatorio';

@Injectable({
  providedIn: 'root'
})
export class RelatorioService {
  private apiUrl = window.location.hostname === 'localhost'
    ? 'http://127.0.0.1:8000/api/relatorios'
    : 'https://api.rmt-park.com/api/relatorios';

  constructor(private http: HttpClient) {}

  getRelatorios(): Observable<Relatorio[]> {
    return this.http.get<Relatorio[]>(this.apiUrl);
  }
}
