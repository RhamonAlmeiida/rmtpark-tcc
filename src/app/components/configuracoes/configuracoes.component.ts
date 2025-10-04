import { Component, OnInit } from '@angular/core';
import { ConfiguracoesService } from '../../services/configuracoes.service';

import { MessageService } from 'primeng/api';
import { Configuracoes } from '../../models/configuracoes';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';

@Component({
  selector: 'app-configuracoes',
  templateUrl: './configuracoes.component.html',
  styleUrls: ['./configuracoes.component.scss'],
  providers: [MessageService],
  standalone: true, // ← adicionar isto
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TableModule,
    ToastModule,
    ConfirmDialogModule,
    TagModule,
    DialogModule,
    SelectModule,
    InputNumberModule, // ← necessário para <p-inputNumber>
    InputTextModule,   // ← necessário para pInputText
    InputMaskModule    // ← necessário para pInputMask
  ],
})
export class ConfiguracoesComponent implements OnInit {
  empresa: Configuracoes = new Configuracoes();
  qrCodeBase64: string = '';

  constructor(
    private configuracoesService: ConfiguracoesService,
    private messageService: MessageService
  ) {}

ngOnInit(): void {
  this.configuracoesService.obterConfiguracoes().subscribe(
    (dados) => {
      this.empresa = dados;
      localStorage.setItem('config_empresa', JSON.stringify(dados));
    },
    () => {
      console.warn('Configuração não encontrada, criando padrão...');
      this.criarConfiguracoesPadrao();
    }
  );
}


  SalvarConfiguracoes() {
    this.configuracoesService.salvarConfiguracoes(this.empresa).subscribe(
      (dados) => {
        this.empresa = dados;
        localStorage.setItem('config_empresa', JSON.stringify(dados));
      }
    );
  }

  testarImpressao() {
  console.log('Teste de impressão acionado!');
}
private criarConfiguracoesPadrao(): void {
  const configPadrao: Configuracoes = {
    valorHora: 10,
    valorDiaria: 50,
    valorMensalista: 300,
    arredondamento: 15,
    formaPagamento: 'Pix',
    nome: '',
    fantasia: '',   // ← adiciona aqui
    cnpj: '',
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
    rodape: '',
    pix: ''
  };

  this.configuracoesService.salvarConfiguracoes(configPadrao).subscribe({
    next: (dados) => {
      this.empresa = dados;
      localStorage.setItem('config_empresa', JSON.stringify(dados));
      this.messageService.add({ severity: 'success', summary: 'Configuração criada', detail: 'Configuração padrão criada com sucesso.' });
    },
    error: (err) => {
      console.error('Erro ao criar configuração padrão', err);
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível criar configuração padrão.' });
    }
  });
}


}
