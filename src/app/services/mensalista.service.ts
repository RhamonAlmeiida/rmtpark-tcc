import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MensalistaCadastro } from '../models/mensalista-cadastro';
import { Mensalista } from '../models/mensalista';

@Injectable({
  providedIn: 'root'
})
export class MensalistaService {

  private readonly STORAGE_KEY = 'mensalistas';

  constructor() {}

  private getMensalistas(): Mensalista[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  private salvarMensalistas(lista: Mensalista[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(lista));
  }
cadastrar(mensalistaCadastro: MensalistaCadastro): Observable<Mensalista> {
  const lista = this.getMensalistas();

  const proximoId = lista.length
    ? Math.max(...lista.map(m => m.id ?? 0)) + 1
    : 1;

  const hoje = new Date();
  const validade = mensalistaCadastro.validade
    ? new Date(mensalistaCadastro.validade)
    : hoje;

  const diasRestantes = Math.ceil(
    (validade.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24)
  );

  const status: 'ativo' | 'inadimplente' | 'vencendo' =
    validade < hoje
      ? 'inadimplente'
      : diasRestantes <= 5
        ? 'vencendo'
        : 'ativo';

  const novo: Mensalista = {
    id: proximoId,
    nome: mensalistaCadastro.nome,
    placa: mensalistaCadastro.placa,
    veiculo: mensalistaCadastro.veiculo,
    cor: mensalistaCadastro.cor,
    cpf: mensalistaCadastro.cpf,
    validade: validade.toISOString().split('T')[0], // formato yyyy-MM-dd
    status: status
  };

  lista.push(novo);
  this.salvarMensalistas(lista);
  return of(novo);
}




  obterTodos(): Observable<Mensalista[]> {
    return of(this.getMensalistas());
  }

  obterPorId(id: number): Observable<Mensalista> {
    const encontrado = this.getMensalistas().find(m => m.id === id)!;
    return of(encontrado);
  }

  apagar(id: number): Observable<any> {
    const lista = this.getMensalistas().filter(m => m.id !== id);
    this.salvarMensalistas(lista);
    return of({ sucesso: true });
  }
}
