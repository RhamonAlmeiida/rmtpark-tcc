import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { EmpresaService } from '../../services/empresa.service';
import { LoginService } from '../../services/login.service';
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
    ProgressSpinnerModule,
    ConfirmDialogModule
  ],
  templateUrl: './painel-admin.component.html',
  styleUrls: ['./painel-admin.component.scss'],
  providers: [MessageService, LoginService, ConfirmationService]
})
export class PainelAdminComponent implements OnInit, OnDestroy {
  empresas: any[] = [];
  loading = false;
  pollingSub: Subscription | null = null;
  public MAX_VAGAS = Number.MAX_SAFE_INTEGER;

  private limitesPorPlano: Record<string, number | 'Ilimitado'> = {
    Básico: 50,
    Profissional: 150,
    Premium: 'Ilimitado',
    Empresarial: 'Ilimitado'
  };

  constructor(
    private empresaService: EmpresaService,
    private messageService: MessageService,
    private loginService: LoginService,
    private router: Router,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.load();
    this.pollingSub = interval(10000).subscribe(() => this.load());
  }

  ngOnDestroy() {
    this.pollingSub?.unsubscribe();
  }

  load() {
    this.loading = true;
    this.empresaService.listarEmpresas().subscribe({
      next: (res: any[]) => {
        this.empresas = Array.isArray(res) ? res.map(e => this.mapEmpresa(e)) : [];
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
    const planoRaw = e.plano?.titulo?.toString()?.trim() ?? '';
    const planoKey = planoRaw ? planoRaw.charAt(0).toUpperCase() + planoRaw.slice(1).toLowerCase() : '';
    const limite = this.limitesPorPlano[planoKey] ?? 0;

    return {
      id: e.id,
      nome: e.nome ?? '—',
      email: e.email ?? '-',
      cnpj: e.cnpj ?? '_',
      ativa: Boolean(e.ativa),
      dataExpiracao: e.dataExpiracao ?? e.data_expiracao ?? null,
      totalVeiculos: Number(e.total_veiculos ?? 0),
      limiteVagas: limite,
      plano: {
        titulo: planoRaw || '',
        preco: e.plano?.preco ?? '-',
        recursos: e.plano?.recursos ?? [],
        destaque: e.plano?.destaque ?? false
      },
      emailConfirmado: Boolean(e.email_confirmado),
      _raw: e
    };
  }

  formatarCnpj(cnpj: string): string {
    if (!cnpj) return '';
    cnpj = cnpj.replace(/\D/g, '');
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  }

  getLimiteVagasNumerico(empresa: any): number {
    if (empresa.limiteVagas === 'Ilimitado') return this.MAX_VAGAS;
    return Number(empresa.limiteVagas ?? 0);
  }

  // =====================
  // Funções de confirmação
  // =====================

  confirmEmail(event: Event, id: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Confirmar e-mail cadastrado?',
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Confirmar',
      rejectLabel: 'Cancelar',
      accept: () => this.confirmaEmail(id),
      reject: () => this.messageService.add({ severity: 'info', summary: 'Cancelado', detail: 'Ação cancelada' })
    });
  }

  confirmRenovarPlano(event: Event, id: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Confirmar renovação do plano por +30 dias?',
      header: 'Renovação',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Confirmar',
      rejectLabel: 'Cancelar',
      accept: () => this.renovarPlano(id),
      reject: () => this.messageService.add({ severity: 'info', summary: 'Cancelado', detail: 'Ação cancelada' })
    });
  }

  confirmExcluirEmpresa(event: Event, id: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Esta ação é irreversível. Deseja continuar?',
      header: 'Atenção',
      icon: 'pi pi-info-circle',
      acceptLabel: 'Excluir',
      rejectLabel: 'Cancelar',
      accept: () => this.excluirEmpresa(id),
      reject: () => this.messageService.add({ severity: 'info', summary: 'Cancelado', detail: 'Ação cancelada' })
    });
  }

  // =====================
  // Funções de serviço
  // =====================

  confirmaEmail(id: number){
    this.empresaService.confirmaEmail(id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'E-mail Confirmado' });
        this.load();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: err?.error?.detail || 'Falha ao confirmar e-mail' });
      }
    });
  }

  renovarPlano(id: number) {
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
    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Você foi deslogado' });
    setTimeout(() => this.router.navigate(['/login']), 500);
  }
}
