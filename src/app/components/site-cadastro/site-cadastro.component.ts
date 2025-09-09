import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-site-cadastro',
     imports: [
    FormsModule,
    ToastModule,
    MessageModule,
    RouterModule,
    DialogModule,
    ButtonModule,
    CardModule,
    CommonModule,
    
  ],
   providers: [ConfirmationService, MessageService],
  templateUrl: './site-cadastro.component.html',
  styleUrl: './site-cadastro.component.scss'
})
export class SiteCadastroComponent  {
  constructor(
    private loginService: LoginService,    
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ){}

  voltarPagina(){
    this.router.navigate(['/home'])
  }
}
