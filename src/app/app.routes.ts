
import { Routes } from '@angular/router';
import { VagaListaComponent } from './components/vagas/vaga-lista/vaga-lista.component';
import { MensalistasComponent } from './components/mensalistas/mensalistas.component';
import { ConfiguracoesComponent } from './components/configuracoes/configuracoes.component';
import { RelatorioComponent } from './components/relatorios/relatorios.component';
import { authGuard } from './auth.guard';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { SiteCadastroComponent } from './components/site-cadastro/site-cadastro.component';
import { BlogComponent } from './components/blog/blog.component';
import { Blog1Component } from './components/blog1/blog1.component';
import { Blog2Component } from './components/blog2/blog2.component';
import { ConfirmarEmailComponent } from './components/confirmar-email/confirmar-email.component';
import { RedefinirSenhaComponent } from './components/redefinir-senha/auth/redefinir-senha/redefinir-senha.component';
import { PainelAdminComponent } from './components/painel-admin/painel-admin.component';
import { GraficoComponent } from './components/grafico/grafico.component';


export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' }, 
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'painel-admin', component: PainelAdminComponent, canActivate: [authGuard] },
  { path: 'blog', component: BlogComponent },
  { path: 'blog1', component: Blog1Component},
  { path: 'blog2', component: Blog2Component},
  { path: 'site-cadastro', component: SiteCadastroComponent },
  { path: 'confirmar-email', component: ConfirmarEmailComponent },
  { path: 'redefinir-senha', component: RedefinirSenhaComponent },
  { path: 'vagas', component: VagaListaComponent, canActivate: [authGuard] },
  { path: 'mensalistas', component: MensalistasComponent, canActivate: [authGuard] },
  { path: 'relatorio', component: RelatorioComponent, canActivate: [authGuard] },
  { path: 'grafico', component: GraficoComponent, canActivate: [authGuard] },
  { path: 'configuracoes', component: ConfiguracoesComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' } 
];
