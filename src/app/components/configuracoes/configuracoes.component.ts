import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputMaskModule } from 'primeng/inputmask';

import { ListaStatus, ListaTurnos } from '../../models/lista-turnos';
import { Funcionarios } from '../../models/funcionarios';
import { FuncionariosService } from '../../services/funcionarios-service';
import { Router } from '@angular/router';
import { Empresa } from '../../models/configuracoes';
import { ConfiguracoesService } from '../../services/configuracoes.service';

@Component({
  selector: 'app-configuracoes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TableModule,
    ToastModule,
    DatePickerModule,
    ConfirmDialogModule,
    DialogModule,
    TagModule,
    InputTextModule,
    DropdownModule,
    InputNumberModule,
    InputMaskModule
  ],
  templateUrl: './configuracoes.component.html',
  styleUrls: ['./configuracoes.component.scss'],
  providers: [MessageService, ConfirmationService, FuncionariosService]
})
export class ConfiguracoesComponent implements OnInit {
  dialogVisivelCadastrarFuncionario: boolean = false;
  cancelarConfiguracoes: boolean = false;

  funcionarios: Funcionarios = new Funcionarios();
  empresa: Empresa = new Empresa();
  qrCodeBase64: string = '';

  listaTurnos: ListaTurnos[] = [
    new ListaTurnos('Manhã (07h - 13h)', 'manha'),
    new ListaTurnos('Tarde (13h - 19h)', 'tarde'),
    new ListaTurnos('Noite (19h - 01h)', 'noite'),
    new ListaTurnos('Madrugada (01h - 07h)', 'madrugada')
  ];

  listaStatus: ListaStatus[] = [
    new ListaStatus('Ativo', 'ativo'),
    new ListaStatus('Inativo', 'inativo'),
    new ListaStatus('Afastado', 'afastado')
  ];

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private configuracoesService: ConfiguracoesService
  ) {}

  ngOnInit(): void {
    const dadosSalvos = localStorage.getItem('config_empresa');
    if (dadosSalvos) {
      this.empresa = JSON.parse(dadosSalvos);
      this.gerarQRCode(); // Gera QR automaticamente se chave Pix existir
    }
  }

  abrirModalCadastrarFuncionario() {
    this.dialogVisivelCadastrarFuncionario = true;
    this.funcionarios = new Funcionarios();
  }

  SalvarConfiguracoes() {
    localStorage.setItem('config_empresa', JSON.stringify(this.empresa));

    this.messageService.add({
      severity: 'success',
      summary: 'Configurações',
      detail: 'Dados da empresa salvos com sucesso!'
    });
  }

  gerarQRCode() {
    if (!this.empresa.pix || this.empresa.pix.trim() === '') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Informe a chave PIX para gerar o QR Code.'
      });
      return;
    }

    const encoded = encodeURIComponent(this.empresa.pix);
    this.qrCodeBase64 = `https://chart.googleapis.com/chart?cht=qr&chs=180x180&chl=${encoded}`;
  }

  testarImpressao() {
    if (!this.qrCodeBase64 || !this.empresa.nome) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Faltam dados',
        detail: 'Preencha os dados da empresa e gere o QR Code antes de testar a impressão.'
      });
      return;
    }

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head><title>Comprovante</title></head>
          <body style="font-family: sans-serif; padding: 20px;">
            <h2>${this.empresa.nome}</h2>
            <p><strong>CNPJ:</strong> ${this.empresa.cnpj}</p>
            <p><strong>Endereço:</strong> ${this.empresa.endereco}, ${this.empresa.cidade} - ${this.empresa.estado}, ${this.empresa.cep}</p>
            <p><strong>Forma de Pagamento:</strong> ${this.empresa.formaPagamento}</p>
            <p><img src="${this.qrCodeBase64}" alt="QR Code Pix"></p>
            <p><em>${this.empresa.rodape}</em></p>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  }
}
