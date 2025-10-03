export type FormaPagamento = 'Dinheiro' | 'Pix' | 'Cartao';
export type Arredondamento = 15 | 30;

export class Configuracoes {
  constructor(
    public nome: string = '',
    public cnpj: string = '',
    public fantasia: string = '',
    public endereco: string = '',
    public cidade: string = '',
    public estado: string = '',
    public cep: string = '',
    public rodape: string = '',
    public pix: string = '',
    public valorHora: number = 10,
    public valorDiaria: number = 50,
    public valorMensalista: number = 200,
    public arredondamento: Arredondamento = 15,
    public formaPagamento: FormaPagamento = 'Pix'
  ) {}
}
