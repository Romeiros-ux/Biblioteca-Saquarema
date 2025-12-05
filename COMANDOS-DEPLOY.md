# 🛠️ Comandos Úteis para Deploy

## Testar Build Localmente

### Windows (PowerShell)
```powershell
.\test-build.ps1
```

### Linux/Mac
```bash
chmod +x test-build.sh
./test-build.sh
```

## Gerar JWT Secret

### Node.js
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### PowerShell
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | ForEach-Object {[char]$_})
```

### Linux/Mac
```bash
openssl rand -hex 64
```

## Git - Preparar para Deploy

### Verificar status
```bash
git status
```

### Adicionar todos os arquivos
```bash
git add .
```

### Commit
```bash
git commit -m "Preparar para deploy no Render"
```

### Push para GitHub
```bash
git push origin main
```

## Verificar Saúde da API

### cURL
```bash
curl https://biblioteca-api.onrender.com/health
```

### PowerShell
```powershell
Invoke-RestMethod -Uri "https://biblioteca-api.onrender.com/health"
```

### Navegador
```
https://biblioteca-api.onrender.com/health
```

## Testar Endpoints da API

### Login
```bash
curl -X POST https://biblioteca-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@biblioteca.com","password":"admin123"}'
```

### Health Check com JSON formatado
```bash
curl https://biblioteca-api.onrender.com/health | json_pp
```

## Logs do Render (via CLI)

### Instalar Render CLI
```bash
npm install -g @render-tools/cli
```

### Ver logs em tempo real
```bash
render logs -s biblioteca-api
render logs -s biblioteca-frontend
```

## Build Local do Frontend

### Desenvolvimento
```bash
cd frontend
npm run dev
```

### Build de Produção
```bash
cd frontend
npm run build
```

### Preview da Build
```bash
cd frontend
npm run preview
```

## Verificar Variáveis de Ambiente

### Backend (local)
```bash
cd backend
cat .env
```

### Frontend (local)
```bash
cd frontend
cat .env.production
```

## Limpar e Reinstalar Dependências

### Backend
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Frontend
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## Verificar Versões

### Node.js
```bash
node --version
```

### npm
```bash
npm --version
```

### Git
```bash
git --version
```

## Atualizar Dependências

### Verificar atualizações disponíveis
```bash
cd backend
npm outdated

cd ../frontend
npm outdated
```

### Atualizar todas (cuidado!)
```bash
npm update
```

## Render Dashboard URLs

- **Dashboard Principal:** https://dashboard.render.com
- **Blueprints:** https://dashboard.render.com/blueprints
- **Web Services:** https://dashboard.render.com/web-services
- **Static Sites:** https://dashboard.render.com/static-sites

## Supabase Dashboard

- **Projetos:** https://app.supabase.com/projects
- **API Settings:** https://app.supabase.com/project/_/settings/api

## Monitoramento e Debugging

### Ver logs do backend (Render)
1. Acessar: https://dashboard.render.com
2. Selecionar: `biblioteca-api`
3. Clicar em: **Logs**

### Ver logs do frontend (Render)
1. Acessar: https://dashboard.render.com
2. Selecionar: `biblioteca-frontend`
3. Clicar em: **Logs**

### Inspecionar no navegador
1. Abrir: https://biblioteca-saquarema.onrender.com
2. Pressionar: **F12**
3. Ver: Console, Network, Application

## Rollback (Reverter Deploy)

### Via Dashboard
1. Acessar serviço no Render
2. Ir em: **Events**
3. Encontrar deploy anterior
4. Clicar em: **Rollback to this deploy**

### Via Git
```bash
# Ver histórico de commits
git log --oneline

# Reverter para commit anterior
git revert HEAD

# Push
git push origin main
```

## Manutenção

### Limpar cache do Render
1. Acessar serviço no Dashboard
2. Ir em: **Settings**
3. Clicar em: **Clear build cache**
4. Fazer novo deploy

### Reiniciar serviço
1. Acessar serviço no Dashboard
2. Clicar em: **Manual Deploy**
3. Selecionar: **Clear build cache & deploy**

## Dicas de Performance

### Otimizar build do frontend
```bash
cd frontend
npm run build -- --minify
```

### Analisar tamanho da build
```bash
cd frontend
npm install -D rollup-plugin-visualizer
npm run build
```

### Comprimir assets
- O Render faz compressão gzip automaticamente
- Use imagens otimizadas (WebP, AVIF)
- Minimize CSS e JS

## Segurança

### Verificar vulnerabilidades
```bash
npm audit
```

### Corrigir automaticamente
```bash
npm audit fix
```

### Corrigir forçadamente (cuidado!)
```bash
npm audit fix --force
```

## Backup

### Exportar banco de dados (Supabase)
1. Acessar: Supabase Dashboard
2. Ir em: **Database** → **Backups**
3. Clicar em: **Download backup**

### Exportar código
```bash
git clone https://github.com/seu-usuario/biblioteca-saquarema.git backup-$(date +%Y%m%d)
```

---

**Última atualização:** Dezembro 2025
