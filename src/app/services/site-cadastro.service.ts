import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SiteCadastro, SiteCadastroCreate } from '../models/site-cadastro';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SiteCadastroService {  
  urlAPI = window.location.hostname === 'localhost'
    ? 'http://127.0.0.1:8000/api/empresa'
    : 'https://rmtpark-bd.onrender.com/api/empresa';;

  constructor(private http: HttpClient) {}

  cadastrar(dados: any): Observable<any> {
    return this.http.post(this.urlAPI, dados);
  }

  obterTodos(): Observable<SiteCadastro[]> {
    return this.http.get<SiteCadastro[]>(this.urlAPI);
  }

  obterPorId(id: number): Observable<SiteCadastro> {
    return this.http.get<SiteCadastro>(`${this.urlAPI}/${id}`);
  }

  atualizar(id: number, dados: SiteCadastroCreate): Observable<SiteCadastro> {
    return this.http.put<SiteCadastro>(`${this.urlAPI}/${id}`, dados);
  }

  apagar(id: number): Observable<any> {
    return this.http.delete<any>(`${this.urlAPI}/${id}`);
  }
}
