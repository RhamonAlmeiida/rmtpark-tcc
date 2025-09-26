export class Relatorio {
  constructor(
    public id: number = 0,
    public placa: string = '',
    public tipo: 'Mensalista' | 'Diarista' = 'Diarista',
    public dataHoraEntrada: Date | null = null,
    public dataHoraSaida: Date | null = null,
    public duracao: string = '',
    public valorPago: number = 0,
    public formaPagamento: 'Dinheiro' | 'Cartão' | 'Pix' = 'Dinheiro',
    public statusPagamento: 'Pago' | 'Pendente' = 'Pago'
  ) {}
}
