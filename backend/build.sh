#!/usr/bin/env bash
# exit on error
set -o errexit

pip install --upgrade pip
pip install -r requirements.txt

# Criar diretórios necessários
mkdir -p data contracts
chmod 777 data contracts

