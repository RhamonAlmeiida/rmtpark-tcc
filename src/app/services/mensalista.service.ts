import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mensalista } from '../models/mensalista';
import { MensalistaCadastro } from '../models/mensalista-cadastro';
import { LoginService } from './login.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MensalistaService {
  private apiUrl = `${environment.apiUrl}/mensalistas`;

  constructor(private http: HttpClient, private loginService: LoginService) {}

  private getHeaders(): HttpHeaders {
    const token = this.loginService.getToken();
    if (!token) throw new Error('Usuário não autenticado');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  cadastrar(mensalista: MensalistaCadastro): Observable<Mensalista> {
    return this.http.post<Mensalista>(this.apiUrl, mensalista, { headers: this.getHeaders() });
  }

  obterTodos(): Observable<Mensalista[]> {
    return this.http.get<Mensalista[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  obterPorId(id: number): Observable<Mensalista> {
    return this.http.get<Mensalista>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  apagar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
