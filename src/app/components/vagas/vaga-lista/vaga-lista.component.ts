import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Vaga } from '../../../models/vaga';
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
import { RelatorioService } from '../../../services/relatorio.service';
import { Relatorio } from '../../../models/relatorio';
import { MensalistaService } from '../../../services/mensalista.service';
import { Mensalista } from '../../../models/mensalista';
import { ConfiguracoesService } from '../../../services/configuracoes.service';

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


  ],
  providers: [ConfirmationService, MessageService, MensalistaService,],
  templateUrl: './vaga-lista.component.html',
  styleUrls: ['./vaga-lista.component.scss']
})
export class VagaListaComponent implements OnInit {
  carregandoVagas?: boolean;
  vagaCadastro: VagaCadastro;
  dialogVisivelCadastrar: boolean = false;
  dialogTituloCadastrar?: string;
  dataHora?: Date;
  vagaSelecionada?: Vaga;
  dataHoraSaida?: Date;
  dialogResumoSaidaVisivel = false;
  valorTotal = 0;
  duracao = '';
  valorHora: number = 10;
  formaPagamento: string = 'dinheiro';



  vagas: Array<Vaga> = [];

  constructor(
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private vagaService: VagaService,
    private relatorioService: RelatorioService,
    private mensalistaService: MensalistaService,
    private configuracoesService: ConfiguracoesService,

  ) {
    this.vagaCadastro = new VagaCadastro();
  }

  ngOnInit() {
    this.carregarVagas();

    this.valorHora = this.configuracoesService.obterValorHora();

  }



  private carregarVagas() {
    this.carregandoVagas = true;
    this.vagaService.obterTodos().subscribe({
      next: vagas => {
        this.vagas = vagas.map(v => ({
          ...v,
          dataHora: new Date(v.dataHora)
        }));
      },
      error: erro => {
        console.error("Erro ao carregar vagas:", erro);
        this.carregandoVagas = false;
      },
      complete: () => this.carregandoVagas = false
    });
  }

  abrirModalCadastrar() {
    this.dialogTituloCadastrar = "Cadastro de Vaga";
    this.vagaCadastro = new VagaCadastro();
    this.vagaCadastro.dataHora = new Date();
    this.dialogVisivelCadastrar = true;
  }

