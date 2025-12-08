#!/bin/bash

# Script de Auto-Deploy para MemoryVerse AI
# Execute este script na sua VPS após clonar o repositório e configurar o .env

echo "🚀 Iniciando Deploy do MemoryVerse AI..."

# 1. Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Instalando versão 20..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
fi

# 2. Verificar PNPM
if ! command -v pnpm &> /dev/null; then
    echo "📦 Instalando PNPM..."
    sudo npm install -g pnpm
fi

# 3. Instalar Dependências
echo "📦 Instalando dependências..."
pnpm install

# 4. Build
echo "🏗️ Construindo aplicação..."
pnpm build

# 5. Banco de Dados
echo "🗄️ Atualizando Banco de Dados..."
pnpm db:push

# 6. Criar Admin (se configurado)
echo "👑 Verificando usuário Admin..."
npx tsx server/scripts/createAdmin.ts

# 7. PM2
echo "⚡ Iniciando com PM2..."
if ! command -v pm2 &> /dev/null; then
    sudo npm install -g pm2
fi

pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup

echo "✅ Deploy finalizado! Verifique 'pm2 status' ou acesse seu domínio."
