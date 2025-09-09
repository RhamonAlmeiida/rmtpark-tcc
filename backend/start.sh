#!/bin/bash

# Ativar ambiente virtual se existir
if [ -d "../venv" ]; then
    source ../venv/bin/activate
fi

# Instalar dependências se necessário
pip install -r requirements.txt

# Executar o servidor
python main.py