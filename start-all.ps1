# Script para iniciar Backend e Frontend juntos
# Usa terminais separados (mais facil de ver logs)
# Execute: .\start-all.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  INICIANDO SISTEMA DE BIBLIOTECA" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se as dependencias estao instaladas
if (-not (Test-Path "backend\node_modules")) {
    Write-Host "ERRO: Dependencias do backend nao instaladas!" -ForegroundColor Red
    Write-Host "Execute: .\install.ps1" -ForegroundColor Yellow
    exit 1
}

if (-not (Test-Path "frontend\node_modules")) {
    Write-Host "ERRO: Dependencias do frontend nao instaladas!" -ForegroundColor Red
    Write-Host "Execute: .\install.ps1" -ForegroundColor Yellow
    exit 1
}

Write-Host "OK: Dependencias verificadas!" -ForegroundColor Green
Write-Host ""

$projectPath = $PWD.Path

# Iniciar backend em nova janela
Write-Host "Iniciando Backend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectPath\backend'; Write-Host 'BACKEND - Sistema de Biblioteca' -ForegroundColor Cyan; Write-Host ''; npm run dev"

Start-Sleep -Seconds 2

# Iniciar frontend em nova janela
Write-Host "Iniciando Frontend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectPath\frontend'; Write-Host 'FRONTEND - Sistema de Biblioteca' -ForegroundColor Magenta; Write-Host ''; npm run dev"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  SERVIDORES INICIADOS!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "Duas janelas do PowerShell foram abertas:" -ForegroundColor Yellow
Write-Host "  1) Backend  - http://localhost:3001" -ForegroundColor Cyan
Write-Host "  2) Frontend - http://localhost:3000" -ForegroundColor Magenta
Write-Host ""

Write-Host "Aguarde alguns segundos para os servidores iniciarem..." -ForegroundColor Yellow
Write-Host ""

Start-Sleep -Seconds 5

Write-Host "Abrindo navegador..." -ForegroundColor Yellow
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  PRONTO PARA USO!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Login padrao:" -ForegroundColor Yellow
Write-Host "  Email: admin@biblioteca.com" -ForegroundColor White
Write-Host "  Senha: admin123" -ForegroundColor White
Write-Host ""

Write-Host "DICA: Para parar os servidores, feche as janelas do PowerShell" -ForegroundColor Gray
Write-Host ""
