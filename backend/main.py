from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from datetime import datetime, timedelta
import uvicorn

from app.routers import vagas, relatorios, funcionarios
from app.database import engine, Base

# Criar tabelas no banco de dados
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="RMT Park API",
    description="API para o sistema de gestão de estacionamento RMT Park",
    version="1.0.0"
)

# Configurar CORS
origins = [
    "http://localhost:4200",  # Frontend Angular em desenvolvimento
    "https://super-dev-trabalho-final.vercel.app",  # Frontend em produção
    "*"  # Permitir todas as origens em desenvolvimento (remover em produção)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir routers
app.include_router(vagas.router)
app.include_router(relatorios.router)
app.include_router(funcionarios.router)

@app.get("/")
async def root():
    return {"message": "Bem-vindo à API do RMT Park"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)