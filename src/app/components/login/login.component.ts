import { Component } from '@angular/core';
import { Router } from '@angular/router';
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
    DialogModule,
    ButtonModule
  ],
  providers: [ConfirmationService, MessageService],
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
    private messageService: MessageService
  ) {}

  // ---------------- LOGIN ----------------
login() {
  if (!this.email || !this.senha) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Atenção',
      detail: 'Preencha email e senha'
    });
    return;
  }

  this.loginService.login(this.email, this.senha).subscribe({
    next: (res) => {
      // Salva o token ANTES de navegar
      this.loginService.salvarToken(res.access_token, res.is_admin ?? false, this.email);

      this.messageService.add({
        severity: 'success',
        summary: 'Login efetuado',
        detail: 'Bem-vindo ao sistema!'
      });

      // Navega após salvar token
      if (res.is_admin) {
        this.router.navigate(['/painel-admin']);
      } else {
        this.router.navigate(['/vagas']);
      }
    },
    error: (err: any) => {
      const detail = err.error?.detail || 'Login ou senha incorretos';
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail
      });
    }
  });
}




  // ---------------- ESQUECI SENHA ----------------
  esqueciSenha() {
    this.emailRecuperacao = '';
    this.dialogModalEsqueceuSenha = true;
  }

  enviarEmailRecuperacao() {
    if (!this.emailRecuperacao) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Aviso',
        detail: 'Informe um email válido'
      });
      return;
    }

    this.carregandoRecuperacao = true;

    this.loginService.recuperarSenha(this.emailRecuperacao).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Enviado',
          detail: `Link de recuperação enviado para ${this.emailRecuperacao}`
        });
        this.dialogModalEsqueceuSenha = false;
        this.emailRecuperacao = '';
      },
      error: (err: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err.error?.detail || 'Falha ao enviar link de recuperação'
        });
      },
      complete: () => this.carregandoRecuperacao = false
    });
  }
}
