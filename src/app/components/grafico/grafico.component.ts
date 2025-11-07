import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { RelatorioService } from '../../services/relatorio.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-grafico',
  standalone: true,
  imports: [CommonModule, ChartModule, ToastModule],
  providers: [MessageService],
  templateUrl: './grafico.component.html',
  styleUrls: ['./grafico.component.scss']
})
export class GraficoComponent implements OnInit {
  relatorios: any[] = [];

  totalArrecadado = 0;
  totalRegistros = 0;
  tipoMaisComum = '—';

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
    this.relatorioService.getRelatorios().subscribe({
      next: (res: any[]) => {
        this.relatorios = res.map((r: any) => ({
          id: r.id,
          placa: r.placa,
          tipo: r.tipo,
          data_hora_entrada: r.data_hora_entrada,
          data_hora_saida: r.data_hora_saida,
          valor_pago: r.valor_pago ?? 0,
          forma_pagamento: r.forma_pagamento ?? '',
          status_pagamento: r.status_pagamento ?? ''
        }));

        this.recalcularDashboard();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Falha ao carregar relatórios'
        });
        console.error('Erro ao carregar relatórios:', err);
      }
    });
  }

  recalcularDashboard(): void {
    const rows = this.relatorios || [];

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
