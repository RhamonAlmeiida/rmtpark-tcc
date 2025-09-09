import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Relatorio } from '../models/relatorio';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RelatorioService {
  private urlAPI: string;
  constructor(private http: HttpClient) {
    // Usar a API FastAPI em desenvolvimento ou produção
    this.urlAPI = window.location.hostname === 'localhost' ? 
      "http://localhost:8000/api/relatorios" : 
      "https://api.rmt-park.com/api/relatorios"; // Substituir pelo URL de produção quando disponível
  }

  obterTodos(): Observable<Relatorio[]> {
    return this.http.get<Relatorio[]>(this.urlAPI)
  }
  obterPorId(id: number): Observable<Relatorio> {
    return this.http.get<Relatorio>(`${this.urlAPI}/${id}`);
  }
  registrar(relatorio: Relatorio): Observable<any> {
   return this.http.post(`${this.urlAPI}/relatorios`, relatorio);
  }
  excluir(id: number): Observable<any> {
  return this.http.delete(`${this.urlAPI}/relatorios/${id}`);
}


}
