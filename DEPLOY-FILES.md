# 📦 Arquivos de Deploy - Resumo

## Arquivos Criados para Deploy no Render

### 1. `render.yaml` (Raiz do projeto)
**Propósito:** Configuração automática de Blueprint no Render
- Define 2 serviços: API (Node.js) e Frontend (Static Site)
- Configura variáveis de ambiente
- Define comandos de build e start

### 2. `backend/.env.production`
**Propósito:** Variáveis de ambiente de produção do backend
- Template para configuração no Render
- Contém placeholders para Supabase e JWT

### 3. `frontend/.env.production`
**Propósito:** Variáveis de ambiente de produção do frontend
- Define URL da API em produção

### 4. `frontend/vite.config.js` (Atualizado)
**Propósito:** Configuração do Vite para produção
- Adiciona suporte a variáveis de ambiente
- Configura build otimizado

### 5. `DEPLOY-RENDER.md`
**Propósito:** Guia completo de deploy
- Instruções passo a passo
- Troubleshooting
- Checklist de deploy

### 6. `test-build.ps1` e `test-build.sh`
**Propósito:** Scripts para testar build localmente
- Valida se o projeto está pronto para deploy
- Mostra tamanho da build

---

## 🚀 Como Usar

### Opção 1: Deploy Rápido (Recomendado)

```bash
# 1. Commit e push
git add .
git commit -m "Preparar para deploy no Render"
git push origin main

# 2. No Render
# - New > Blueprint
# - Selecionar repositório
# - Configurar variáveis de ambiente
# - Deploy!
```

### Opção 2: Testar Antes de Deploy

```powershell
# Windows (PowerShell)
.\test-build.ps1
```

```bash
# Linux/Mac
chmod +x test-build.sh
./test-build.sh
```

---

## 🔑 Variáveis de Ambiente Necessárias

### Backend (biblioteca-api)
```env
NODE_ENV=production
PORT=10000
SUPABASE_URL=sua_url_do_supabase
SUPABASE_ANON_KEY=sua_chave_do_supabase
JWT_SECRET=gere_uma_chave_forte
CORS_ORIGIN=https://biblioteca-saquarema.onrender.com
```

### Frontend (biblioteca-frontend)
```env
VITE_API_URL=https://biblioteca-api.onrender.com/api
```

---

## 📋 Checklist

- [ ] Código commitado no GitHub
- [ ] Supabase configurado
- [ ] `render.yaml` na raiz do projeto
- [ ] Variáveis de ambiente preparadas
- [ ] Build testada localmente (opcional)
- [ ] Blueprint criado no Render
- [ ] Variáveis configuradas no Dashboard
- [ ] Deploy iniciado
- [ ] Testes realizados

---

## 🎯 URLs de Produção

Após o deploy:

- **API:** https://biblioteca-api.onrender.com
- **Frontend:** https://biblioteca-saquarema.onrender.com
- **Health Check:** https://biblioteca-api.onrender.com/health

---

## 📚 Documentação Adicional

- [Guia Completo de Deploy](./DEPLOY-RENDER.md)
- [Documentação do Render](https://render.com/docs)
- [Supabase Docs](https://supabase.com/docs)

---

**Data:** Dezembro 2025
**Status:** Pronto para deploy ✅
