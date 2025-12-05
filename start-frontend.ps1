# Script para iniciar o frontend
# Execute: .\start-frontend.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  🎨 INICIANDO FRONTEND" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Set-Location frontend

Write-Host "🌐 Frontend será iniciado em:" -ForegroundColor Yellow
Write-Host "   http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔐 Login padrão:" -ForegroundColor Yellow
Write-Host "   Email: admin@biblioteca.com" -ForegroundColor White
Write-Host "   Senha: admin123" -ForegroundColor White
Write-Host ""
Write-Host "Pressione Ctrl+C para parar o servidor" -ForegroundColor Gray
Write-Host ""

npm run dev
