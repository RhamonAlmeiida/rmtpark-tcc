# RMT Park - Backend API

Este é o backend da aplicação RMT Park, desenvolvido com FastAPI e SQLAlchemy.

## Requisitos

- Python 3.8 ou superior
- pip (gerenciador de pacotes do Python)

## Instalação

1. Clone o repositório (se ainda não o fez)

```bash
git clone <url-do-repositorio>
cd SuperDev-Trabalho-Final
```

2. Crie um ambiente virtual Python

```bash
python -m venv venv
```

3. Ative o ambiente virtual

- No Windows:
```bash
venv\Scripts\activate
```

- No macOS/Linux:
```bash
source venv/bin/activate
```

4. Instale as dependências

```bash
cd backend
pip install -r requirements.txt
```

5. Configure as variáveis de ambiente (opcional)

Edite o arquivo `.env` conforme necessário.

## Executando o servidor

```bash
python main.py
```

O servidor estará disponível em `http://localhost:8000`.

## Documentação da API

A documentação interativa da API estará disponível em:

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Estrutura do Projeto

```
backend/
├── app/
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── funcionarios.py
│   │   ├── relatorios.py
│   │   └── vagas.py
│   ├── __init__.py
│   ├── database.py
│   ├── models.py
│   └── schemas.py
├── .env
├── main.py
├── README.md
└── requirements.txt
```

## Integração com o Frontend

O backend está configurado para aceitar requisições do frontend Angular em:

- Desenvolvimento: `http://localhost:4200`
- Produção: `https://super-dev-trabalho-final.vercel.app`

As configurações CORS podem ser ajustadas no arquivo `main.py`.