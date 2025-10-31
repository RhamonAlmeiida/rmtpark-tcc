// src/app/components/admin-panel/painel-admin.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { EmpresaService } from '../../services/empresa.service';
import { LoginService } from '../../services/login.service';
import { routes } from '../../app.routes';
import { Router } from '@angular/router';

@Component({
  selector: 'app-painel-admin',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    ToastModule,
    DialogModule,
    ProgressSpinnerModule
  ],
  templateUrl: './painel-admin.component.html',
  styleUrls: ['./painel-admin.component.scss'],
  providers: [MessageService, LoginService,Router]
})
export class PainelAdminComponent implements OnInit, OnDestroy {
  empresas: any[] = [];
  loading = false;
  pollingSub: Subscription | null = null;

  constructor(
    private empresaService: EmpresaService,
    private messageService: MessageService,
    private loginService: LoginService, 
    private router: Router 
  ) {}

  ngOnInit() {
    this.load();
    // polling opcional para "tempo real"
    this.pollingSub = interval(10000).subscribe(() => this.load());
  }

  ngOnDestroy() {
    this.pollingSub?.unsubscribe();
  }

  // Carrega e mapeia dados para o formato do template
  load() {
    this.loading = true;
    this.empresaService.listarEmpresas().subscribe({
      next: (res: any[]) => {
        // garante que res é array
        this.empresas = Array.isArray(res) ? res.map(this.mapEmpresa) : [];
        this.loading = false;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err?.error?.detail || 'Falha ao carregar empresas'
        });
        this.loading = false;
      }
    });
  }

private mapEmpresa(e: any) {
  return {
    id: e.id,
    nome: e.nome ?? e.name ?? '—',
    email: e.email ?? e.email ?? '-',
    cnpj: e.cnpj ?? e.cnpj ?? '_',
    ativa: Boolean(e.ativa),
    dataExpiracao: e.dataExpiracao ?? e.data_expiracao ?? e.dataExpira ?? null,
    totalVeiculos: e.totalVeiculos ?? e.total_veiculos ?? e.veiculos_count ?? 0,
    emailConfirmado: Boolean(e.email_confirmado),
    _raw: e
  };
}

formatarCnpj(cnpj: string): string {
  if (!cnpj) return '';
  cnpj = cnpj.replace(/\D/g, '');
  return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
}



  confirmaEmail(id: number){
    if (!confirm('Confirmar email cadastrado ?')) return;
    this.empresaService.confirmaEmail(id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'E-mail Confirmado '});
        this.load();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: err?.error?.detail || 'Falha ao confirmar e-mail' })
      }
    });
  }

  renovarPlano(id: number) {
    if (!confirm('Confirmar renovação do plano por +30 dias ?')) return;
    this.empresaService.renovarPlano(id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Renovado', detail: 'Plano renovado por +30 dias' });
        this.load();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: err?.error?.detail || 'Falha ao renovar' });
      }
    });
  }

  excluirEmpresa(id: number) {
    if (!confirm('Esta ação é irreversível. Deseja continuar ?')) return;
    this.empresaService.deletarEmpresa(id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Removido', detail: 'Empresa removida' });
        this.load();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: err?.error?.detail || 'Falha ao excluir' });
      }
    });
  }
   logout() {
    this.loginService.logout();
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Você foi deslogado'
    });
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 500);
  }
}

