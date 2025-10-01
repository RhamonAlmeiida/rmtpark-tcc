import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { InputMaskModule } from 'primeng/inputmask';
import { SiteCadastroService } from '../../services/site-cadastro.service';

@Component({
  selector: 'app-site-cadastro',
  standalone: true,
  imports: [
    FormsModule,
    ToastModule,
    MessageModule,
    RouterModule,
    DialogModule,
    ButtonModule,
    CardModule,
    InputMaskModule,
    CommonModule,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './site-cadastro.component.html',
  styleUrls: ['./site-cadastro.component.scss']
})
export class SiteCadastroComponent {

  cadastro = {
  nome: '',
  email: '',
  telefone: '',
  cnpj: '',
  senha: '',
  aceite: false
};


  constructor(
    private siteCadastroService: SiteCadastroService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) {}

  voltarPagina() {
    this.router.navigate(['/home']);
  }

  finalizarCadastro() {
    if (!this.cadastro.nome || !this.cadastro.email || !this.cadastro.senha) {
      this.messageService.add({
        severity: 'error',
        summary: 'Atenção',
        detail: 'Preencha todos os campos obrigatórios!'
      });
      return;
    }
  
    // Remove a formatação do CNPJ antes de enviar
    const cadastroFormatado = {
      ...this.cadastro,
      cnpj: this.cadastro.cnpj.replace(/\D/g, '')  // Remove tudo que não for número
    };
  
    this.siteCadastroService.cadastrar(cadastroFormatado).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Cadastro realizado',
          detail: 'Entraremos em contato em breve!'
        });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        const detalhe = err.error?.detail || 'CNPJ já cadastrado!';
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: detalhe
        });
      }
    });
  }
  
}
