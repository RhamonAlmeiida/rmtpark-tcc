import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SiteCadastro, SiteCadastroCreate } from '../models/site-cadastro';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SiteCadastroService {  
  private apiUrl = `${environment.apiUrl}/empresa`;

  constructor(private http: HttpClient) {
    
  }

  cadastrar(dados: SiteCadastroCreate): Observable<SiteCadastro> {
    return this.http.post<SiteCadastro>(this.apiUrl, dados);
  }

  obterTodos(): Observable<SiteCadastro[]> {
    return this.http.get<SiteCadastro[]>(this.apiUrl);
  }

  obterPorId(id: number): Observable<SiteCadastro> {
    return this.http.get<SiteCadastro>(`${this.apiUrl}/${id}`);
  }

  atualizar(id: number, dados: SiteCadastroCreate): Observable<SiteCadastro> {
    return this.http.put<SiteCadastro>(`${this.apiUrl}/${id}`, dados);
  }

  apagar(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
