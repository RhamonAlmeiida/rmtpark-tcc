import { Vaga } from '../../../models/vaga';

describe('Vaga', () => {
  it('should create an instance', () => {
    const vaga: Vaga = {
      id: 1,
      placa: 'ABC-1234',
      tipo: 'Mensalista',
      dataHora: new Date(),
    };
    expect(vaga).toBeTruthy();
  });
});
