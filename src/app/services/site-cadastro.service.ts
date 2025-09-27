import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SiteCadastro } from '../models/site-cadastro';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SiteCadastroService {
  private urlAPI = window.location.hostname === 'localhost'
  ? 'http://127.0.0.1:8000/empresas'
  : 'https://api.rmt-park.com/empresas';


  constructor(private http: HttpClient) {}

  cadastrar(dados: SiteCadastro): Observable<SiteCadastro> {
    return this.http.post<SiteCadastro>(this.urlAPI, dados);
  }

  obterTodos(): Observable<SiteCadastro[]> {
    return this.http.get<SiteCadastro[]>(this.urlAPI);
  }

  obterPorId(id: number): Observable<SiteCadastro> {
    return this.http.get<SiteCadastro>(`${this.urlAPI}/${id}`);
  }

  atualizar(id: number, dados: SiteCadastro): Observable<SiteCadastro> {
    return this.http.put<SiteCadastro>(`${this.urlAPI}/${id}`, dados);
  }

  apagar(id: number): Observable<any> {
    return this.http.delete<any>(`${this.urlAPI}/${id}`);
  }
}
