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
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { ChartModule } from 'primeng/chart';
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
    ChartModule,
    FormsModule,
    ButtonModule,
    TableModule,
    ToastModule,
    ConfirmDialogModule,
    TagModule,
    DialogModule,
    DropdownModule,
    CalendarModule,
    InputTextModule
  ],
  providers: [ConfirmationService, MessageService],
})
export class RelatorioComponent implements OnInit {
  carregandoRelatorios = false;

  relatorios: Relatorio[] = [];
  relatoriosFiltrados: Relatorio[] = [];

  // filtros textuais
  filtroPlaca: string = '';
  filtroTipo: string = '';
  filtroPagamento: string = '';

  // filtro por data (dia) ou intervalo
  filtroDia: Date | null = null;
  filtroPeriodo: Date[] | null = null; // [start, end]

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

  // dashboard values
  totalArrecadado = 0;
  totalRegistros = 0;
  tipoMaisComum = '—';

  // dados dos gráficos
  monthlyRevenueData: any;
  entriesByHourData: any;
  proportionData: any;
  chartOptions: any;

  

  constructor(
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private relatorioService: RelatorioService
  ) {
    // opções para charts (modo escuro)
    this.chartOptions = {
      plugins: {
        legend: { labels: { color: '#cbd5e1' } }
      },
      scales: {
        x: { ticks: { color: '#cbd5e1' }, grid: { color: 'rgba(255,255,255,0.04)' } },
        y: { ticks: { color: '#cbd5e1' }, grid: { color: 'rgba(255,255,255,0.04)' } }
      },
      maintainAspectRatio: false,
    };
  }

  ngOnInit() {
    this.carregarRelatorios();
  }

  carregarRelatorios(): void {
    function parseSPDate(dateStr: string | null): Date | null {
  if (!dateStr) return null;
  // cria objeto Date a partir da string do backend (assumindo ISO 8601)
  const d = new Date(dateStr);
  // converte para horário de São Paulo
  const offset = -3; // GMT-3
  const localDate = new Date(d.getTime() + offset * 60 * 60 * 1000);
  return localDate;
}


    this.relatorioService.getRelatorios().subscribe({
      next: (res: any[]) => {
        this.relatorios = res.map((r: any) => ({
          id: r.id,
          placa: r.placa,
          tipo: r.tipo,
         dataHoraEntrada: parseSPDate(r.data_hora_entrada),
         dataHoraSaida: parseSPDate(r.data_hora_saida),

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

        this.recalcularDashboard();
      },
      error: (erro) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Falha ao carregar relatórios'
        });
        console.error('Erro ao carregar relatórios:', erro);
        this.carregandoRelatorios = false;
      }
    });
  }

