import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-confirmar-email',
  templateUrl: './confirmar-email.component.html',
  styleUrls: ['./confirmar-email.component.scss']
})
export class ConfirmarEmailComponent implements OnInit {
  mensagem: string = "Confirmando seu e-mail...";
  imagem: string = "assets/loading.gif"; 
  mostrarBotaoLogin: boolean = false;

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.http.get(`https://rmtpark-api.onrender.com/api/auth/confirmar-email?token=${token}`)

        .subscribe({
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

  irParaLogin() {
    this.router.navigate(['/login']);
  }
}
