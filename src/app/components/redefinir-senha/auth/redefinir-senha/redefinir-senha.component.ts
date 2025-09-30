import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-redefinir-senha',
  templateUrl: './redefinir-senha.component.html',
  styleUrls: ['./redefinir-senha.component.scss'],
    imports: [
    FormsModule,
    ToastModule,
    MessageModule,
    RouterModule,
    DialogModule,
    ButtonModule
  ],
  providers: [MessageService, FormsModule]
})
export class RedefinirSenhaComponent {
  novaSenha = '';
  confirmarSenha = '';
  carregando = false;
  token: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
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

  this.carregando = true;

  // URL da API em produção
const apiUrl = window.location.hostname === 'localhost'
  ? 'http://127.0.0.1:8000/api/auth/redefinir-senha'
  : 'https://rmtpark-api.onrender.com/api/auth/redefinir-senha';


  this.http.post(apiUrl, {
    token: this.token,
    nova_senha: this.novaSenha
  }).subscribe({
    next: () => {
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Senha redefinida com sucesso!',
      });
      setTimeout(() => this.router.navigate(['/login']), 2000);
    },
    error: (err) => {
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
