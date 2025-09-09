export class Mensalista {
    constructor(
        public id: number,
        public nome: string,
        public placa: string,
        public veiculo: string,
        public cor: string,
        public cpf: string,
        public validade: string, 
        public status: 'ativo' | 'inadimplente' | 'vencendo'
    ) { }
}
