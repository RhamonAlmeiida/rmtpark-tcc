import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  private apiUrl = `${environment.apiUrl}`;
  
  constructor(private http: HttpClient) {}
   
  private authHeaders() {
    const token = localStorage.getItem('access_token') || '';
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}`}) };
  }

  listarEmpresas(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/empresas`, this.authHeaders());
  }

  renovarPlano(id: number) {
    return this.http.put(`${this.apiUrl}/admin/empresas/${id}/renovar`, {}, this.authHeaders());
  }

  deletarEmpresa(id: number) {
    return this.http.delete(`${this.apiUrl}/adim/empresas/${id}`, this.authHeaders());
  }
}
