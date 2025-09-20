
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-confirmar-email',
  template: `
    <div class="confirmacao-email">
      <h2>{{ mensagem }}</h2>
    </div>
  `,
  styles: [`
    .confirmacao-email { text-align: center; margin-top: 50px; font-family: sans-serif; }
  `]
})
export class ConfirmarEmailComponent implements OnInit {
  mensagem: string = "Confirmando seu e-mail...";

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.http.get(`http://localhost:8000/auth/confirmar-email?token=${token}`)
        .subscribe({
          next: () => this.mensagem = 'E-mail confirmado com sucesso! ✅',
          error: () => this.mensagem = 'Token inválido ou expirado ❌'
        });
    } else {
      this.mensagem = 'Token não encontrado na URL ❌';
    }
  }
}
