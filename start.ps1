# Script para iniciar Backend e Frontend juntos
# Execute: .\start.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  🚀 INICIANDO SISTEMA DE BIBLIOTECA" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se as dependências estão instaladas
if (-not (Test-Path "backend\node_modules")) {
    Write-Host "❌ Dependências do backend não instaladas!" -ForegroundColor Red
    Write-Host "   Execute: cd backend; npm install" -ForegroundColor Yellow
    exit 1
}

if (-not (Test-Path "frontend\node_modules")) {
    Write-Host "❌ Dependências do frontend não instaladas!" -ForegroundColor Red
    Write-Host "   Execute: cd frontend; npm install" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Dependências verificadas!" -ForegroundColor Green
Write-Host ""

Write-Host "🔧 Configuração:" -ForegroundColor Yellow
Write-Host "   📡 Backend:  http://localhost:3001" -ForegroundColor Cyan
Write-Host "   🌐 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""

Write-Host "🔐 Login padrão:" -ForegroundColor Yellow
Write-Host "   Email: admin@biblioteca.com" -ForegroundColor White
Write-Host "   Senha: admin123" -ForegroundColor White
Write-Host ""

Write-Host "⚡ Iniciando servidores..." -ForegroundColor Yellow
Write-Host ""

# Criar jobs para rodar em paralelo
$backendJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD\backend
    npm run dev
}

$frontendJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD\frontend
    npm run dev
}

Write-Host "✅ Backend iniciado (Job ID: $($backendJob.Id))" -ForegroundColor Green
Write-Host "✅ Frontend iniciado (Job ID: $($frontendJob.Id))" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ⏳ Aguardando servidores iniciarem..." -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Aguardar um pouco para os servidores iniciarem
Start-Sleep -Seconds 5

Write-Host "📊 Status dos servidores:" -ForegroundColor Yellow
Write-Host ""

# Exibir output dos jobs
Write-Host "--- BACKEND ---" -ForegroundColor Cyan
Receive-Job -Job $backendJob
Write-Host ""

Write-Host "--- FRONTEND ---" -ForegroundColor Cyan
Receive-Job -Job $frontendJob
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host "  ✅ SISTEMA INICIADO COM SUCESSO!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "🌐 Acesse: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""

Write-Host "📋 Comandos úteis:" -ForegroundColor Yellow
Write-Host "   Ver logs: Receive-Job -Job $($backendJob.Id)" -ForegroundColor Gray
Write-Host "   Parar tudo: Pressione Ctrl+C" -ForegroundColor Gray
Write-Host ""

Write-Host "Pressione Ctrl+C para parar todos os servidores" -ForegroundColor Yellow
Write-Host ""

# Manter o script rodando e mostrando logs
try {
    while ($true) {
        Start-Sleep -Seconds 2
        
        # Mostrar logs novos do backend
        $backendOutput = Receive-Job -Job $backendJob
        if ($backendOutput) {
            Write-Host "[BACKEND] $backendOutput" -ForegroundColor Blue
        }
        
        # Mostrar logs novos do frontend
        $frontendOutput = Receive-Job -Job $frontendJob
        if ($frontendOutput) {
            Write-Host "[FRONTEND] $frontendOutput" -ForegroundColor Magenta
        }
    }
}
finally {
    Write-Host ""
    Write-Host "🛑 Parando servidores..." -ForegroundColor Yellow
    Stop-Job -Job $backendJob
    Stop-Job -Job $frontendJob
    Remove-Job -Job $backendJob
    Remove-Job -Job $frontendJob
    Write-Host "✅ Servidores parados!" -ForegroundColor Green
}
