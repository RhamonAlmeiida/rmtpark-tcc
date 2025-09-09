
export class Funcionarios {
    constructor(
        public id: number = 0,
        public nome: string = "",
        public sobrenome: string = "",
        public dataAdmissao?: Date,
        public cpf?: string,
        public cargo?: string,
        public listaStatus?: string,
        public turno?: number,
        public telefone?: number
    ) {}
}


