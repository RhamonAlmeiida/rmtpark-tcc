import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { MensalistaCadastro } from '../../models/mensalista-cadastro';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Dialog, DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { Mensalista } from '../../models/mensalista';
import { MensalistaService } from '../../services/mensalista.service';
import { Router } from '@angular/router';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-mensalistas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TableModule,
    ToastModule,
    ConfirmDialogModule,
    DialogModule,
    TagModule,
    InputTextModule,
    CalendarModule
  ]
  ,

  templateUrl: './mensalistas.component.html',
  styleUrls: ['./mensalistas.component.scss'],
  providers: [MessageService, ConfirmationService,]
})
export class MensalistasComponent implements OnInit {
  carregandoMensalista?: boolean;
  dialogVisivelCadastrarMensalista: boolean = false;
  dialogTituloCadastrarMensalista?: string;
  visible: boolean = false;
  mensalistas: Mensalista[] = [];
  mensalistaCadastro: MensalistaCadastro = new MensalistaCadastro();
  mensalistaSelecionado?: Mensalista;

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private mensalistaService: MensalistaService,
  ) {
    this.mensalistaCadastro = new MensalistaCadastro()
  }



  ngOnInit() {
    this.carregarMensalistas();
  }

  private carregarMensalistas() {
    this.carregandoMensalista = true;
    this.mensalistaService.obterTodos().subscribe({
      next: (mensalistas) => {
        this.mensalistas = mensalistas;
        this.carregandoMensalista = false;
      },
      error: erro => {
        console.error(`Erro ao carregar mensalistas: ${erro}`);
        this.carregandoMensalista = false;
      }
    });
  }


  abrirModalCadastrarMensalista() {
    this.dialogTituloCadastrarMensalista = "Cadastro de Mensalista";
    this.mensalistaCadastro = new MensalistaCadastro();
    this.dialogVisivelCadastrarMensalista = true;
  }

  confirmaApagado(event: Event, id: number) {
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
      accept: () => this.apagar(id),
    });
  }

  private apagar(mensalistaId: number) {
    this.mensalistaService.apagar(mensalistaId).subscribe({
      next: () => this.apresentarmensagemApagado(),
      error: erro => console.error(`Erro ao apagar mensalista: ${erro}`),
    });
  }

  private apresentarmensagemApagado() {
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Mensalista apagado com sucesso',
    });
    this.carregarMensalistas();
  }

  cadastrar() {
    this.mensalistaService.cadastrar(this.mensalistaCadastro).subscribe({
      next: mensalista => this.apresentarmensagemCadastrado(),
      error: erro => console.log(" Ocorreu um erro ao cadastar mensalista:" + erro),
    });
  }



  apresentarmensagemCadastrado() {
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Mensalista cadastrado com sucesso'
    });

  }



  salvar() {
    const hoje = new Date();
    const validadeStr = this.mensalistaCadastro.validade;
    const validade = validadeStr ? new Date(validadeStr) : hoje;

    const diasRestantes = Math.ceil((validade.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
    const status: 'ativo' | 'inadimplente' | 'vencendo' =
      validade < hoje ? 'inadimplente' :
        diasRestantes <= 5 ? 'vencendo' : 'ativo';

    const novoMensalista: Mensalista = {
      id: this.mensalistas.length
        ? Math.max(...this.mensalistas.map(m => m.id ?? 0)) + 1
        : 1,
      nome: this.mensalistaCadastro.nome,
      placa: this.mensalistaCadastro.placa,
      veiculo: this.mensalistaCadastro.veiculo,
      cor: this.mensalistaCadastro.cor,
      cpf: this.mensalistaCadastro.cpf,
      validade: validade.toISOString().split('T')[0],
      status: status,
    };

    this.mensalistas.push(novoMensalista);
    localStorage.setItem('mensalistas', JSON.stringify(this.mensalistas));

    this.apresentarmensagemCadastrado();

    if (status === 'vencendo') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: `Validade vence em ${diasRestantes} dia(s)!`,
      });
    }


    this.dialogVisivelCadastrarMensalista = false;
    this.mensalistaCadastro = new MensalistaCadastro();

    this.carregarMensalistas();
  }



  transformarPlacaParaMaiuscula(): void {
    if (this.mensalistaCadastro.placa) {
      this.mensalistaCadastro.placa = this.mensalistaCadastro.placa.toUpperCase();
    }
  }

  renovarValidade(mensalista: Mensalista) {
    const novaValidade = new Date();
    novaValidade.setMonth(novaValidade.getMonth() + 1);

    mensalista.validade = novaValidade.toISOString().split('T')[0];

    const hoje = new Date();
    const diasRestantes = Math.ceil((novaValidade.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
    mensalista.status =
      novaValidade < hoje ? 'inadimplente' :
        diasRestantes <= 5 ? 'vencendo' : 'ativo';

    localStorage.setItem('mensalistas', JSON.stringify(this.mensalistas));
    this.messageService.add({ severity: 'success', summary: 'Renovado', detail: 'Validade atualizada' });
  }

  cancelarAssinatura(event: Event, id: number) {
    this.mensalistaSelecionado = this.mensalistas.find(v => v.id === id);

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Deseja realmente cancelar o plano mensalista?',
      header: 'CUIDADO',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Cancelar Assinatura',
      rejectLabel: 'Fechar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        if (id != null) {
          this.apagar(id);
        }
      }
    });
  }
}