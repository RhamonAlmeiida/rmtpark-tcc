import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Funcionarios } from "../models/funcionarios";

@Injectable({
  providedIn: 'root'
})
export class FuncionariosService {
  private urlAPI: string;
  constructor(private http: HttpClient) {
    // Usar a API FastAPI em desenvolvimento ou produção
    this.urlAPI = window.location.hostname === 'localhost' ? 
      "http://localhost:8000/api/funcionarios" : 
      "https://api.rmt-park.com/api/funcionarios"; // Substituir pelo URL de produção quando disponível
  }
  cadastrar(funcionarios: Funcionarios): Observable<Funcionarios> {
    return this.http.post<Funcionarios>(this.urlAPI, Funcionarios);
  }
  obterTodos(): Observable<Funcionarios[]> {
    return this.http.get<Funcionarios[]>(this.urlAPI)
  }
  obterPorId(id: number): Observable<Funcionarios> {
    return this.http.get<Funcionarios>(`${this.urlAPI}/${id}`);
  }
  apagar(id: number): Observable<any> {
    return this.http.delete<any>(`${this.urlAPI}/${id}`);
  }
}


