import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { SelectModule } from 'primeng/select';
import { Relatorio } from '../../models/relatorio';
import { Router } from '@angular/router';
import { RelatorioService } from '../../services/relatorio.service';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-relatorio-pagamentos',
  templateUrl: './relatorios.component.html',
  styleUrls: ['./relatorios.component.scss'],
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
})
export class RelatorioComponent implements OnInit {
  carregandoRelatorios = false;

  relatorios: Relatorio[] = [];
  relatoriosFiltrados: Relatorio[] = [];

  filtroPlaca: string = '';
  filtroTipo: string = '';
  filtroPagamento: string = '';

  tiposFiltro = [
    { label: 'Todos', value: '' },
    { label: 'Mensalista', value: 'Mensalista' },
    { label: 'Diarista', value: 'Diarista' },
  ];

  formasPagamentoFiltro = [
    { label: 'Todos', value: '' },
    { label: 'Dinheiro', value: 'Dinheiro' },
    { label: 'PIX', value: 'PIX' },
    { label: 'Cartão', value: 'Cartão' },
  ];

  constructor(
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private relatorioService: RelatorioService
  ) {}

  ngOnInit() {
    this.carregarRelatorios();
  }

carregarRelatorios(): void {
  this.carregandoRelatorios = true;

  this.relatorioService.getRelatorios().subscribe({
    next: (res: any[]) => {
      this.relatorios = res.map((r: any) => ({
        id: r.id,
        placa: r.placa,
        tipo: r.tipo,
        dataHoraEntrada: r.data_hora_entrada ? new Date(r.data_hora_entrada) : null,
        dataHoraSaida: r.data_hora_saida ? new Date(r.data_hora_saida) : null,
        duracao: r.duracao 
          ? r.duracao 
          : (r.data_hora_entrada && r.data_hora_saida 
              ? this.calcularDuracao(r.data_hora_entrada, r.data_hora_saida) 
              : ''),
        tempoPermanencia: r.tempo_permanencia ?? '',
        valorPago: r.valor_pago ?? 0,
        formaPagamento: r.forma_pagamento ?? '',
        statusPagamento: r.status_pagamento ?? ''
      }));

      this.relatoriosFiltrados = [...this.relatorios];
      this.carregandoRelatorios = false;
    },
    error: (erro) => {
      console.error('Erro ao carregar relatórios:', erro);
      this.carregandoRelatorios = false;
    }
  });
}


  calcularDuracao(entrada: string, saida: string): string {
  const inicio = new Date(entrada);
  const fim = new Date(saida);
  const diffMs = fim.getTime() - inicio.getTime();

  const horas = Math.floor(diffMs / (1000 * 60 * 60));
  const minutos = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  return `${horas}h ${minutos}min`;
}


  filtrarRelatorios() {
    this.relatoriosFiltrados = this.relatorios.filter((r) => {
      const placaMatch = !this.filtroPlaca || (r.placa?.toLowerCase() || '').includes(this.filtroPlaca.toLowerCase());
      const tipoMatch = !this.filtroTipo || (r.tipo?.toLowerCase() || '') === this.filtroTipo.toLowerCase();
      const pagamentoMatch = !this.filtroPagamento || (r.formaPagamento?.toLowerCase() || '') === this.filtroPagamento.toLowerCase();
      return placaMatch && tipoMatch && pagamentoMatch;
    });
  }

  limparFiltros() {
    this.filtroPlaca = '';
    this.filtroTipo = '';
    this.filtroPagamento = '';
    this.relatoriosFiltrados = [...this.relatorios];
  }

  exportarPDF() {
    const doc = new jsPDF();
    doc.text('Relatório de Pagamentos', 14, 16);

    const colunas = [
      'ID',
      'Placa',
      'Tipo',
      'Entrada',
      'Saída',
      'Valor',
      'Forma Pagamento',
      'Status',
    ];

    const dados = this.relatoriosFiltrados.map(r => [
      r.id,
      r.placa,
      r.tipo,
      r.dataHoraEntrada ? r.dataHoraEntrada.toLocaleString() : '-',
      r.dataHoraSaida ? r.dataHoraSaida.toLocaleString() : '-',
      r.valorPago.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      r.formaPagamento,
      r.statusPagamento
    ]);

    autoTable(doc, {
      head: [colunas],
      body: dados,
      startY: 20,
      styles: { fontSize: 8 }
    });

    doc.save('relatorio_pagamentos.pdf');
  }

  exportarExcel() {
    const dadosExcel = this.relatoriosFiltrados.map(r => ({
      ID: r.id,
      Placa: r.placa,
      Tipo: r.tipo,
      Entrada: r.dataHoraEntrada ? r.dataHoraEntrada.toLocaleString() : '-',
      Saída: r.dataHoraSaida ? r.dataHoraSaida.toLocaleString() : '-',
      Valor: r.valorPago.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      FormaPagamento: r.formaPagamento,
      Status: r.statusPagamento,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dadosExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Relatório');
    XLSX.writeFile(workbook, 'relatorio_pagamentos.xlsx');
  }

  imprimir() {
    window.print();
  }
}
