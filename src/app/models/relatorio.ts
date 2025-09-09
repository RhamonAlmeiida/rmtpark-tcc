export class Relatorio {
  constructor(
    public id: number = 0,
    public placa: string = '',
    public tipo: 'Mensalista' | 'Diarista' = 'Diarista',
    public dataHoraEntrada: Date = new Date(),
    public dataHoraSaida: Date = new Date(),
    public valorPago: number = 0,
    public formaPagamento: 'Dinheiro' | 'Cartão' | 'Pix' = 'Dinheiro',
    public statusPagamento: 'Pago' | 'Pendente' = 'Pendente'
  ) {}
}
