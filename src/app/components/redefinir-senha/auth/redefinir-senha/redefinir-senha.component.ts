import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { RedefinirSenhaService } from '../../../../services/redefinir-senha.service';


@Component({
  selector: 'app-redefinir-senha',
  templateUrl: './redefinir-senha.component.html',
  styleUrls: ['./redefinir-senha.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ToastModule,
    MessageModule,
    DialogModule,
    ButtonModule
  ],
  providers: [MessageService]
})
export class RedefinirSenhaComponent {
  novaSenha = '';
  confirmarSenha = '';
  carregando = false;
  token: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private redefinirSenhaService: RedefinirSenhaService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.token = this.route.snapshot.queryParamMap.get('token');
  }

  redefinirSenha() {
    if (this.novaSenha !== this.confirmarSenha) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Aviso',
        detail: 'As senhas não coincidem',
      });
      return;
    }

    if (!this.token) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Token inválido ou ausente',
      });
      return;
    }

    this.carregando = true;

    this.redefinirSenhaService.redefinirSenha(this.token, this.novaSenha).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Senha redefinida com sucesso!',
        });
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        console.error('Erro ao redefinir senha:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err.error?.detail || 'Falha ao redefinir senha',
        });
      },
      complete: () => {
        this.carregando = false;
      }
    });
  }
}
