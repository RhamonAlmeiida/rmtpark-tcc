from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from .. import models, schemas
from ..database import get_db

router = APIRouter(
    prefix="/api/relatorios",
    tags=["relatorios"],
    responses={404: {"description": "Not found"}},
)

@router.post("/", response_model=schemas.Relatorio, status_code=status.HTTP_201_CREATED)
def create_relatorio(relatorio: schemas.RelatorioCreate, db: Session = Depends(get_db)):
    db_relatorio = models.Relatorio(**relatorio.model_dump())
    db.add(db_relatorio)
    db.commit()
    db.refresh(db_relatorio)
    return db_relatorio

@router.get("/", response_model=List[schemas.Relatorio])
def read_relatorios(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    relatorios = db.query(models.Relatorio).offset(skip).limit(limit).all()
    return relatorios

@router.get("/{relatorio_id}", response_model=schemas.Relatorio)
def read_relatorio(relatorio_id: int, db: Session = Depends(get_db)):
    db_relatorio = db.query(models.Relatorio).filter(models.Relatorio.id == relatorio_id).first()
    if db_relatorio is None:
        raise HTTPException(status_code=404, detail="Relatório não encontrado")
    return db_relatorio

@router.put("/{relatorio_id}/pagamento", response_model=schemas.Relatorio)
def update_pagamento(relatorio_id: int, valor_pago: float, forma_pagamento: str, db: Session = Depends(get_db)):
    db_relatorio = db.query(models.Relatorio).filter(models.Relatorio.id == relatorio_id).first()
    if db_relatorio is None:
        raise HTTPException(status_code=404, detail="Relatório não encontrado")
    
    db_relatorio.valorPago = valor_pago
    db_relatorio.formaPagamento = forma_pagamento
    db_relatorio.statusPagamento = "Pago"
    db_relatorio.dataHoraSaida = datetime.now()
    
    db.commit()
    db.refresh(db_relatorio)
    return db_relatorio

@router.delete("/{relatorio_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_relatorio(relatorio_id: int, db: Session = Depends(get_db)):
    db_relatorio = db.query(models.Relatorio).filter(models.Relatorio.id == relatorio_id).first()
    if db_relatorio is None:
        raise HTTPException(status_code=404, detail="Relatório não encontrado")
    
    db.delete(db_relatorio)
    db.commit()
    return {"message": "Relatório excluído com sucesso"}

@router.get("/filtro/placa", response_model=List[schemas.Relatorio])
def filter_by_placa(placa: str, db: Session = Depends(get_db)):
    relatorios = db.query(models.Relatorio).filter(models.Relatorio.placa.contains(placa)).all()
    return relatorios

@router.get("/filtro/tipo", response_model=List[schemas.Relatorio])
def filter_by_tipo(tipo: str, db: Session = Depends(get_db)):
    relatorios = db.query(models.Relatorio).filter(models.Relatorio.tipo == tipo).all()
    return relatorios

@router.get("/filtro/pagamento", response_model=List[schemas.Relatorio])
def filter_by_pagamento(forma_pagamento: str, db: Session = Depends(get_db)):
    relatorios = db.query(models.Relatorio).filter(models.Relatorio.formaPagamento == forma_pagamento).all()
    return relatorios