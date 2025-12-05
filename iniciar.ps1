# Script simples para iniciar tudo
# Execute: .\iniciar.ps1

Write-Host ""
Write-Host "====================================" -ForegroundColor Cyan
Write-Host " SISTEMA DE BIBLIOTECA - INICIANDO" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

$projectPath = $PWD.Path

# Backend
Write-Host "[1/2] Iniciando Backend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectPath\backend'; npm run dev"

Start-Sleep -Seconds 3

# Frontend  
Write-Host "[2/2] Iniciando Frontend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectPath\frontend'; npm run dev"

Write-Host ""
Write-Host "OK! Duas janelas foram abertas" -ForegroundColor Green
Write-Host ""
Write-Host "Aguarde 10 segundos e acesse:" -ForegroundColor Yellow
Write-Host "  http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Login:" -ForegroundColor Yellow
Write-Host "  Email: admin@biblioteca.com"
Write-Host "  Senha: admin123"
Write-Host ""

Start-Sleep -Seconds 8
Start-Process "http://localhost:3000"