  confirmaSaida(event: Event, id: number) {
    this.vagaSelecionada = this.vagas.find(v => v.id === id);
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Deseja realmente registrar a Saída?',
      header: 'CUIDADO',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Saída',
      },
      accept: () => this.registrarSaidaComResumo(),
    });
  }

  private registrarSaidaComResumo() {
    if (!this.vagaSelecionada) return;

    this.dataHoraSaida = new Date();
    const entrada = this.vagaSelecionada.dataHora;
    const saida = this.dataHoraSaida;
    const diffMs = saida.getTime() - entrada.getTime();
    const diffHoras = diffMs / (1000 * 60 * 60);
    this.valorHora = this.configuracoesService.obterValorHora();



    this.valorTotal = Math.ceil(diffHoras) * this.valorHora;
    const minutos = Math.round((diffHoras % 1) * 60);
    this.duracao = `${Math.floor(diffHoras)}h ${minutos}min`;


    this.dialogResumoSaidaVisivel = true;
  }

  private confirmaPagamento() {
    if (!this.vagaSelecionada) return;

    this.messageService.add({
      severity: 'success',
      summary: 'Pagamento Confirmado',
      detail: `Pagamento de R$${this.valorTotal.toFixed(2)} realizado.`
    });

    this.dialogResumoSaidaVisivel = false;
    this.vagaSelecionada = undefined;
    this.carregarVagas();
  }


  private saida(vagaId: number) {
    this.vagaService.saida(vagaId).subscribe({
      next: () => this.apresentarMensagemSaida(),
      error: erro => console.error(`Erro ao registrar saída: ${erro}`),
    });
    this.vagas = this.vagas.filter(v => v.id !== vagaId);

  }

  private apresentarMensagemSaida() {
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Veículo saiu com sucesso',
    });
    this.carregarVagas();
  }

  private validarPlaca(placa: string): boolean {
    const regexPlaca = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/;
    return regexPlaca.test(placa);
  }

  salvar() {
    const placaOriginal = this.vagaCadastro.placa ?? '';
    const placa = placaOriginal.toUpperCase().trim();

    if (placa.length !== 7 || !this.validarPlaca(placa)) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Placa inválida',
        detail: 'A placa deve conter exatamente 7 caracteres e estar no formato: ABC1D23.',
      });
      return;
    }

    this.vagaCadastro.placa = placa;

    // Verifica se é mensalista
    this.mensalistaService.obterTodos().subscribe({
      next: mensalistas => {
        const mensalistaEncontrado = mensalistas.find(
          m => m.placa.replace('-', '').toUpperCase() === placa
        );

        this.vagaCadastro.tipo = mensalistaEncontrado ? 'Mensalista' : 'Diarista';

        if (mensalistaEncontrado && mensalistaEncontrado.validade) {
          const hoje = new Date();
          const validade = new Date(mensalistaEncontrado.validade);
          const diasRestantes = Math.ceil((validade.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));

          if (validade < hoje) {
            this.messageService.add({
              severity: 'error',
              summary: 'Validade vencida',
              detail: 'Este mensalista está com a validade vencida!',
            });
          } else if (diasRestantes <= 5) {
            this.messageService.add({
              severity: 'warn',
              summary: 'Validade prestes a vencer',
              detail: `Faltam apenas ${diasRestantes} dia(s) para a validade expirar.`,
            });
          }
        }

        // Continua com o cadastro da vaga
        this.vagas.push({ ...this.vagaCadastro });
        this.apresentarmensagemCadastrado();
        this.dialogVisivelCadastrar = false;
        this.vagaCadastro = new VagaCadastro();
      },
      error: erro => {
        console.error('Erro ao buscar mensalistas:', erro);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Falha ao verificar se a placa é de mensalista.'
        });
      }
    });
  }


  apresentarmensagemCadastrado() {
    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Veículo cadastrado com sucesso' });
    this.dialogVisivelCadastrar = false;
    this.vagaCadastro = new VagaCadastro();
    this.carregarVagas();
  }
  transformarPlacaParaMaiuscula(): void {
    this.vagaCadastro.placa = this.vagaCadastro.placa.toUpperCase();
    const mensalistas = JSON.parse(localStorage.getItem('mensalistas') || '[]');
    const placaDigitada = this.vagaCadastro.placa.replaceAll('-', '').toLowerCase();
   const encontrado = mensalistas.find((m: any) => m.placa?.replace('-', '').toLowerCase() === placaDigitada);

    this.vagaCadastro.tipo = encontrado ? 'Mensalista' : 'Diarista';
  }


  finalizarSaida() {
    if (!this.vagaSelecionada || !this.dataHoraSaida) return;

    const registroSaida = {
      placa: this.vagaSelecionada.placa,
      tipo: this.vagaSelecionada.tipo,
      entrada: this.vagaSelecionada.dataHora,
      saida: this.dataHoraSaida,
      duracao: this.duracao,
      valor: this.valorTotal,
      formaPagamento: this.formaPagamento,
    };

    const relatorioSaida = {
      placa: this.vagaSelecionada.placa,
      tipo: this.vagaSelecionada.tipo,
      dataHoraEntrada: this.vagaSelecionada.dataHora,
      dataHoraSaida: this.dataHoraSaida,
      valorPago: this.valorTotal,
      formaPagamento: this.formaPagamento,
      statusPagamento: 'Pago',
    };

    console.log('Saída registrada:', registroSaida);

    this.messageService.add({
      severity: 'success',
      summary: 'Pagamento concluído',
      detail: `Veículo ${this.vagaSelecionada.placa} liberado com sucesso.`,
    });
    this.vagas = this.vagas.filter(v => v.id !== this.vagaSelecionada!.id);
    this.dialogResumoSaidaVisivel = false;
    this.vagaSelecionada = undefined;
    this.dataHoraSaida = undefined;
    this.valorTotal = 0;
    this.duracao = '';
    this.formaPagamento = 'dinheiro';
    this.carregarVagas();

    // ✅ Salvar localmente o relatório (em vez de chamar o backend)
    const relatoriosSalvos = JSON.parse(localStorage.getItem('relatorios') || '[]');
    relatoriosSalvos.push(relatorioSaida);
    localStorage.setItem('relatorios', JSON.stringify(relatoriosSalvos));

    this.messageService.add({
      severity: 'success',
      summary: 'Relatório salvo localmente',
      detail: 'Salvo no navegador (localStorage).'
    });
  }

  verificarTipoPorPlaca(placa: string) {
    this.mensalistaService.obterTodos().subscribe({
      next: (mensalistas) => {
        const encontrado = mensalistas.find(m => m.placa.toUpperCase() === placa.toUpperCase());
        this.vagaCadastro.tipo = encontrado ? 'Mensalista' : 'Diarista';
      },
      error: err => {
        console.error('Erro ao verificar placa de mensalista', err);
        this.vagaCadastro.tipo = 'Diarista';
      }
    });
  }

}
