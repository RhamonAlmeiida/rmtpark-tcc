import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ButtonModule } from 'primeng/button';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';

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

  constructor(private router: Router) {}

  ngOnInit() {
    this.atualizarStatusUsuario();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.atualizarStatusUsuario();
      });
  }

atualizarStatusUsuario() {
  const estaLogado = !!localStorage.getItem('access_token');
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

  // só mostra navbar se usuário estiver logado e rota não estiver na lista
  this.usuarioLogado = estaLogado && !rotasSemNavbar.includes(rotaAtual);
}


  redirecionarHome() {
    this.router.navigate(['/vagas']);
  }

  redirecionarVagas() {
    this.router.navigate(['/vagas']);
  }

  redirecionarMensalistas() {
    this.router.navigate(['/mensalistas']);
  }

  redirecionarRelatorios() {
    this.router.navigate(['/relatorio']);
  }
}
