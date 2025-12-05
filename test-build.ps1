# Script para testar build de produção localmente antes do deploy
Write-Host "🔨 Testando build de produção..." -ForegroundColor Cyan

# Backend
Write-Host "`n📦 Instalando dependências do backend..." -ForegroundColor Yellow
Set-Location backend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao instalar dependências do backend" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Backend pronto para produção" -ForegroundColor Green
Set-Location ..

# Frontend
Write-Host "`n📦 Instalando dependências do frontend..." -ForegroundColor Yellow
Set-Location frontend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao instalar dependências do frontend" -ForegroundColor Red
    exit 1
}

Write-Host "`n🏗️ Fazendo build do frontend..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao fazer build do frontend" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Frontend build concluída com sucesso!" -ForegroundColor Green
Write-Host "`n📊 Tamanho da build:" -ForegroundColor Cyan
Get-ChildItem -Path dist -Recurse | Measure-Object -Property Length -Sum | Select-Object @{Name="Size (MB)";Expression={[math]::Round($_.Sum / 1MB, 2)}}

Set-Location ..

Write-Host "`n✅ Tudo pronto para deploy no Render!" -ForegroundColor Green
Write-Host "`n📝 Próximos passos:" -ForegroundColor Cyan
Write-Host "1. Faça commit das alterações: git add . && git commit -m 'Preparar para deploy'" -ForegroundColor White
Write-Host "2. Envie para o GitHub: git push origin main" -ForegroundColor White
Write-Host "3. Siga o guia em DEPLOY-RENDER.md" -ForegroundColor White
