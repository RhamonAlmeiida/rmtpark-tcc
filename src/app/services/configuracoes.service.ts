import { Injectable } from '@angular/core';
import { Empresa } from '../models/configuracoes';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracoesService {
  private readonly STORAGE_KEY = 'config_empresa';

  salvarConfiguracoes(empresa: Empresa): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(empresa));
  }

  obterConfiguracoes(): Empresa {
    const dados = localStorage.getItem(this.STORAGE_KEY);
    return dados ? JSON.parse(dados) : new Empresa();
  }

  obterValorHora(): number {
    const dados = this.obterConfiguracoes();
    return dados.valorHora || 10; // valor padrão 10 caso não tenha nada salvo
  }
}
