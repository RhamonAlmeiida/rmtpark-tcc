import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

import { LoginService } from '../../services/login.service';  

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    ToastModule,
    MessageModule,
    RouterModule,
    DialogModule,
    ButtonModule
  ],
  providers: [ConfirmationService, MessageService ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {  
  email = '';
  senha = '';
  dialogModalEsqueceuSenha = false;
  emailRecuperacao = '';
  carregandoRecuperacao = false;

  constructor(
    private loginService: LoginService,   
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) {}

  login() {
    if (this.loginService.login(this.email, this.senha)) {
      this.apresentarMensagemLogado();
      setTimeout(() => this.router.navigate(['/vagas']), 2000);
    } else {
      this.apresentarMensagemFalhaLogin();
    }
  }

  private apresentarMensagemFalhaLogin() {
    this.messageService.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Login ou senha incorretos',
    });
  }

  esqueciSenha() {
    this.emailRecuperacao = '';
    this.dialogModalEsqueceuSenha = true;
  }

  enviarEmailRecuperacao() {
    if (!this.emailRecuperacao) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Aviso',
        detail: 'Informe um email válido',
      });
      return;
    }

    this.carregandoRecuperacao = true;
    setTimeout(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Enviado',
        detail: `Link de recuperação enviado para ${this.emailRecuperacao}`,
      });
      this.dialogModalEsqueceuSenha = false;
      this.emailRecuperacao = '';
      this.carregandoRecuperacao = false;
    }, 1500);
  }

  private apresentarMensagemLogado() {
    this.messageService.add({
      severity: 'success',
      summary: 'Login efetuado',
      detail: 'Bem-vindo ao sistema!',
    });
  }
}
