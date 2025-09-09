import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SiteCadastro } from '../models/site-cadastro';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SiteCadastroService {
  private urlAPI: string;
constructor(private http: HttpClient) {
  this.urlAPI = "http://localhost:4200/"
 }


 cadastrar(SiteCadastro: SiteCadastro): Observable<SiteCadastro>{
  return this.http.post<SiteCadastro>(this.urlAPI, SiteCadastro);
 }
 obterTodos() : Observable<SiteCadastro[]>{
  return this.http.get<SiteCadastro[]>(this.urlAPI)
 }
 obterPorId(id: number) : Observable<SiteCadastro>{
  return this.http.get<SiteCadastro>(`${this.urlAPI}/${id}`);
 }
 atualizar(id: number, dados: SiteCadastro): Observable<SiteCadastro> {
  return this.http.put<SiteCadastro>(`${this.urlAPI}/${id}`, dados);
 }
 apagar(id: number): Observable<any>{
  return this.http.delete<any>(`${this.urlAPI}/${id}`);
 }
}
