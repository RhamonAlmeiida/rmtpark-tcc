import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { MensalistaService } from '../../../services/mensalista.service';
import { ConfiguracoesService } from '../../../services/configuracoes.service';
import { LoginService } from '../../../services/login.service';
import { VagaCadastro } from '../../../models/vaga-cadastro';
import { Vaga } from '../../../models/vaga';
import { VagaService } from '../../../services/vaga.service';

@Component({
  selector: 'app-vaga-lista',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TableModule,
    ToastModule,
    ConfirmDialogModule,
    TagModule,
    DialogModule,
    SelectModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './vaga-lista.component.html',
  styleUrls: ['./vaga-lista.component.scss']
})
export class VagaListaComponent implements OnInit {
  carregandoVagas = false;
  vagas: Vaga[] = [];
  vagaCadastro: VagaCadastro = new VagaCadastro();
  vagaSelecionada: Vaga | null = null;

  // Modais
  dialogVisivelCadastrar = false;
  dialogResumoSaidaVisivel = false;
  dialogTituloCadastrar?: string;

  // Dados da saída
  dataHoraSaida: Date | null = null;
  duracao = '';
  valorTotal = 0;
  valorHora = 10;
  formaPagamento: 'Dinheiro' | 'Cartão' | 'Pix' | null = null;

  constructor(
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private vagaService: VagaService,
    private mensalistaService: MensalistaService,
    private configuracoesService: ConfiguracoesService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    if (!this.loginService.estaLogado()) {
      this.router.navigate(['/login']);
      return;
    }

    this.configuracoesService.obterValorHora().subscribe({
      next: valor => this.valorHora = valor,
      error: () => this.valorHora = 10
    });

    this.carregarVagas();
  }

  // ================= FORMATAÇÃO =================
  formatarData(data: Date | null): string {
    if (!data) return '-';
    return isNaN(data.getTime()) ? '-' : data.toLocaleString();
  }

  private formatarDataParaMySQL(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }

  // ================= CADASTRO DE VAGA =================
  abrirModalCadastrar(): void {
    this.dialogTituloCadastrar = 'Cadastro de Vaga';
    this.vagaCadastro = new VagaCadastro();
    this.dialogVisivelCadastrar = true;
  }

  atualizarPlaca(event?: Event): void {
    if (!event) return;
    const input = event.target as HTMLInputElement;
    this.vagaCadastro.placa = input.value.toUpperCase();
  }

