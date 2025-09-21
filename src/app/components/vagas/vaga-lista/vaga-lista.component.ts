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
import { VagaCadastro } from '../../../models/vaga-cadastro';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { MensalistaService } from '../../../services/mensalista.service';
import { ConfiguracoesService } from '../../../services/configuracoes.service';
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
  vagaSelecionada?: Vaga;
  dataHoraSaida?: Date;
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
    this.carregarVagas();
    this.valorHora = this.configuracoesService.obterValorHora();
  }

  // ---------------- MÉTODOS PARA O TEMPLATE ----------------
  public transformarPlacaParaMaiuscula(): void {
    if (!this.vagaCadastro.placa) return;
    this.vagaCadastro.placa = this.vagaCadastro.placa.toUpperCase();
  }

  public verificarTipoPorPlaca(placa: string): void {
    if (!placa) return;
    this.mensalistaService.obterTodos().subscribe({
      next: mensalistas => {
        const encontrado = mensalistas.find(
          m => m.placa.replace('-', '').toUpperCase() === placa.replace('-', '').toUpperCase()
        );
        this.vagaCadastro.tipo = encontrado ? 'Mensalista' : 'Diarista';
      },
      error: err => {
        console.error('Erro ao verificar placa de mensalista', err);
        this.vagaCadastro.tipo = 'Diarista';
      }
    });
  }

  public atualizarPlaca(): void {
    this.transformarPlacaParaMaiuscula();
    this.verificarTipoPorPlaca(this.vagaCadastro.placa);
  }

  // ---------------- MÉTODOS DE VAGA ----------------
  public abrirModalCadastrar(): void {
    this.dialogTituloCadastrar = 'Cadastro de Vaga';
    this.vagaCadastro = new VagaCadastro();
    this.vagaCadastro.dataHora = new Date();
    this.dialogVisivelCadastrar = true;
  }

  public salvar(): void {
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

    this.mensalistaService.obterTodos().subscribe({
      next: mensalistas => {
        const mensalistaEncontrado = mensalistas.find(
          m => m.placa.replace('-', '').toUpperCase() === placa
        );
        const tipo = mensalistaEncontrado ? 'Mensalista' : 'Diarista';

        const novaVaga: Vaga = {
          id: this.vagas.length + 1,
          placa: this.vagaCadastro.placa,
          tipo: tipo,
          dataHora: this.vagaCadastro.dataHora
        };

        this.vagas.push(novaVaga);
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Veículo cadastrado com sucesso'
        });

        this.dialogVisivelCadastrar = false;
        this.vagaCadastro = new VagaCadastro();
        this.carregarVagas();
      },
      error: erro => console.error('Erro ao buscar mensalistas:', erro)
    });
  }

  public confirmaSaida(event: Event, id: number): void {
    this.vagaSelecionada = this.vagas.find(v => v.id === id);
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

  public registrarSaidaComResumo(): void {
    if (!this.vagaSelecionada) return;

    this.dataHoraSaida = new Date();
    const entrada = this.vagaSelecionada.dataHora;
    const diffHoras = (this.dataHoraSaida.getTime() - entrada.getTime()) / (1000 * 60 * 60);

    this.valorHora = this.configuracoesService.obterValorHora();
    this.valorTotal = Math.ceil(diffHoras) * this.valorHora;
    const minutos = Math.round((diffHoras % 1) * 60);
    this.duracao = `${Math.floor(diffHoras)}h ${minutos}min`;

    this.dialogResumoSaidaVisivel = true;
  }

  public finalizarSaida(): void {
    if (!this.vagaSelecionada || !this.dataHoraSaida) return;

    const relatorioSaida: Vaga = {
      id: this.vagaSelecionada.id,
      placa: this.vagaSelecionada.placa,
      tipo: this.vagaSelecionada.tipo,
      dataHora: this.vagaSelecionada.dataHora,
      saida: this.dataHoraSaida,
      duracao: this.duracao,
      valor: this.valorTotal,
      formaPagamento: this.formaPagamento
    };

    if (this.vagaSelecionada) {
      this.vagas = this.vagas.filter(v => v.id !== this.vagaSelecionada!.id);
    }

    this.dialogResumoSaidaVisivel = false;
    this.vagaSelecionada = undefined;
    this.dataHoraSaida = undefined;
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
  public carregarVagas() {
  this.carregandoVagas = true;
  this.vagaService.obterTodos().subscribe({
    next: vagas => {
      this.vagas = vagas.map(v => ({ ...v, dataHora: new Date(v.dataHora) }));
      this.carregandoVagas = false;
    },
    error: erro => {
      console.error(erro);
      this.carregandoVagas = false;
    }
  });
}

}
