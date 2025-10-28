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

  // Normaliza os campos que o template espera
  private mapEmpresa(e: any) {
    return {
      id: e.id,
      nome: e.nome ?? e.name ?? '—',
      ativa: ('ativa' in e) ? e.ativa : (e.is_active ?? false),
      // normaliza data para um campo chamado dataExpiracao usado no template
      dataExpiracao: e.dataExpiracao ?? e.data_expiracao ?? e.dataExpira ?? null,
      totalVeiculos: e.totalVeiculos ?? e.total_veiculos ?? e.veiculos_count ?? 0,
      // mantém o objeto original caso precise
      _raw: e
    };
  }

  renovarPlano(id: number) {
    if (!confirm('Confirmar renovação do plano por +30 dias?')) return;
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
    if (!confirm('Esta ação é irreversível. Deseja continuar?')) return;
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

