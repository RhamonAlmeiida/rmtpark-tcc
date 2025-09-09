import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Vaga } from "../models/vaga";
import { VagaCadastro } from "../models/vaga-cadastro";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class VagaService {
    private urlAPI: string;
  constructor(private http: HttpClient) {
    // Usar a API FastAPI em desenvolvimento ou produção
    this.urlAPI = window.location.hostname === 'localhost' ? 
      "http://localhost:8000/api/vagas" : 
      "https://api.rmt-park.com/api/vagas"; // Substituir pelo URL de produção quando disponível
  }

  cadastrar(vagaCadastro: VagaCadastro): Observable<Vaga>{
    return this.http.post<Vaga>(this.urlAPI, vagaCadastro);
  }
  obterTodos() : Observable<Vaga[]>{
    return this.http.get<Vaga[]>(this.urlAPI)
  }
  obterPorId(id: number): Observable<Vaga>{
    return this.http.get<Vaga>(`${this.urlAPI}/${id}`);
  }
  saida(id: number): Observable<any>{
    return this.http.delete<any>(`${this.urlAPI}/${id}`);
  }

}
