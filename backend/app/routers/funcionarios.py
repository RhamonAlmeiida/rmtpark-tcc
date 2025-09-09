from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from .. import models, schemas
from ..database import get_db

router = APIRouter(
    prefix="/api/funcionarios",
    tags=["funcionarios"],
    responses={404: {"description": "Not found"}},
)

@router.post("/", response_model=schemas.Funcionario, status_code=status.HTTP_201_CREATED)
def create_funcionario(funcionario: schemas.FuncionarioCreate, db: Session = Depends(get_db)):
    db_funcionario = models.Funcionario(**funcionario.model_dump())
    db.add(db_funcionario)
    db.commit()
    db.refresh(db_funcionario)
    return db_funcionario

@router.get("/", response_model=List[schemas.Funcionario])
def read_funcionarios(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    funcionarios = db.query(models.Funcionario).offset(skip).limit(limit).all()
    return funcionarios

@router.get("/{funcionario_id}", response_model=schemas.Funcionario)
def read_funcionario(funcionario_id: int, db: Session = Depends(get_db)):
    db_funcionario = db.query(models.Funcionario).filter(models.Funcionario.id == funcionario_id).first()
    if db_funcionario is None:
        raise HTTPException(status_code=404, detail="Funcionário não encontrado")
    return db_funcionario

@router.put("/{funcionario_id}", response_model=schemas.Funcionario)
def update_funcionario(funcionario_id: int, funcionario: schemas.FuncionarioCreate, db: Session = Depends(get_db)):
    db_funcionario = db.query(models.Funcionario).filter(models.Funcionario.id == funcionario_id).first()
    if db_funcionario is None:
        raise HTTPException(status_code=404, detail="Funcionário não encontrado")
    
    # Atualizar campos
    for key, value in funcionario.model_dump().items():
        setattr(db_funcionario, key, value)
    
    db.commit()
    db.refresh(db_funcionario)
    return db_funcionario

@router.delete("/{funcionario_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_funcionario(funcionario_id: int, db: Session = Depends(get_db)):
    db_funcionario = db.query(models.Funcionario).filter(models.Funcionario.id == funcionario_id).first()
    if db_funcionario is None:
        raise HTTPException(status_code=404, detail="Funcionário não encontrado")
    
    db.delete(db_funcionario)
    db.commit()
    return {"message": "Funcionário excluído com sucesso"}