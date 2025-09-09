import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { CarouselModule } from 'primeng/carousel';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    DividerModule,
    CarouselModule,
    FormsModule,
    ToastModule,
    RouterModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  loadingIndex: number | null = null; 

  
    posts = [
  {
    imagem: 'assets/blog1.jpg',
    tempoLeitura: '6 min leitura',
    data: '6 maio 2025',
    titulo: 'Como evitar perdas com a cobrança manual de estacionamentos',
    resumo: 'A cobrança em estacionamentos pode gerar erros e prejuízos. Saiba como minimizar perdas com soluções mais...',
    link: '/blog'
  },
  {
    imagem: 'assets/blog2.jpg',
    tempoLeitura: '6 min leitura',
    data: '6 maio 2025',
    titulo: 'Estacionamento 24h: como manter a operação segura',
    resumo: 'Um estacionamento 24 horas exige protocolos rigorosos de segurança. Entenda como proteger a operação, os clientes...',
    link: '/blog1'
  },
  {
    imagem: 'assets/blog3.jpg',
    tempoLeitura: '5 min leitura',
    data: '6 maio 2025',
    titulo: 'Sazonalidade em estacionamento: como se preparar para picos e quedas',
    resumo: 'A sazonalidade no estacionamento afeta o volume de clientes. Veja como prever os ciclos e manter a lucratividade...',
    link: '/blog2'
  }
];

  recursos = [
  { icone: 'pi pi-car', titulo: 'Controle total', descricao: 'Gerencie todas as vagas em tempo real' },
  { icone: 'pi pi-chart-line', titulo: 'Relatórios inteligentes', descricao: 'Visualize indicadores e aumente sua receita' },
  { icone: 'pi pi-lock', titulo: 'Segurança', descricao: 'Acesso seguro e dados protegidos' }
];

depoimentos = [
  {
    texto: 'O sistema RMT Park revolucionou a forma como gerencio meu estacionamento!',
    nome: 'João da Silva',
    cargo: 'Gerente',
    empresa: 'Estaciona Fácil'
  },
  {
    texto: 'Simples, rápido e confiável. Aumentou minha receita em 30% em 3 meses.',
    nome: 'Maria Oliveira',
    cargo: 'Proprietária',
    empresa: 'Parking Center'
  },
  {
    texto: 'O suporte é excelente e o sistema muito fácil de usar.',
    nome: 'Carlos Santos',
    cargo: 'Administrador',
    empresa: 'City Park'
  }
];


  planos = [
    {
      titulo: 'Básico',
      preco: 'R$ 199/mês',
      recursos: [
        'Controle de até 50 vagas',
        'Relatórios básicos',
        'Suporte por email',
        'Atualizações gratuitas'
      ],
      destaque: false
    },
    {
      titulo: 'Profissional',
      preco: 'R$ 349/mês',
      recursos: [
        'Controle de até 150 vagas',
        'Relatórios avançados',
        'Suporte prioritário',
        'Gestão de mensalistas',
        'Aplicativo móvel'
      ],
      destaque: true
    },
    {
      titulo: 'Empresarial',
      preco: 'R$ 599/mês',
      recursos: [
        'Vagas ilimitadas',
        'Relatórios personalizados',
        'Suporte 24/7',
        'Gestão multi-estacionamentos',
        'Integração com sistemas de pagamento',
        'API para integrações'
      ],
      destaque: false
    }

    
  ];

  constructor(private router: Router, private messageService: MessageService) {}

  irParaLogin() {
    this.router.navigate(['/login']);
  }

  direcionarCadastro() {
    this.router.navigate(['/site-cadastro']);
  }
      direcionarblog(){
    this.router.navigate(['/blog'])
    
  }

  contratarPlano(index: number) {
    this.loadingIndex = index; 

    
    setTimeout(() => {
      this.loadingIndex = null; 
      this.messageService.add({
        severity: 'success',
        summary: 'Plano contratado',
        detail: `Você contratou o plano ${this.planos[index].titulo}`
      });
    }, 2000);
  }
  irParaPost(link: string) {
  this.router.navigate([link]);
}

}
