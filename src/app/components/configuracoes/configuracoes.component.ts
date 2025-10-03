import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Configuracoes, ConfiguracoesService } from '../../services/configuracoes.service';


@Component({
  selector: 'app-configuracoes',
  templateUrl: './configuracoes.component.html',
  styleUrls: ['./configuracoes.component.css'],
  providers: [MessageService]
})
export class ConfiguracoesComponent implements OnInit {
  empresa: Configuracoes = {
    valorHora: 10,
    valorDiaria: 50,
    valorMensalista: 200,
    arredondamento: 15,
    formaPagamento: 'Dinheiro'
  };

  constructor(
    private configuracoesService: ConfiguracoesService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.configuracoesService.obterConfiguracoes().subscribe({
      next: (dados) => {
        // se o backend retornou configuração, aplica
        this.empresa = dados;
        localStorage.setItem('config_empresa', JSON.stringify(dados));
      },
      error: (err) => {
        // se backend não tem configuração, tenta pegar do localStorage
        if (err.error?.detail === "Configurações não encontradas") {
          const local = localStorage.getItem('config_empresa');
          if (local) {
            this.empresa = JSON.parse(local);
          } else {
            // mantém o padrão inicial (já definido no construtor)
            this.messageService.add({
              severity: 'warn',
              summary: 'Aviso',
              detail: 'Nenhuma configuração encontrada. Usando valores padrão.'
            });
          }
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Não foi possível carregar as configurações.'
          });
        }
      }
    });
  }

  SalvarConfiguracoes() {
    this.configuracoesService.salvarConfiguracoes(this.empresa).subscribe({
      next: (dados) => {
        this.empresa = dados;
        localStorage.setItem('config_empresa', JSON.stringify(dados));
        this.messageService.add({
          severity: 'success',
          summary: 'Configurações',
          detail: 'Dados salvos com sucesso!'
        });
      },
      error: () => {
        // salva localmente mesmo que o backend falhe
        localStorage.setItem('config_empresa', JSON.stringify(this.empresa));
        this.messageService.add({
          severity: 'warn',
          summary: 'Aviso',
          detail: 'Não foi possível salvar no servidor. Dados salvos localmente.'
        });
      }
    });
  }
}
