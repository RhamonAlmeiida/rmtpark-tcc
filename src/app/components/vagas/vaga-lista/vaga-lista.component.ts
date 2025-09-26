import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { VagaService } from '../../../services/vaga.service';
import { MensalistaService } from '../../../services/mensalista.service';
import { ConfiguracoesService } from '../../../services/configuracoes.service';
import { VagaCadastro } from '../../../models/vaga-cadastro';
import { Vaga } from '../../../models/vaga';
import { VagaSaida } from '../../../services/vagaSaida';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';

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
  providers: [ConfirmationService, MessageService, MensalistaService],
  templateUrl: './vaga-lista.component.html',
  styleUrls: ['./vaga-lista.component.scss']
})
export class VagaListaComponent implements OnInit {
  carregandoVagas = false;

  vagas: Vaga[] = [];                   // para listar e finalizar
  vagaCadastro: VagaCadastro = new VagaCadastro(); // para entrada
  vagaSelecionada: Vaga | null = null;  // para saída

  // Modais
  dialogVisivelCadastrar = false;
  dialogResumoSaidaVisivel = false;
  dialogTituloCadastrar?: string;

  // Dados da saída
  dataHoraSaida: Date | null = null;
  duracao = '';
  valorTotal = 0;
  valorHora = 10;
  formaPagamento = 'dinheiro';

  constructor(
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private vagaService: VagaService,
    private mensalistaService: MensalistaService,
    private configuracoesService: ConfiguracoesService
  ) {}

  ngOnInit(): void {
    this.valorHora = this.configuracoesService.obterValorHora();
    this.carregarVagas();
  }

  // ======================
  // FORMATAÇÃO DE DATAS
  // ======================
  formatarData(data: Date | null): string {
    if (!data) return '-';
    return isNaN(data.getTime()) ? '-' : data.toLocaleString();
  }

  private formatarDataParaMySQL(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} `
         + `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }

  // ======================
  // CADASTRO DE VAGA
  // ======================
  abrirModalCadastrar(): void {
    this.dialogTituloCadastrar = 'Cadastro de Vaga';
    this.vagaCadastro = new VagaCadastro();
    this.dialogVisivelCadastrar = true;
  }

  atualizarPlaca(): void {
    if (this.vagaCadastro.placa)
      this.vagaCadastro.placa = this.vagaCadastro.placa.toUpperCase();
    this.verificarTipoPorPlaca(this.vagaCadastro.placa ?? '');
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
      error: () => this.vagaCadastro.tipo = 'Diarista'
    });
  }

  salvar(): void {
    const placa = (this.vagaCadastro.placa ?? '').toUpperCase().trim();
    if (placa.length !== 7) {
      this.messageService.add({ severity: 'warn', summary: 'Placa inválida', detail: 'A placa deve conter exatamente 7 caracteres.' });
      return;
    }
    this.vagaCadastro.placa = placa;

    // define dataHora no formato MySQL ANTES de salvar
    this.vagaCadastro.dataHora = new Date(); // 👈 agora é Date, não string


    this.vagaService.obterTodos().subscribe({
      next: vagas => {
        const placaEmUso = vagas.find((v: Vaga) =>
          v.placa.replace('-', '').toUpperCase() === placa && !v.dataHoraSaida
        );
        if (placaEmUso) {
          this.messageService.add({ severity: 'warn', summary: 'Placa em uso', detail: 'Já existe um veículo com essa placa estacionado.' });
          return;
        }

        this.mensalistaService.obterTodos().subscribe({
          next: mensalistas => {
            const mensalistaEncontrado = mensalistas.find(m => m.placa.replace('-', '').toUpperCase() === placa);
            this.vagaCadastro.tipo = mensalistaEncontrado ? 'Mensalista' : 'Diarista';

            this.vagaService.cadastrar(this.vagaCadastro).subscribe({
              next: () => {
                this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Veículo cadastrado com sucesso' });
                this.dialogVisivelCadastrar = false;
                this.carregarVagas();
              },
              error: err => {
                console.error(err);
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível cadastrar a vaga.' });
              }
            });
          }
        });
      }
    });
  }

  // ======================
  // SAÍDA DE VAGA
  // ======================
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

    const diffMs = this.dataHoraSaida.getTime() - this.vagaSelecionada.dataHora.getTime();
    const diffHoras = diffMs / (1000 * 60 * 60);

    this.valorHora = this.configuracoesService.obterValorHora();
    this.valorTotal = Math.ceil(diffHoras) * this.valorHora;

    const minutos = Math.round((diffHoras % 1) * 60);
    this.duracao = `${Math.floor(diffHoras)}h ${minutos}min`;

    this.dialogResumoSaidaVisivel = true;
  }

  finalizarSaida(): void {
    if (!this.vagaSelecionada) return;

    const now = new Date();
    const dados: VagaSaida = {
      saida: this.formatarDataParaMySQL(now),
      duracao: this.duracao,
      valor: this.valorTotal,
      formaPagamento: this.formaPagamento
    };

    this.vagaService.registrarSaida(this.vagaSelecionada.id, dados).subscribe({
      next: vaga => {
        this.messageService.add({ severity: 'success', summary: 'Saída registrada', detail: `Saída do veículo ${vaga.placa} registrada com sucesso` });
        this.dialogResumoSaidaVisivel = false;

        // Atualiza localmente
        this.vagaSelecionada!.dataHoraSaida = now;
        this.vagaSelecionada!.duracao = this.duracao;
        this.vagaSelecionada!.valor_pago = this.valorTotal;
        this.vagas = this.vagas.filter(v => v.id !== this.vagaSelecionada!.id);
        this.vagaSelecionada = null;
      },
      error: err => {
        console.error(err);
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível registrar a saída.' });
      }
    });
  }

  // ======================
  // CARREGAMENTO DE VAGAS
  // ======================
  carregarVagas(): void {
    this.carregandoVagas = true;
    this.vagaService.obterTodos().subscribe({
      next: (vagas: any[]) => {
        this.vagas = vagas.map(v => ({
          id: v.id,
          placa: v.placa,
          tipo: v.tipo,
          dataHora: v.data_hora ? new Date(v.data_hora) : null,
dataHoraSaida: v.data_hora_saida ? new Date(v.data_hora_saida) : null,

          duracao: v.duracao,
          valor_pago: v.valor, // se o backend mudar p/ valor_pago, ajustar aqui
          formaPagamento: v.forma_pagamento,
          status_pagamento: v.status_pagamento
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
