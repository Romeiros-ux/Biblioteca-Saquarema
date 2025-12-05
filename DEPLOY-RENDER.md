# 🚀 Guia de Deploy no Render

Este guia explica como fazer o deploy do Sistema de Biblioteca no Render.

## 📋 Pré-requisitos

1. Conta no [Render](https://render.com) (gratuita)
2. Conta no [GitHub](https://github.com)
3. Repositório do projeto no GitHub
4. Banco de dados Supabase configurado

## 🎯 Método 1: Deploy Automático com render.yaml (RECOMENDADO)

### Passo 1: Preparar o Repositório

1. Certifique-se de que todos os arquivos estão commitados:
```bash
git add .
git commit -m "Preparar para deploy no Render"
git push origin main
```

### Passo 2: Criar Blueprint no Render

1. Acesse [Render Dashboard](https://dashboard.render.com)
2. Clique em **"New +"** → **"Blueprint"**
3. Conecte seu repositório GitHub
4. O Render detectará automaticamente o arquivo `render.yaml`
5. Clique em **"Apply"**

### Passo 3: Configurar Variáveis de Ambiente

O Render criará dois serviços automaticamente:
- `biblioteca-api` (Backend)
- `biblioteca-frontend` (Frontend)

#### Configurar Backend (`biblioteca-api`):

1. Acesse o serviço `biblioteca-api` no Dashboard
2. Vá em **"Environment"**
3. Adicione/verifique as variáveis:

```env
NODE_ENV=production
PORT=10000
SUPABASE_URL=sua_url_do_supabase
SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
JWT_SECRET=gere_uma_chave_secreta_forte
CORS_ORIGIN=https://biblioteca-saquarema.onrender.com
```

**Para gerar JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

#### Configurar Frontend (`biblioteca-frontend`):

1. Acesse o serviço `biblioteca-frontend` no Dashboard
2. Vá em **"Environment"**
3. Adicione:

```env
VITE_API_URL=https://biblioteca-api.onrender.com/api
```

### Passo 4: Deploy

1. Clique em **"Manual Deploy"** → **"Deploy latest commit"** em cada serviço
2. Aguarde a build (5-10 minutos)
3. Acesse as URLs geradas:
   - Backend: `https://biblioteca-api.onrender.com`
   - Frontend: `https://biblioteca-saquarema.onrender.com`

---

## 🎯 Método 2: Deploy Manual (Alternativo)

### Criar Backend Manualmente

1. No Render Dashboard, clique em **"New +"** → **"Web Service"**
2. Conecte seu repositório GitHub
3. Configure:
   - **Name:** `biblioteca-api`
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** `Free`

4. Adicione variáveis de ambiente (igual ao Método 1)
5. Clique em **"Create Web Service"**

### Criar Frontend Manualmente

1. No Render Dashboard, clique em **"New +"** → **"Static Site"**
2. Conecte seu repositório GitHub
3. Configure:
   - **Name:** `biblioteca-frontend`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`

4. Adicione variável de ambiente:
   - `VITE_API_URL=https://biblioteca-api.onrender.com/api`

5. Clique em **"Create Static Site"**

---

## 🔧 Configurações Importantes

### CORS no Backend

O backend já está configurado para aceitar requisições do frontend em produção:

```javascript
// backend/src/server.js
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
```

### Variáveis de Ambiente do Supabase

Para obter as credenciais do Supabase:

1. Acesse [Supabase Dashboard](https://app.supabase.com)
2. Selecione seu projeto
3. Vá em **Settings** → **API**
4. Copie:
   - **URL** (Project URL)
   - **anon/public** key

---

## 🧪 Testar o Deploy

### 1. Verificar Health Check do Backend

```bash
curl https://biblioteca-api.onrender.com/health
```

Resposta esperada:
```json
{
  "status": "ok",
  "timestamp": "2025-12-05T12:00:00.000Z"
}
```

### 2. Testar Login

Acesse o frontend e tente fazer login com:
- Email: `admin@biblioteca.com`
- Senha: `admin123`

### 3. Verificar Console do Navegador

Abra as **DevTools** (F12) e verifique se não há erros de CORS ou conexão.

---

## 🚨 Troubleshooting

### Problema: Erro de CORS

**Solução:**
1. Verifique se `CORS_ORIGIN` no backend aponta para a URL correta do frontend
2. Certifique-se de que não tem barra `/` no final da URL

### Problema: Frontend não conecta ao Backend

**Solução:**
1. Verifique se `VITE_API_URL` no frontend está correto
2. Teste a URL do backend manualmente: `https://biblioteca-api.onrender.com/health`
3. Verifique os logs do backend no Render Dashboard

### Problema: Erro 500 no Backend

**Solução:**
1. Acesse **Logs** no Render Dashboard do backend
2. Verifique se as variáveis de ambiente do Supabase estão corretas
3. Teste a conexão com o Supabase localmente primeiro

### Problema: Build do Frontend Falha

**Solução:**
1. Verifique se `VITE_API_URL` está definido antes do build
2. Teste o build localmente: `cd frontend && npm run build`
3. Verifique se todas as dependências estão no `package.json`

---

## 📊 Monitoramento

### Logs em Tempo Real

1. Acesse o serviço no Render Dashboard
2. Clique em **"Logs"**
3. Os logs são atualizados em tempo real

### Métricas

- **Request Rate:** Número de requisições por segundo
- **Response Time:** Tempo médio de resposta
- **Error Rate:** Taxa de erros

---

## 🔄 Atualizações

### Deploy Automático

Por padrão, o Render faz deploy automático quando você faz push para a branch `main`:

```bash
git add .
git commit -m "Nova funcionalidade"
git push origin main
```

### Deploy Manual

1. Acesse o serviço no Render Dashboard
2. Clique em **"Manual Deploy"**
3. Selecione **"Deploy latest commit"**

---

## 💰 Plano Gratuito do Render

### Limitações:
- ⚠️ **Serviços dormem após 15 minutos de inatividade**
- ⏱️ **Primeira requisição pode levar 30-60 segundos para "acordar"**
- 📦 **750 horas/mês gratuitas por serviço**
- 💾 **Sem persistência de arquivos** (use Supabase Storage se necessário)

### Dica: Evitar que o serviço durma
Você pode usar serviços como [cron-job.org](https://cron-job.org) para fazer requisições periódicas ao endpoint `/health` a cada 10 minutos.

---

## 🎉 Deploy Completo!

Após seguir estes passos, seu sistema estará online e acessível em:

- **Frontend:** https://biblioteca-saquarema.onrender.com
- **Backend API:** https://biblioteca-api.onrender.com

---

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs no Render Dashboard
2. Teste as variáveis de ambiente
3. Revise a documentação do Render: https://render.com/docs
4. Verifique a conexão com o Supabase

---

## ✅ Checklist de Deploy

- [ ] Código commitado e enviado ao GitHub
- [ ] Banco de dados Supabase configurado
- [ ] Variáveis de ambiente do backend configuradas
- [ ] Variável VITE_API_URL do frontend configurada
- [ ] Deploy realizado com sucesso
- [ ] Health check do backend funcionando
- [ ] Frontend carregando corretamente
- [ ] Login funcionando
- [ ] Todas as páginas acessíveis
- [ ] Import de livros testado (opcional)

---

**Última atualização:** Dezembro 2025
