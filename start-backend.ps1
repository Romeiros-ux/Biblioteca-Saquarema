# Script para iniciar o backend
# Execute: .\start-backend.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  🚀 INICIANDO BACKEND" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Set-Location backend

Write-Host "📡 Backend será iniciado em:" -ForegroundColor Yellow
Write-Host "   http://localhost:3001" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔗 Health check:" -ForegroundColor Yellow
Write-Host "   http://localhost:3001/health" -ForegroundColor Cyan
Write-Host ""
Write-Host "Pressione Ctrl+C para parar o servidor" -ForegroundColor Gray
Write-Host ""

npm run dev
