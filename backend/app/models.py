from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean, Enum
from sqlalchemy.orm import relationship
import enum
from datetime import datetime
from .database import Base

# Enums para tipos de pagamento e status
class TipoVaga(str, enum.Enum):
    MENSALISTA = "Mensalista"
    DIARISTA = "Diarista"

class FormaPagamento(str, enum.Enum):
    DINHEIRO = "Dinheiro"
    CARTAO = "Cartão"
    PIX = "Pix"

class StatusPagamento(str, enum.Enum):
    PAGO = "Pago"
    PENDENTE = "Pendente"

# Modelo de Vaga
class Vaga(Base):
    __tablename__ = "vagas"

    id = Column(Integer, primary_key=True, index=True)
    placa = Column(String, index=True)
    tipo = Column(String)
    dataHora = Column(DateTime, default=datetime.now)
    ativa = Column(Boolean, default=True)
    
    # Relacionamento com relatórios
    relatorios = relationship("Relatorio", back_populates="vaga")

# Modelo de Relatório
class Relatorio(Base):
    __tablename__ = "relatorios"

    id = Column(Integer, primary_key=True, index=True)
    placa = Column(String, index=True)
    tipo = Column(String, default="Diarista")
    dataHoraEntrada = Column(DateTime, default=datetime.now)
    dataHoraSaida = Column(DateTime, nullable=True)
    valorPago = Column(Float, default=0)
    formaPagamento = Column(String, default="Dinheiro")
    statusPagamento = Column(String, default="Pendente")
    
    # Chave estrangeira para vaga
    vaga_id = Column(Integer, ForeignKey("vagas.id"))
    vaga = relationship("Vaga", back_populates="relatorios")

# Modelo de Funcionário
class Funcionario(Base):
    __tablename__ = "funcionarios"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String)
    sobrenome = Column(String)
    dataAdmissao = Column(DateTime, default=datetime.now)
    cpf = Column(String, unique=True, index=True)
    cargo = Column(String)
    listaStatus = Column(String)
    turno = Column(Integer)
    telefone = Column(String)