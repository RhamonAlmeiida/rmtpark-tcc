import { Vaga } from './vaga';

describe('Vaga', () => {
  it('should create an instance', () => {
    const vaga = new Vaga(1, 'ABC-1234', 'Mensalista', new Date());
    expect(vaga).toBeTruthy();
  });
});
