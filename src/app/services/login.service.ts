import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private readonly usuarioFake = {
    email: 'admin@estacionamento.com',
    senha: '123456'
  };

  constructor() {}

  login(email: string, senha: string): boolean {
    if (email === this.usuarioFake.email && senha === this.usuarioFake.senha) {
      localStorage.setItem('usuarioLogado', JSON.stringify({ email }));
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('usuarioLogado');
  }

  estaLogado(): boolean {
    return !!localStorage.getItem('usuarioLogado');
  }
}
