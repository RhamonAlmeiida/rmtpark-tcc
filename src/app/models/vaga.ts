
export class Vaga {
  constructor(
    public id: number = 0,
    public placa: string = '',
    public tipo: string = '',
    public dataHora?: Date | null,      // entrada
    public dataHoraSaida?: Date | null, // saída
    public duracao?: string,
    public valor_pago?: number,         // valor pago
    public formaPagamento?: string,     // forma de pagamento
    public status_pagamento?: string,   // status do pagamento
    public ultimoPagamento?: string,
    public numero_interno?: number
  ) {}
}
