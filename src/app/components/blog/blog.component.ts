import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
  selector: 'app-blog',
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
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss'
})
export class BlogComponent implements OnInit {

  ngOnInit(){
    console.log('Blog carregado');
  }
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
