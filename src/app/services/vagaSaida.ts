export interface VagaSaida {
  saida: string;          // data/hora de saída, formato ISO (ex: "2025-09-26T23:00:00")
  duracao: string;        // tempo total estacionado, ex: "02:30"
  valor: number;          // valor pago
  formaPagamento: string | null;
}
