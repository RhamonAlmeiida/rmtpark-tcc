export interface SiteCadastroCreate {
  nome: string;
  email: string;
  telefone: string;
  cnpj: string;
  senha: string;
  aceite?: boolean;
}

export interface SiteCadastro {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  cnpj: string;
  email_confirmado: boolean;
}