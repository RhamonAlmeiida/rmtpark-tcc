export interface SiteCadastroCreate {
  nome: string;
  email: string;
  telefone: string;
  cnpj: string;
  senha: string;
  aceite: boolean;
  plano: {
    titulo: string;
    preco: string;
    recursos: string[];
    destaque: boolean;
  };
}



export interface SiteCadastro {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  cnpj: string;
  email_confirmado: boolean;
}

export interface SiteCadastro extends SiteCadastroCreate {
  id: number;
  pagamento_link?: string;
  status_pagamento?: string;
  criado_em?: Date;
}