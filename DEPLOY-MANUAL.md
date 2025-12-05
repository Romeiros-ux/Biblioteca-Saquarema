# 🚀 Deploy Único no Render - Backend + Frontend

Sistema configurado para rodar em **um único serviço** no Render.

## ✨ Vantagens

- ✅ Apenas 1 serviço no Render (mais simples)
- ✅ Sem problemas de CORS (mesmo domínio)
- ✅ URLs relativas (frontend chama `/api`)
- ✅ Mais rápido (menos latência)
- ✅ Mais barato (1 instância gratuita)

## 🚀 Deploy Manual

### 1️⃣ Criar Web Service Único

1. **Acesse:** https://dashboard.render.com
2. **Clique:** New + → Web Service
3. **Conecte:** Seu repositório GitHub (Romeiros-ux/Biblioteca-Saquarema)
4. **Configure:**

   ```
   Name:              biblioteca-saquarema
   Region:            Oregon (US West)
   Branch:            main
   Root Directory:    (deixe vazio - raiz do projeto)
   Runtime:           Node
   Build Command:     cd backend && npm install && cd ../frontend && npm ci && npm run build
   Start Command:     cd backend && npm start
   Instance Type:     Free
   ```

5. **Adicione Variáveis de Ambiente:**

   ```env
   NODE_ENV=production
   PORT=10000
   SUPABASE_URL=https://jilwzfxlroenxsdyjhsd.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppbHd6Znhscm9lbnhzZHlqaHNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4NTQ4NjcsImV4cCI6MjA4MDQzMDg2N30.YsI1DNpEuork1AmTs9ZAQj-H03Rv430WGxO4Ako4V0E
   SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppbHd6Znhscm9lbnhzZHlqaHNkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDg1NDg2NywiZXhwIjoyMDgwNDMwODY3fQ.aCU4f8FT_2HG7sLWUZ_0_iq_-O_zd04UwAzqCLpGWRc
   JWT_SECRET=biblioteca-saquarema-secret-key-2025-super-segura
   VITE_API_URL=/api
   ```
   
   ⚠️ **Importante sobre as chaves:**
   - `SUPABASE_ANON_KEY`: Chave pública (segura para expor no frontend)
   - `SUPABASE_SERVICE_KEY`: Chave administrativa (NUNCA expor! Apenas backend)
   - A SERVICE_KEY é necessária para operações de importação (bypass RLS)

   ⚠️ **Importante:** `VITE_API_URL=/api` é URL relativa (não precisa especificar domínio)

6. **Clique:** Create Web Service
7. **Aguarde:** 5-7 minutos para build completar (faz build do frontend + backend)

## ✅ Verificar Deploy

### Health Check
```bash
curl https://biblioteca-saquarema.onrender.com/health
```

Deve retornar:
```json
{"status":"ok","timestamp":"..."}
```

### Frontend
Acesse: `https://biblioteca-saquarema.onrender.com`

Deve carregar a tela de login.

### API
Acesse: `https://biblioteca-saquarema.onrender.com/api`

Deve retornar JSON com mensagem de erro (esperado, é a rota raiz da API).

## 🔧 Troubleshooting

### Build falha
1. Verifique logs no Dashboard
2. Confirme que `VITE_API_URL=/api` está configurado
3. Tente Clear Build Cache e rebuild

### Servidor não inicia
1. Verifique logs: Dashboard → biblioteca-saquarema → Logs
2. Confirme variáveis de ambiente do Supabase
3. Teste conexão com Supabase

### Frontend não carrega
1. Verifique se o build completou: logs devem mostrar "npm run build --prefix frontend"
2. Verifique se pasta `frontend/dist` foi criada
3. Tente rebuild forçado

### API retorna 404
1. Confirme que está acessando `/api/...` e não apenas `/`
2. Verifique logs do servidor
3. Teste `/health` primeiro

## 📊 Status Final

Após completar, você terá **1 único serviço**:

- ✅ Sistema: `https://biblioteca-saquarema.onrender.com`
- ✅ Frontend: `https://biblioteca-saquarema.onrender.com`
- ✅ API: `https://biblioteca-saquarema.onrender.com/api`
- ✅ Health: `https://biblioteca-saquarema.onrender.com/health`

## 🔄 Próximos Deploy

Após o primeiro deploy manual, os próximos serão automáticos:

```bash
git add .
git commit -m "Atualização"
git push origin main
```

O Render detectará e fará deploy automaticamente! 🎉

---

**Tempo estimado:** 10-15 minutos
**Custo:** $0 (plano gratuito)
