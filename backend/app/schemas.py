from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

# Esquemas para Vaga
class VagaBase(BaseModel):
    placa: str
    tipo: str
    dataHora: Optional[datetime] = Field(default_factory=datetime.now)

class VagaCreate(VagaBase):
    pass

class Vaga(VagaBase):
    id: int
    ativa: bool = True

    class Config:
        orm_mode = True

# Esquemas para Relatório
class RelatorioBase(BaseModel):
    placa: str
    tipo: str = "Diarista"
    dataHoraEntrada: Optional[datetime] = Field(default_factory=datetime.now)
    dataHoraSaida: Optional[datetime] = None
    valorPago: float = 0
    formaPagamento: str = "Dinheiro"
    statusPagamento: str = "Pendente"

class RelatorioCreate(RelatorioBase):
    vaga_id: int

class Relatorio(RelatorioBase):
    id: int
    vaga_id: int

    class Config:
        orm_mode = True

# Esquemas para Funcionário
class FuncionarioBase(BaseModel):
    nome: str
    sobrenome: str
    dataAdmissao: Optional[datetime] = Field(default_factory=datetime.now)
    cpf: Optional[str] = None
    cargo: Optional[str] = None
    listaStatus: Optional[str] = None
    turno: Optional[int] = None
    telefone: Optional[str] = None

class FuncionarioCreate(FuncionarioBase):
    pass

class Funcionario(FuncionarioBase):
    id: int

    class Config:
        orm_mode = True