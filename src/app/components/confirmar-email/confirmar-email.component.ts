import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ConfirmarEmailService } from '../../services/confirmar-email.service';

@Component({
  selector: 'app-confirmar-email',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmar-email.component.html',
  styleUrls: ['./confirmar-email.component.scss']
})
export class ConfirmarEmailComponent implements OnInit {
  mensagem = 'Confirmando seu e-mail...';
  imagem = 'assets/loading.gif';
  mostrarBotaoLogin = false;

  constructor(
    private route: ActivatedRoute,
    private confirmarEmailService: ConfirmarEmailService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (token) {
      this.confirmarEmailService.confirmarEmail(token).subscribe({
        next: () => {
          this.mensagem = 'E-mail confirmado com sucesso! ✅';
          this.imagem = 'assets/email_confirmado.png';
          this.mostrarBotaoLogin = true;
        },
        error: () => {
          this.mensagem = 'Token inválido ou expirado ❌';
          this.imagem = 'assets/erro.png';
        }
      });
    } else {
      this.mensagem = 'Token não encontrado na URL ❌';
      this.imagem = 'assets/erro.png';
    }
  }

  irParaLogin(): void {
    this.router.navigate(['/login']);
  }
}
