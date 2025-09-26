import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Relatorio } from '../models/relatorio';


@Injectable({
  providedIn: 'root'
})
export class RelatorioService {
  private apiUrl = 'http://localhost:8000/api/relatorios'; // ajuste se precisar

  constructor(private http: HttpClient) {}

 getRelatorios() {
  return this.http.get<any[]>(`${this.apiUrl}/relatorios`);
}

}
