import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { RelatorioService } from '../../services/relatorio.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-grafico',
  standalone: true,
  imports: [CommonModule, ChartModule, ToastModule, ButtonModule],
  providers: [MessageService],
  templateUrl: './grafico.component.html',
  styleUrls: ['./grafico.component.scss']
})
export class GraficoComponent implements OnInit {

  relatorios: any[] = [];
  relatoriosFiltrados: any[] = [];

  // Filtros (sem ngModel)
  placaFiltro = '';
  tipoFiltro = '';
  pagamentoFiltro = '';
  dataInicioFiltro: Date | null = null;
  dataFimFiltro: Date | null = null;

  // Indicadores
  totalArrecadado = 0;
  totalRegistros = 0;
  tipoMaisComum = '—';
  carregandoRelatorios = false;

  // Gráficos
  monthlyRevenueData: any;
  entriesByHourData: any;
  proportionData: any;
  chartOptions: any;

  constructor(
    private relatorioService: RelatorioService,
    private messageService: MessageService
  ) {
    this.chartOptions = {
      plugins: {
        legend: { labels: { color: '#cbd5e1' } }
      },
      scales: {
        x: { ticks: { color: '#cbd5e1' }, grid: { color: 'rgba(255,255,255,0.05)' } },
        y: { ticks: { color: '#cbd5e1' }, grid: { color: 'rgba(255,255,255,0.05)' } }
      },
      maintainAspectRatio: false,
    };
  }

  ngOnInit(): void {
    this.carregarRelatorios();
  }

  carregarRelatorios(): void {
    this.carregandoRelatorios = true;
    this.relatorioService.getRelatorios().subscribe({
      next: (res: any[]) => {
        this.relatorios = res.map(r => ({
          id: r.id,
          placa: r.placa,
          tipo: r.tipo,
          data_hora_entrada: r.data_hora_entrada,
          data_hora_saida: r.data_hora_saida,
          valor_pago: Number(r.valor_pago) || 0, // ✅ garante número
          forma_pagamento: r.forma_pagamento ?? '',
          status_pagamento: r.status_pagamento ?? ''
        }));
        this.relatoriosFiltrados = [...this.relatorios];
        this.recalcularDashboard(this.relatoriosFiltrados);
        this.carregandoRelatorios = false;
      },
      error: (err) => {
        this.carregandoRelatorios = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Falha ao carregar relatórios'
        });
        console.error('Erro ao carregar relatórios:', err);
      }
    });
  }

  // === FILTROS ===
  onPlacaChange(e: Event) {
    this.placaFiltro = (e.target as HTMLInputElement).value;
  }

  onTipoChange(e: Event) {
    this.tipoFiltro = (e.target as HTMLSelectElement).value;
  }

  onPagamentoChange(e: Event) {
    this.pagamentoFiltro = (e.target as HTMLSelectElement).value;
  }

  onDataInicioChange(e: Event) {
    const val = (e.target as HTMLInputElement).value;
    this.dataInicioFiltro = val ? new Date(val) : null;
  }

  onDataFimChange(e: Event) {
    const val = (e.target as HTMLInputElement).value;
    this.dataFimFiltro = val ? new Date(val) : null;
  }

  filtrarRelatorios() {
    const placaFiltro = this.placaFiltro.toLowerCase();
    const tipoFiltro = this.tipoFiltro.toLowerCase();
    const pagamentoFiltro = this.pagamentoFiltro.toLowerCase();

    this.relatoriosFiltrados = this.relatorios.filter(r => {
      const placaMatch = !placaFiltro || r.placa.toLowerCase().includes(placaFiltro);
      const tipoMatch = !tipoFiltro || r.tipo.toLowerCase() === tipoFiltro;
      const pagamentoMatch = !pagamentoFiltro || (r.forma_pagamento || '').toLowerCase() === pagamentoFiltro;

      const entrada = r.data_hora_entrada ? new Date(r.data_hora_entrada) : null;
      const inicioMatch = !this.dataInicioFiltro || (entrada && entrada >= this.dataInicioFiltro);
      const fimMatch = !this.dataFimFiltro || (entrada && entrada <= this.dataFimFiltro);

      return placaMatch && tipoMatch && pagamentoMatch && inicioMatch && fimMatch;
    });

    this.recalcularDashboard(this.relatoriosFiltrados);
  }

  limparFiltros() {
    this.placaFiltro = '';
    this.tipoFiltro = '';
    this.pagamentoFiltro = '';
    this.dataInicioFiltro = null;
    this.dataFimFiltro = null;
    this.relatoriosFiltrados = [...this.relatorios];
    this.recalcularDashboard(this.relatoriosFiltrados);
  }

  // === CÁLCULOS ===
  recalcularDashboard(rows: any[]) {
    this.totalArrecadado = rows.reduce((acc, r) => acc + (r.valor_pago || 0), 0);
    this.totalRegistros = rows.length;

    const tipoCount: Record<string, number> = {};
    rows.forEach(r => tipoCount[r.tipo || 'Outros'] = (tipoCount[r.tipo || 'Outros'] || 0) + 1);
    const sortedTipos = Object.entries(tipoCount).sort((a,b) => b[1]-a[1]);
    this.tipoMaisComum = sortedTipos.length ? sortedTipos[0][0] : '—';

    this.buildMonthlyRevenueChart(rows);
    this.buildEntriesByHourChart(rows);
    this.buildProportionChart(rows);
  }

  // === GRÁFICOS ===
  private buildMonthlyRevenueChart(rows: any[]) {
    const map: Record<string, number> = {};
    rows.forEach(r => {
      if (!r.data_hora_entrada) return;
      const d = new Date(r.data_hora_entrada);
      const key = `${d.getFullYear()}-${('0' + (d.getMonth() + 1)).slice(-2)}`;
      map[key] = (map[key] || 0) + (r.valor_pago || 0);
    });

    const labels = Object.keys(map).sort();
    const data = labels.map(l => map[l]);

    this.monthlyRevenueData = {
      labels,
      datasets: [
        {
          label: 'Faturamento (R$)',
          data,
          backgroundColor: '#22c55e',
          borderRadius: 8
        }
      ]
    };
  }

  private buildEntriesByHourChart(rows: any[]) {
    const hours = new Array<number>(24).fill(0);
    rows.forEach(r => {
      if (!r.data_hora_entrada) return;
      const d = new Date(r.data_hora_entrada);
      const h = d.getHours();
      hours[h] = (hours[h] || 0) + 1;
    });

    this.entriesByHourData = {
      labels: hours.map((_, i) => `${i}:00`),
      datasets: [
        {
          label: 'Entradas por Hora',
          data: hours,
          borderColor: '#3b82f6',
          tension: 0.3,
          fill: false
        }
      ]
    };
  }

  private buildProportionChart(rows: any[]) {
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
      datasets: [
        {
          data: [mensalista, diarista, outros],
          backgroundColor: ['#22c55e', '#f59e0b', '#6b7280']
        }
      ]
    };
  }
}
