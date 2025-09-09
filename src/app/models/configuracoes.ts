
export class Empresa {
  constructor(
    public nome: string = "",
    public cnpj : string = "",
    public fantasia: string ="",
    public endereco: string ="",
    public cidade: string ="",
    public estado: string ="",
    public cep: string ="",
    public pix: string = "",
    public rodape: string = "",
    public valorHora: number = 10,
    public valorDiaria: number = 0,
    public valorMensalista: number = 0,
    public arredondamento: string = '15',
    public formaPagamento: string = 'Pix'

  ) {}
}

export class TabelaPreco {
  constructor(
    public valorBase: number | null = null,
    public carro: number | null = null,
    public moto: number | null = null,
    public caminhonete: number | null = null,
    public mensalista: number | null = null
  ) {}
}
export class Vagas {
  constructor(
    public total: number = 0,
    public carro: number = 0,
    public moto: number = 0,
    public deficiente: number = 0,
    public idosos: number = 0
  ) {}
}
export class TipoCobranca {
  constructor(
    public porHora: boolean = false,
    public porFracao: boolean = false,
    public diaria: boolean = false
  ) {}
}
