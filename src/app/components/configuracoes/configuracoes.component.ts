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
        const local = localStorage.getItem('config_empresa');
        if (local) this.empresa = JSON.parse(local);
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

}
