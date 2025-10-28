import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ButtonModule } from 'primeng/button';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { LoginService } from './services/login.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ButtonModule, NavbarComponent, CommonModule, ToastModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'rmt-park';
  usuarioLogado = false;

  constructor(private router: Router, private loginService: LoginService) {}

  ngOnInit() {
    this.atualizarStatusUsuario();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.atualizarStatusUsuario();
      });
  }

  atualizarStatusUsuario() {
    const estaLogado = this.loginService.estaLogado();
    const ehAdmin = this.loginService.isAdmin();

    const rotaAtual = this.router.url.split('?')[0]; // remove query params

    const rotasSemNavbar = [
      '/login',
      '/home',
      '/',
      '/site-cadastro',
      '/blog',
      '/blog1',
      '/blog2',
      '/confirmar-email',
      '/redefinir-senha'
    ];

    // Navbar só aparece se usuário estiver logado, NÃO for admin e rota não estiver na lista
    this.usuarioLogado = estaLogado && !ehAdmin && !rotasSemNavbar.includes(rotaAtual);
  }

  // Métodos de navegação
  redirecionarHome() { this.router.navigate(['/vagas']); }
  redirecionarVagas() { this.router.navigate(['/vagas']); }
  redirecionarMensalistas() { this.router.navigate(['/mensalistas']); }
  redirecionarRelatorios() { this.router.navigate(['/relatorio']); }
}

