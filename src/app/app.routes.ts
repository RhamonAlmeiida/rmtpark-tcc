// app/app.routes.ts
import { Routes } from '@angular/router';
import { VagaListaComponent } from './components/vagas/vaga-lista/vaga-lista.component';
import { MensalistasComponent } from './components/mensalistas/mensalistas.component';
import { ConfiguracoesComponent } from './components/configuracoes/configuracoes.component';
import { VagaCadastroComponent } from './components/vaga-cadastro/vaga-cadastro.component';
import { RelatorioComponent } from './components/relatorios/relatorios.component';
import { authGuard } from './auth.guard';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { SiteCadastroComponent } from './components/site-cadastro/site-cadastro.component';
import { BlogComponent } from './components/blog/blog.component';
import { Blog1Component } from './components/blog1/blog1.component';
import { Blog2Component } from './components/blog2/blog2.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, 
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'blog1', component: Blog1Component},
  { path: 'blog2', component: Blog2Component},
  { path: 'site-cadastro', component: SiteCadastroComponent },
  { path: 'vagas', component: VagaListaComponent, canActivate: [authGuard] },
  { path: 'vagas/cadastro', component: VagaCadastroComponent, canActivate: [authGuard] },
  { path: 'mensalistas', component: MensalistasComponent, canActivate: [authGuard] },
  { path: 'relatorio', component: RelatorioComponent, canActivate: [authGuard] },
  { path: 'configuracoes', component: ConfiguracoesComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' } 
];
