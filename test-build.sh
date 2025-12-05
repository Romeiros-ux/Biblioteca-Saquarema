#!/bin/bash
# Script para testar build de produção localmente antes do deploy

echo "🔨 Testando build de produção..."

# Backend
echo ""
echo "📦 Instalando dependências do backend..."
cd backend
npm install || { echo "❌ Erro ao instalar dependências do backend"; exit 1; }
echo "✅ Backend pronto para produção"
cd ..

# Frontend
echo ""
echo "📦 Instalando dependências do frontend..."
cd frontend
npm install || { echo "❌ Erro ao instalar dependências do frontend"; exit 1; }

echo ""
echo "🏗️ Fazendo build do frontend..."
npm run build || { echo "❌ Erro ao fazer build do frontend"; exit 1; }

echo "✅ Frontend build concluída com sucesso!"
echo ""
echo "📊 Tamanho da build:"
du -sh dist

cd ..

echo ""
echo "✅ Tudo pronto para deploy no Render!"
echo ""
echo "📝 Próximos passos:"
echo "1. Faça commit das alterações: git add . && git commit -m 'Preparar para deploy'"
echo "2. Envie para o GitHub: git push origin main"
echo "3. Siga o guia em DEPLOY-RENDER.md"
