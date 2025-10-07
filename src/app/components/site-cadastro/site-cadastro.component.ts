import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SiteCadastroService } from '../../services/site-cadastro.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { MessageService } from 'primeng/api';

interface Plano {
  label: string;
  preco: string;
  descricao: string[];
}

@Component({
  selector: 'app-site-cadastro',
  templateUrl: './site-cadastro.component.html',
  styleUrls: ['./site-cadastro.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    TableModule,
    ToastModule,
    ConfirmDialogModule,
    DialogModule,
    TagModule,
    InputTextModule,
    CalendarModule,
    DropdownModule,
    InputMaskModule
  ],
  providers: [MessageService]
})
export class SiteCadastroComponent implements OnInit {
  cadastroForm: FormGroup;
  planoSelecionado: string = 'Gold';
  carregando: boolean = false;

  planos: Plano[] = [
    {
      label: 'Básico', preco: 'R$ 199,00/mês', descricao: [
        'Controle de até 50 vagas',
        'Relatórios básicos',
        'Suporte por email',
        'Atualizações gratuitas'
      ]
    },
    {
      label: 'Profissional', preco: 'R$ 299,00/mês', descricao: [
        'Controle de até 150 vagas',
        'Relatórios avançados',
        'Suporte prioritário',
        'Gestão de mensalistas',
        'Aplicativo móvel'
      ]
    },
    {
      label: 'Empresarial', preco: 'R$ 499,00/mês', descricao: [
        'Vagas ilimitadas',
        'Relatórios personalizados',
        'Suporte 24/7',
        'Gestão multi-estacionamentos',
        'Integração com sistemas de pagamento',
        'API para integrações'
      ]
    },
  ];

  get cadastro() {
    return this.cadastroForm.value;
  }

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private siteCadastroService: SiteCadastroService,
    private messageService: MessageService
  ) {
    this.cadastroForm = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', Validators.required],
      cnpj: ['', Validators.required],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      aceite: [false, Validators.requiredTrue],
      plano: [this.planos[0], Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['plano']) {
        const planoEncontrado = this.planos.find(p => p.label === params['plano']);
        if (planoEncontrado) {
          this.planoSelecionado = planoEncontrado.label;
          this.cadastroForm.patchValue({ plano: planoEncontrado });
        }
      }
    });
  }

  cadastrar() {
    if (this.cadastroForm.invalid) {
      this.messageService.add({ 
        severity: 'warn', 
        summary: 'Atenção', 
        detail: 'Preencha todos os campos corretamente!' 
      });
      return;
    }

    const formValue = this.cadastroForm.value;

    // Garantir que o plano é enviado como objeto
    const planoBackend = {
      titulo: formValue.plano.label,
      preco: formValue.plano.preco,
      recursos: formValue.plano.descricao,
      destaque: formValue.plano.label === 'Empresarial'
    };

    const payload = {
      ...formValue,
      plano: planoBackend
    };

    this.carregando = true;
    this.siteCadastroService.cadastrar(payload).subscribe({
      next: (res: any) => {
        this.carregando = false;

        if (res.pagamento_link) {
          window.location.href = res.pagamento_link;
        } else {
          // Exibe toast antes de navegar
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Cadastro realizado! Confirme seu e-mail antes de acessar.'
          });

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
        }
      },
      error: (err) => {
        this.carregando = false;
        console.error(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err.error?.detail || 'Erro ao cadastrar. Verifique os dados.'
        });
      }
    });
  }

  voltarPagina() {
    this.router.navigate(['/']);
  }
}
