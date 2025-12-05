# 🚀 Deploy Manual no Render - Guia Rápido

Se você encontrou o erro "no such file or directory" com o Blueprint, siga este guia para deploy manual.

## ❌ Erro Comum

```
error: failed to solve: failed to read dockerfile: open Dockerfile: no such file or directory
```

**Causa:** O Blueprint pode tentar usar Docker quando deveria usar Node.js diretamente.

## ✅ Solução: Deploy Manual

### 1️⃣ Deploy do Backend

1. **Acesse:** https://dashboard.render.com
2. **Clique:** New + → Web Service
3. **Conecte:** Seu repositório GitHub (Romeiros-ux/Biblioteca-Saquarema)
4. **Configure:**

   ```
   Name:              biblioteca-api
   Region:            Oregon (US West)
   Branch:            main
   Root Directory:    backend
   Runtime:           Node
   Build Command:     npm install
   Start Command:     npm start
   Instance Type:     Free
   ```

5. **Adicione Variáveis de Ambiente:**

   ```env
   NODE_ENV=production
   PORT=10000
   SUPABASE_URL=https://jilwzfxlroenxsdyjhsd.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppbHd6Znhscm9lbnhzZHlqaHNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4NTQ4NjcsImV4cCI6MjA4MDQzMDg2N30.YsI1DNpEuork1AmTs9ZAQj-H03Rv430WGxO4Ako4V0E
   JWT_SECRET=biblioteca-saquarema-secret-key-2025-super-segura
   CORS_ORIGIN=https://biblioteca-saquarema.onrender.com
   ```

6. **Clique:** Create Web Service
7. **Aguarde:** 3-5 minutos para build completar

### 2️⃣ Deploy do Frontend

1. **No Dashboard:** New + → Static Site
2. **Conecte:** Mesmo repositório
3. **Configure:**

   ```
   Name:              biblioteca-frontend
   Branch:            main
   Root Directory:    frontend
   Build Command:     npm install && npm run build
   Publish Directory: dist
   ```

4. **Adicione Variável de Ambiente:**

   Após o backend estar pronto, anote a URL (ex: `https://biblioteca-api.onrender.com`)

   ```env
   VITE_API_URL=https://biblioteca-api.onrender.com/api
   ```

5. **Clique:** Create Static Site
6. **Aguarde:** 2-4 minutos para build completar

### 3️⃣ Atualizar CORS no Backend

Depois que o frontend estiver pronto:

1. Anote a URL do frontend (ex: `https://biblioteca-saquarema.onrender.com`)
2. Vá no backend → Environment
3. Atualize `CORS_ORIGIN` com a URL real do frontend
4. Salve (o serviço reiniciará automaticamente)

## ✅ Verificar Deploy

### Backend
```bash
curl https://biblioteca-api.onrender.com/health
```

Deve retornar:
```json
{"status":"ok","timestamp":"..."}
```

### Frontend
Acesse: `https://biblioteca-frontend.onrender.com`

Deve carregar a tela de login.

## 🔧 Troubleshooting

### Backend não inicia
1. Verifique logs: Dashboard → biblioteca-api → Logs
2. Confirme variáveis de ambiente
3. Teste conexão com Supabase

### Frontend não conecta ao backend
1. Verifique `VITE_API_URL` no frontend
2. Verifique `CORS_ORIGIN` no backend
3. Teste endpoint: `/health`

### Erro 404 ao navegar
1. Verifique se há rewrite rule configurada
2. No Dashboard do frontend: Settings → Redirects/Rewrites
3. Adicione:
   - Source: `/*`
   - Destination: `/index.html`
   - Action: `Rewrite`

## 📊 Status Final

Após completar, você terá:

- ✅ Backend: `https://biblioteca-api.onrender.com`
- ✅ Frontend: `https://biblioteca-frontend.onrender.com`
- ✅ Health Check: Funcionando
- ✅ Login: Operacional

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
