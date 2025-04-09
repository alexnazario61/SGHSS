#!/bin/bash

echo "Iniciando deploy da aplicação SGHSS..."

# Variáveis de ambiente
export NODE_ENV=production
export VITE_API_URL=http://api.sghss.com

# Build da aplicação
echo "Realizando build..."
npm run build

# Deploy com Docker
echo "Realizando deploy com Docker..."
docker-compose -f docker-compose.yml up -d --build

echo "Deploy concluído!"