  salvar(): void {
    const placa = (this.vagaCadastro.placa ?? '').toUpperCase().trim();
    if (placa.length !== 7) {
      this.messageService.add({ severity: 'warn', summary: 'Placa inválida', detail: 'A placa deve conter exatamente 7 caracteres.' });
      return;
    }
    this.vagaCadastro.placa = placa;
    this.vagaCadastro.dataHora = new Date();

    this.mensalistaService.obterTodos().subscribe({
      next: mensalistas => {
        this.vagaCadastro.tipo = mensalistas.some(m => m.placa.replace('-', '').toUpperCase() === placa)
          ? 'Mensalista'
          : 'Diarista';

        this.vagaService.cadastrar(this.vagaCadastro).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Veículo cadastrado com sucesso' });
            this.dialogVisivelCadastrar = false;
            this.carregarVagas();
          },
          error: (err: any) => {
            console.error(err);
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível cadastrar a vaga.' });
          }
        });
      },
      error: (err: any) => {
        console.error(err);
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao obter mensalistas.' });
      }
    });
  }

  // ================= SAÍDA =================
  confirmaSaida(event: Event, id: number): void {
    const vaga = this.vagas.find(v => v.id === id);
    if (!vaga) return;

    this.confirmationService.confirm({
      target: event.target ?? undefined,
      message: 'Deseja realmente registrar a saída?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.vagaSelecionada = vaga;
        this.registrarSaidaFluxo();
      }
    });
  }

  private registrarSaidaFluxo(): void {
    if (!this.vagaSelecionada || !this.vagaSelecionada.dataHora) return;

    this.dataHoraSaida = new Date();

    if (this.vagaSelecionada.tipo === 'Mensalista') {
      this.finalizarSaida();
      return;
    }

    const diffMs = this.dataHoraSaida.getTime() - this.vagaSelecionada.dataHora.getTime();
    const diffHoras = diffMs / (1000 * 60 * 60);

    this.configuracoesService.obterValorHora().subscribe({
      next: valor => this.processarSaida(diffHoras, valor),
      error: () => this.processarSaida(diffHoras, 10)
    });
  }

  private processarSaida(diffHoras: number, valorHora: number) {
    this.valorHora = valorHora;
    this.valorTotal = Math.ceil(diffHoras) * this.valorHora;
    const minutos = Math.round((diffHoras % 1) * 60);
    this.duracao = `${Math.floor(diffHoras)}h ${minutos}min`;
    this.dialogResumoSaidaVisivel = true;
  }

  finalizarSaida(): void {
    if (!this.vagaSelecionada) return;

    const now = new Date();
    let duracaoStr = 'Mensalista ativo';
    let valor = 0;

    if (this.vagaSelecionada.tipo === 'Diarista') {
      if (!this.vagaSelecionada.dataHora) return;
      const diffMs = now.getTime() - this.vagaSelecionada.dataHora.getTime();
      const diffHoras = diffMs / (1000 * 60 * 60);

      this.configuracoesService.obterValorHora().subscribe({
        next: valorHora => this.enviarSaidaDiarista(diffHoras, valorHora, now),
        error: () => this.enviarSaidaDiarista(diffHoras, 10, now)
      });
    } else {
      this.enviarSaida(duracaoStr, valor, now);
    }
  }

  private enviarSaidaDiarista(diffHoras: number, valorHora: number, now: Date) {
    this.valorHora = valorHora;
    const valor = Math.ceil(diffHoras) * this.valorHora;
    const minutos = Math.round((diffHoras % 1) * 60);
    const duracaoStr = `${Math.floor(diffHoras)}h ${minutos}min`;
    this.enviarSaida(duracaoStr, valor, now);
  }

  private enviarSaida(duracaoStr: string, valor: number, saida: Date) {
  if (!this.vagaSelecionada) return;

  // Garantir que o valor enviado seja o calculado no modal
  const valorCalculado = this.vagaSelecionada.tipo === 'Mensalista'
    ? 0 // ou valor do mensalista, se for só cobrar mensalmente
    : this.valorTotal; // para diarista, usar valor calculado por hora

  const dados: any = {
    saida: saida.toISOString(),
    duracao: duracaoStr,
    valor: valorCalculado,
    formaPagamento: this.vagaSelecionada.tipo === 'Diarista' && this.formaPagamento
      ? this.formaPagamento
      : undefined
  };

  const vagaId = this.vagaSelecionada.id;

  this.vagaService.registrarSaida(vagaId, dados).subscribe({
    next: (res: any) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Saída registrada',
        detail: `Veículo ${res.placa ?? ''} registrado no relatório`
      });
      this.dialogResumoSaidaVisivel = false;
      this.vagaSelecionada = null;
      this.vagas = this.vagas.filter(v => v.id !== vagaId);
    },
    error: (err: any) => {
      console.error(err);
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Não foi possível registrar a saída.'
      });
    }
  });
}


  // ================= CARREGAMENTO =================
  carregarVagas(): void {
    this.carregandoVagas = true;

    this.vagaService.obterTodos().subscribe({
      next: (vagas: any[]) => {
        this.vagas = vagas.map(v => new Vaga(
          v.id,
          v.placa,
          v.tipo,
          v.data_hora ? new Date(v.data_hora) : null,
          v.data_hora_saida ? new Date(v.data_hora_saida) : null,
          v.duracao,
          v.valor_pago,
          v.forma_pagamento,
          v.status_pagamento
        ));
        this.carregandoVagas = false;
      },
      error: (err: any) => {
        console.error(err);
        this.carregandoVagas = false;

        if (err.status === 401) {
          this.loginService.logout();
          this.router.navigate(['/login']);
        }
      }
    });
  }
}
