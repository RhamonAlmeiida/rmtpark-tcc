import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { VagaService } from '../../../services/vaga.service';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { MensalistaService } from '../../../services/mensalista.service';
import { ConfiguracoesService } from '../../../services/configuracoes.service';
import { VagaCadastro } from '../../../models/vaga-cadastro';
import { Vaga } from '../../../models/vaga';

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
    DialogModule
  ],
  providers: [ConfirmationService, MessageService, MensalistaService],
  templateUrl: './vaga-lista.component.html',
  styleUrls: ['./vaga-lista.component.scss']
})
export class VagaListaComponent implements OnInit {
  carregandoVagas = false;
  vagaCadastro: VagaCadastro = new VagaCadastro();
  dialogVisivelCadastrar = false;
  dialogTituloCadastrar?: string;
  vagaSelecionada: Vaga | null = null;
  dataHoraSaida: Date | null = null;
  dialogResumoSaidaVisivel = false;
  valorTotal = 0;
  duracao = '';
  valorHora = 10;
  formaPagamento = 'dinheiro';
  vagas: Vaga[] = [];

  constructor(
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private vagaService: VagaService,
    private mensalistaService: MensalistaService,
    private configuracoesService: ConfiguracoesService
  ) {}

  ngOnInit() {
    this.valorHora = this.configuracoesService.obterValorHora();
    this.carregarVagas();
  }

  // -------------------------------
  // Formatação segura de datas
  formatarData(data: Date | null): string {
    if (!data) return '-';
    const d = new Date(data);
    return isNaN(d.getTime()) ? '-' : d.toLocaleString();
  }

  // -------------------------------
  private transformarPlacaParaMaiuscula(): void {
    if (this.vagaCadastro.placa) {
      this.vagaCadastro.placa = this.vagaCadastro.placa.toUpperCase();
    }
  }

  private verificarTipoPorPlaca(placa: string): void {
    if (!placa) return;
    this.mensalistaService.obterTodos().subscribe({
      next: mensalistas => {
        const encontrado = mensalistas.find(
          m => m.placa.replace('-', '').toUpperCase() === placa.replace('-', '').toUpperCase()
        );
        this.vagaCadastro.tipo = encontrado ? 'Mensalista' : 'Diarista';
      },
      error: () => {
        this.vagaCadastro.tipo = 'Diarista';
      }
    });
  }

  atualizarPlaca(): void {
    this.transformarPlacaParaMaiuscula();
    this.verificarTipoPorPlaca(this.vagaCadastro.placa ?? '');
  }

  abrirModalCadastrar(): void {
    this.dialogTituloCadastrar = 'Cadastro de Vaga';
    this.vagaCadastro = new VagaCadastro();
    // **Sempre usa a hora local atual**
    this.vagaCadastro.dataHora = new Date();
    this.dialogVisivelCadastrar = true;
  }

salvar(): void {
  const placa = (this.vagaCadastro.placa ?? '').toUpperCase().trim();
  if (placa.length !== 7) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Placa inválida',
      detail: 'A placa deve conter exatamente 7 caracteres.'
    });
    return;
  }
  this.vagaCadastro.placa = placa;

  // Buscar todas as vagas do banco
  this.vagaService.obterTodos().subscribe({
    next: (vagas: Vaga[]) => {
      // Verifica se já existe alguma vaga ativa com a mesma placa
      const placaEmUso = vagas.find(
        v => v.placa.replace('-', '').toUpperCase() === placa && !v.saida
      );

      if (placaEmUso) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Placa em uso',
          detail: 'Já existe um veículo com essa placa estacionado. Registre a saída antes de cadastrar novamente.'
        });
        return;
      }

      // Garantindo que dataHora sempre tenha valor
      if (!this.vagaCadastro.dataHora) {
        this.vagaCadastro.dataHora = new Date();
      }

      // Verificar se é mensalista
      this.mensalistaService.obterTodos().subscribe({
        next: mensalistas => {
          const mensalistaEncontrado = mensalistas.find(
            m => m.placa.replace('-', '').toUpperCase() === placa
          );
          this.vagaCadastro.tipo = mensalistaEncontrado ? 'Mensalista' : 'Diarista';

          // Cadastrar vaga
          this.vagaService.cadastrar(this.vagaCadastro).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Veículo cadastrado com sucesso'
              });
              this.dialogVisivelCadastrar = false;
              this.carregarVagas();
            },
            error: err => {
              console.error(err);
              this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Não foi possível cadastrar a vaga.'
              });
            }
          });
        },
        error: err => {
          console.error(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Não foi possível validar a placa.'
          });
        }
      });
    },
    error: err => {
      console.error(err);
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Não foi possível buscar vagas no banco.'
      });
    }
  });
}


  // -------------------------------
  confirmaSaida(event: Event, id: number): void {
    this.vagaSelecionada = this.vagas.find(v => v.id === id) ?? null;
    if (!this.vagaSelecionada) return;

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Deseja realmente registrar a Saída?',
      header: 'CUIDADO',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: { label: 'Cancelar', severity: 'secondary', outlined: true },
      acceptButtonProps: { label: 'Saída' },
      accept: () => this.registrarSaidaComResumo()
    });
  }

  private registrarSaidaComResumo(): void {
    if (!this.vagaSelecionada || !this.vagaSelecionada.dataHora) return;

    this.dataHoraSaida = new Date();

    // Cálculo seguro
    const entrada = this.vagaSelecionada.dataHora;
    const diffMs = this.dataHoraSaida.getTime() - entrada.getTime();
    const diffHoras = diffMs / (1000 * 60 * 60);

    this.valorHora = this.configuracoesService.obterValorHora();
    this.valorTotal = Math.ceil(diffHoras) * this.valorHora;

    const minutos = Math.round((diffHoras % 1) * 60);
    this.duracao = `${Math.floor(diffHoras)}h ${minutos}min`;

    this.dialogResumoSaidaVisivel = true;
  }

  finalizarSaida(): void {
    if (!this.vagaSelecionada || !this.dataHoraSaida) return;

    const relatorioSaida: Vaga = {
      ...this.vagaSelecionada,
      saida: this.dataHoraSaida,
      duracao: this.duracao,
      valor: this.valorTotal,
      formaPagamento: this.formaPagamento
    };

    this.vagas = this.vagas.filter(v => v.id !== this.vagaSelecionada?.id);

    this.dialogResumoSaidaVisivel = false;
    this.vagaSelecionada = null;
    this.dataHoraSaida = null;
    this.valorTotal = 0;
    this.duracao = '';
    this.formaPagamento = 'dinheiro';
    this.carregarVagas();

    const relatoriosSalvos = JSON.parse(localStorage.getItem('relatorios') || '[]');
    relatoriosSalvos.push(relatorioSaida);
    localStorage.setItem('relatorios', JSON.stringify(relatoriosSalvos));

    this.messageService.add({
      severity: 'success',
      summary: 'Pagamento concluído',
      detail: 'Veículo liberado e relatório salvo localmente.'
    });
  }

  carregarVagas(): void {
    this.carregandoVagas = true;
    this.vagaService.obterTodos().subscribe({
      next: (vagas: any[]) => {
        // Converte dataHora de string para Date e garante que não seja null
        this.vagas = vagas.map(v => ({
          ...v,
          dataHora: v.dataHora ? new Date(v.dataHora) : new Date()
        }));
        this.carregandoVagas = false;
      },
      error: err => {
        console.error(err);
        this.carregandoVagas = false;
      }
    });
  }
}