  calcularDuracao(entrada: string | Date, saida: string | Date): string {
    const inicio = new Date(entrada);
    const fim = new Date(saida);
    const diffMs = fim.getTime() - inicio.getTime();

    const horas = Math.floor(diffMs / (1000 * 60 * 60));
    const minutos = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${horas}h ${minutos}min`;
  }

  filtrarRelatorios() {
    const placaFiltro = this.filtroPlaca?.trim().toLowerCase() || '';
    const tipoFiltro = this.filtroTipo || '';
    const pagamentoFiltro = this.filtroPagamento || '';

    this.relatoriosFiltrados = this.relatorios.filter(r => {
      const placaMatch = !placaFiltro || (r.placa?.toLowerCase() || '').includes(placaFiltro);
      const tipoMatch = !tipoFiltro || (r.tipo || '').toLowerCase() === (tipoFiltro || '').toLowerCase();
      const pagamentoMatch = !pagamentoFiltro || (r.formaPagamento || '').toLowerCase() === (pagamentoFiltro || '').toLowerCase();

      let diaMatch = true;
      if (this.filtroDia) {
        const fd = new Date(this.filtroDia);
        const entrada = r.dataHoraEntrada ? new Date(r.dataHoraEntrada) : null;
        diaMatch = entrada
          ? (entrada.getFullYear() === fd.getFullYear() && entrada.getMonth() === fd.getMonth() && entrada.getDate() === fd.getDate())
          : false;
      }

      let periodoMatch = true;
      if (this.filtroPeriodo && this.filtroPeriodo.length === 2 && this.filtroPeriodo[0] && this.filtroPeriodo[1]) {
        const start = new Date(this.filtroPeriodo[0]);
        const end = new Date(this.filtroPeriodo[1]);
        start.setHours(0,0,0,0);
        end.setHours(23,59,59,999);
        const entrada = r.dataHoraEntrada ? new Date(r.dataHoraEntrada) : null;
        periodoMatch = entrada ? (entrada >= start && entrada <= end) : false;
      }

      return placaMatch && tipoMatch && pagamentoMatch && diaMatch && periodoMatch;
    });

    this.recalcularDashboard();
  }

  limparFiltros() {
    this.filtroPlaca = '';
    this.filtroTipo = '';
    this.filtroPagamento = '';
    this.filtroDia = null;
    this.filtroPeriodo = null;
    this.relatoriosFiltrados = [...this.relatorios];
    this.recalcularDashboard();
  }

  recalcularDashboard() {
    const filas = this.relatoriosFiltrados || [];

    this.totalArrecadado = filas.reduce((acc, r) => acc + (r.valorPago || 0), 0);
    this.totalRegistros = filas.length;

    const tipoCount: Record<string, number> = {};
    filas.forEach(r => tipoCount[r.tipo || 'Outros'] = (tipoCount[r.tipo || 'Outros'] || 0) + 1);
    const sortedTipos = Object.entries(tipoCount).sort((a,b) => b[1]-a[1]);
    this.tipoMaisComum = sortedTipos.length ? sortedTipos[0][0] : '—';

    this.buildMonthlyRevenueChart(filas);
    this.buildEntriesByHourChart(filas);
    this.buildProportionChart(filas);
  }

  private buildMonthlyRevenueChart(rows: Relatorio[]) {
    const map: Record<string, number> = {};
    rows.forEach(r => {
      if (!r.dataHoraEntrada) return;
      const d = new Date(r.dataHoraEntrada);
      const key = `${d.getFullYear()}-${('0'+(d.getMonth()+1)).slice(-2)}`;
      map[key] = (map[key] || 0) + (r.valorPago || 0);
    });

    const labels = Object.keys(map).sort();
    const data = labels.map(l => map[l]);

    this.monthlyRevenueData = {
      labels,
      datasets: [
        { label: 'Faturamento (R$)', data, fill: true }
      ]
    };
  }

  private buildEntriesByHourChart(rows: Relatorio[]) {
    const hours = new Array<number>(24).fill(0);
    rows.forEach(r => {
      if (!r.dataHoraEntrada) return;
      const d = new Date(r.dataHoraEntrada);
      const h = d.getHours();
      hours[h] = (hours[h] || 0) + 1;
    });

    this.entriesByHourData = {
      labels: hours.map((_, i) => `${i}:00`),
      datasets: [{ label: 'Entradas por Hora', data: hours, fill: false }]
    };
  }

  private buildProportionChart(rows: Relatorio[]) {
    let mensalista = 0, diarista = 0, outros = 0;
    rows.forEach(r => {
      if (!r.tipo) { outros++; return; }
      const t = (r.tipo || '').toLowerCase();
      if (t.includes('mensal')) mensalista++;
      else if (t.includes('diar')) diarista++;
      else outros++;
    });

    this.proportionData = {
      labels: ['Mensalista', 'Diarista', 'Outros'],
      datasets: [{ data: [mensalista, diarista, outros] }]
    };
  }

  exportarPDF() {
    const doc = new jsPDF();
    doc.text('Relatório de Pagamentos', 14, 16);

    const colunas = ['ID','Placa','Tipo','Entrada','Saída','Valor','Forma Pagamento','Status'];
    const dados = this.relatoriosFiltrados.map(r => [
      r.id,
      r.placa,
      r.tipo,
      r.dataHoraEntrada ? r.dataHoraEntrada.toLocaleString('pt-BR',{ timeZone:'America/Sao_Paulo' }) : '-',
      r.dataHoraSaida ? r.dataHoraSaida.toLocaleString('pt-BR',{ timeZone:'America/Sao_Paulo' }) : '-',
      (r.valorPago || 0).toLocaleString('pt-BR',{ style:'currency', currency:'BRL' }),
      r.formaPagamento,
      r.statusPagamento
    ]);

    autoTable(doc, {
      head: [colunas],
      body: dados,
      startY: 20,
      styles: { fontSize: 8, textColor: '#e6eef8' },
      theme: 'striped',
      headStyles: { fillColor: [24, 30, 36] }
    });

    doc.save('relatorio_pagamentos.pdf');
  }

  exportarExcel() {
    const dadosExcel = this.relatoriosFiltrados.map(r => ({
      ID: r.id,
      Placa: r.placa,
      Tipo: r.tipo,
      Entrada: r.dataHoraEntrada ? r.dataHoraEntrada.toLocaleString('pt-BR',{ timeZone:'America/Sao_Paulo' }) : '-',
      Saída: r.dataHoraSaida ? r.dataHoraSaida.toLocaleString('pt-BR',{ timeZone:'America/Sao_Paulo' }) : '-',
      Valor: (r.valorPago || 0).toLocaleString('pt-BR',{ style:'currency', currency:'BRL' }),
      FormaPagamento: r.formaPagamento,
      Status: r.statusPagamento
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
