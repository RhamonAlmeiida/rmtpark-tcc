from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from .. import models, schemas
from ..database import get_db

router = APIRouter(
    prefix="/api/vagas",
    tags=["vagas"],
    responses={404: {"description": "Not found"}},
)

@router.post("/", response_model=schemas.Vaga, status_code=status.HTTP_201_CREATED)
def create_vaga(vaga: schemas.VagaCreate, db: Session = Depends(get_db)):
    db_vaga = models.Vaga(**vaga.model_dump())
    db.add(db_vaga)
    db.commit()
    db.refresh(db_vaga)
    return db_vaga

@router.get("/", response_model=List[schemas.Vaga])
def read_vagas(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    vagas = db.query(models.Vaga).filter(models.Vaga.ativa == True).offset(skip).limit(limit).all()
    return vagas

@router.get("/{vaga_id}", response_model=schemas.Vaga)
def read_vaga(vaga_id: int, db: Session = Depends(get_db)):
    db_vaga = db.query(models.Vaga).filter(models.Vaga.id == vaga_id).first()
    if db_vaga is None:
        raise HTTPException(status_code=404, detail="Vaga não encontrada")
    return db_vaga

@router.delete("/{vaga_id}", status_code=status.HTTP_200_OK)
def saida_vaga(vaga_id: int, db: Session = Depends(get_db)):
    db_vaga = db.query(models.Vaga).filter(models.Vaga.id == vaga_id).first()
    if db_vaga is None:
        raise HTTPException(status_code=404, detail="Vaga não encontrada")
    
    # Marcar vaga como inativa (saída)
    db_vaga.ativa = False
    
    # Criar relatório de saída
    relatorio = models.Relatorio(
        placa=db_vaga.placa,
        tipo=db_vaga.tipo,
        dataHoraEntrada=db_vaga.dataHora,
        dataHoraSaida=db.func.now(),
        vaga_id=db_vaga.id
    )
    
    db.add(relatorio)
    db.commit()
    db.refresh(relatorio)
    
    return {"message": "Saída registrada com sucesso", "relatorio_id": relatorio.id}