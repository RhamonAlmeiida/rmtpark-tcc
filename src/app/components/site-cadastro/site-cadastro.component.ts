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
import { LoginService } from '../../services/login.service';
import { InputMaskModule } from 'primeng/inputmask';

@Component({
  selector: 'app-site-cadastro',
  standalone: true, // 👈 importante se não usar módulo tradicional
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
  styleUrls: ['./site-cadastro.component.scss'] // 👈 corrigido
})
export class SiteCadastroComponent {

  // Modelo para armazenar os dados do formulário
  cadastro = {
    nome: '',
    email: '',
    telefone: '',
    cnpj: '',
    senha: '',
    aceite: false
  };

  constructor(
    private loginService: LoginService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) {}

  voltarPagina() {
    this.router.navigate(['/home']);
  }

  finalizarCadastro() {
    // Validação simples
    if (!this.cadastro.nome || !this.cadastro.email || !this.cadastro.senha) {
      this.messageService.add({
        severity: 'error',
        summary: 'Atenção',
        detail: 'Preencha todos os campos obrigatórios!'
      });
      return;
    }
    debugger
    // Chamada ao serviço de API
    this.loginService.cadastrar(this.cadastro).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Cadastro realizado',
          detail: 'Entraremos em contato em breve!'
        });
        this.router.navigate(['/login']);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível concluir o cadastro.'
        });
      }
    });
  }
}
