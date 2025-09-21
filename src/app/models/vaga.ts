// src/app/models/vaga.ts
export class Vaga {
  constructor(
    public id?: number,
    public placa: string = '',
    public tipo: 'Mensalista' | 'Diarista' = 'Diarista',
    public dataHora: Date = new Date(),
    public saida?: Date,
    public duracao?: string,
    public valor?: number,
    public formaPagamento?: string
  ) {}
}
