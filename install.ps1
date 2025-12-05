# Script de Instalação do Sistema de Biblioteca
# Execute: .\install.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  📚 SISTEMA DE BIBLIOTECA - SETUP" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$ErrorActionPreference = "Stop"

# Verificar Node.js
Write-Host "🔍 Verificando Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "   ✅ Node.js instalado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Node.js não encontrado!" -ForegroundColor Red
    Write-Host "   Instale em: https://nodejs.org" -ForegroundColor Yellow
    exit 1
}

# Verificar npm
Write-Host "🔍 Verificando npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "   ✅ npm instalado: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "   ❌ npm não encontrado!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  📦 INSTALANDO DEPENDÊNCIAS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Instalar backend
Write-Host "📥 Instalando dependências do backend..." -ForegroundColor Yellow
Set-Location backend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao instalar dependências do backend!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Backend instalado com sucesso!" -ForegroundColor Green
Set-Location ..

Write-Host ""

# Instalar frontend
Write-Host "📥 Instalando dependências do frontend..." -ForegroundColor Yellow
Set-Location frontend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao instalar dependências do frontend!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Frontend instalado com sucesso!" -ForegroundColor Green
Set-Location ..

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ✅ INSTALAÇÃO CONCLUÍDA!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "📋 PRÓXIMOS PASSOS:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1️⃣  Configure o banco de dados no Supabase:" -ForegroundColor White
Write-Host "   https://supabase.com/dashboard/project/jilwzfxlroenxsdyjhsd" -ForegroundColor Cyan
Write-Host "   - Vá em SQL Editor" -ForegroundColor Gray
Write-Host "   - Execute database/schema.sql" -ForegroundColor Gray
Write-Host "   - Execute database/seed.sql" -ForegroundColor Gray
Write-Host ""

Write-Host "2️⃣  Inicie o backend:" -ForegroundColor White
Write-Host "   cd backend" -ForegroundColor Cyan
Write-Host "   npm run dev" -ForegroundColor Cyan
Write-Host ""

Write-Host "3️⃣  Inicie o frontend (em outro terminal):" -ForegroundColor White
Write-Host "   cd frontend" -ForegroundColor Cyan
Write-Host "   npm run dev" -ForegroundColor Cyan
Write-Host ""

Write-Host "4️⃣  Acesse o sistema:" -ForegroundColor White
Write-Host "   http://localhost:3000" -ForegroundColor Cyan
Write-Host ""

Write-Host "🔐 Login padrão:" -ForegroundColor Yellow
Write-Host "   Email: admin@biblioteca.com" -ForegroundColor White
Write-Host "   Senha: admin123" -ForegroundColor White
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Precisa de ajuda? Leia: INICIO-RAPIDO.md" -ForegroundColor Gray
Write-Host "========================================" -ForegroundColor Cyan
