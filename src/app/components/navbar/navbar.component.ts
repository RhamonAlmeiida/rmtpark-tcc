import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ToastModule,
  ],
  providers: [MessageService, LoginService],
})
export class NavbarComponent implements OnInit {
  usuarioEmail: string = '';

  constructor(
    private router: Router,
    private loginService: LoginService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    const dados = localStorage.getItem('usuarioLogado');
    if (dados) {
      const usuario = JSON.parse(dados);
      this.usuarioEmail = usuario.email;
    }
  }

logout() {
  this.loginService.logout();
  this.messageService.add({
    severity: 'success',
    summary: 'Sucesso',
    detail: 'Deslogado com sucesso',
  });

  setTimeout(() => {
    this.router.navigate(['/login']);
  }, 1000);
}
}