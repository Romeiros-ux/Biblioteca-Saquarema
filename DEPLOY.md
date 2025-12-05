# 🚀 Guia de Deploy no Render

Este guia fornece instruções passo a passo para fazer o deploy do Sistema de Biblioteca no Render.

## 📋 Pré-requisitos

1. Conta no [Render](https://render.com) (gratuita)
2. Conta no [Supabase](https://supabase.com) (gratuita)
3. Repositório Git (GitHub, GitLab ou Bitbucket)
4. Banco de dados configurado no Supabase

## 🗄️ Passo 1: Configurar o Supabase

### 1.1. Criar Projeto
1. Acesse [supabase.com](https://supabase.com)
2. Clique em **New Project**
3. Preencha os dados e aguarde a criação

### 1.2. Executar Schema SQL
1. No painel do Supabase, vá em **SQL Editor**
2. Clique em **New Query**
3. Cole o conteúdo de `database/schema.sql`
4. Execute o script
5. Repita com `database/seed.sql` para dados de exemplo

### 1.3. Obter Credenciais
Vá em **Settings > API** e anote:
- **Project URL** (SUPABASE_URL)
- **anon/public key** (SUPABASE_KEY)
- **service_role key** (SUPABASE_SERVICE_KEY)

## 🔧 Passo 2: Deploy do Backend

### 2.1. Criar Web Service
1. No Render, clique em **New +** > **Web Service**
2. Conecte seu repositório Git
3. Configure:

**Configurações Básicas:**
```
Name: biblioteca-backend
Region: Oregon (US West)
Branch: main
Root Directory: backend
```

**Build & Deploy:**
```
Runtime: Node
Build Command: npm install
Start Command: npm start
```

### 2.2. Adicionar Variáveis de Ambiente
Clique em **Environment** e adicione:

```
NODE_ENV=production
PORT=3001
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_KEY=sua-chave-anonima
SUPABASE_SERVICE_KEY=sua-chave-service-role
JWT_SECRET=sua-chave-secreta-super-segura-minimo-32-caracteres
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://seu-frontend.onrender.com
```

⚠️ **Importante:** Substitua os valores com suas credenciais reais!

### 2.3. Deploy
1. Clique em **Create Web Service**
2. Aguarde o build e deploy (pode levar alguns minutos)
3. Anote a URL do backend (ex: `https://biblioteca-backend.onrender.com`)

## 🎨 Passo 3: Deploy do Frontend

### 3.1. Criar Static Site
1. No Render, clique em **New +** > **Static Site**
2. Conecte o mesmo repositório
3. Configure:

**Configurações Básicas:**
```
Name: biblioteca-frontend
Region: Oregon (US West)
Branch: main
Root Directory: frontend
```

**Build Settings:**
```
Build Command: npm install && npm run build
Publish Directory: dist
```

### 3.2. Adicionar Variáveis de Ambiente
Clique em **Environment** e adicione:

```
VITE_API_URL=https://biblioteca-backend.onrender.com/api
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_KEY=sua-chave-anonima
```

⚠️ **Importante:** Use a URL do backend criado no Passo 2.3!

### 3.3. Deploy
1. Clique em **Create Static Site**
2. Aguarde o build e deploy
3. Sua aplicação estará disponível em `https://biblioteca-frontend.onrender.com`

## 🔒 Passo 4: Atualizar CORS

Após obter a URL do frontend, volte ao backend:

1. Acesse o backend no Render
2. Vá em **Environment**
3. Atualize `CORS_ORIGIN` com a URL do frontend:
   ```
   CORS_ORIGIN=https://biblioteca-frontend.onrender.com
   ```
4. Salve e aguarde o redeploy automático

## ✅ Passo 5: Testar a Aplicação

1. Acesse a URL do frontend
2. Faça login com:
   - **Email:** `admin@biblioteca.com`
   - **Senha:** `admin123`
3. ⚠️ **Altere a senha padrão imediatamente!**

## 🆓 Plano Gratuito do Render

### Limitações
- Backend hiberna após 15 minutos de inatividade
- Pode levar 30-60 segundos para "acordar"
- 750 horas/mês de uso gratuito

### Otimizações
Para manter o serviço ativo, você pode:
1. Usar um serviço de ping (ex: UptimeRobot)
2. Fazer upgrade para plano pago ($7/mês)

## 🔄 Redeploy (Atualizar)

### Método 1: Git Push
```bash
git add .
git commit -m "Atualização"
git push origin main
```
O Render fará o deploy automaticamente.

### Método 2: Manual
1. Acesse o serviço no Render
2. Clique em **Manual Deploy** > **Deploy latest commit**

## 🐛 Troubleshooting

### Backend não inicia
- Verifique os logs em **Logs** no painel do Render
- Confirme que todas as variáveis de ambiente estão corretas
- Verifique se o Supabase está acessível

### Frontend não carrega
- Verifique se `VITE_API_URL` aponta para o backend correto
- Teste a URL do backend diretamente: `https://seu-backend.onrender.com/health`
- Limpe o cache do navegador

### Erro CORS
- Confirme que `CORS_ORIGIN` no backend tem a URL correta do frontend
- Não use trailing slash: ❌ `https://app.com/` ✅ `https://app.com`

### Banco de dados não conecta
- Verifique as credenciais do Supabase
- Teste a conexão no SQL Editor do Supabase
- Confirme que o schema foi executado corretamente

## 📊 Monitoramento

### Logs
- Acesse o painel do Render
- Vá em **Logs** para ver logs em tempo real
- Use para debugar problemas

### Métricas
- **Events** mostra histórico de deploys
- **Metrics** mostra uso de recursos (apenas planos pagos)

## 🔐 Segurança

### Recomendações
1. ✅ Use senhas fortes para JWT_SECRET (mínimo 32 caracteres)
2. ✅ Altere a senha do admin padrão
3. ✅ Configure RLS (Row Level Security) no Supabase
4. ✅ Use HTTPS apenas (Render fornece automaticamente)
5. ✅ Rotacione as chaves regularmente

### Variáveis Sensíveis
⚠️ **NUNCA commite:**
- `.env` (adicione ao `.gitignore`)
- Chaves do Supabase
- JWT_SECRET

## 💰 Custos Estimados

### Gratuito
- **Render:** 750h/mês (suficiente para 1 serviço 24/7)
- **Supabase:** 500MB de banco + 1GB de storage
- **Total:** R$ 0,00/mês

### Produção Recomendada
- **Render Pro:** $7/mês por serviço
- **Supabase Pro:** $25/mês
- **Total:** ~$39/mês (~R$ 195/mês)

## 🎉 Conclusão

Parabéns! Seu sistema de biblioteca está no ar! 🚀

### Próximos Passos
1. Configure um domínio customizado (ex: `biblioteca.suaescola.com.br`)
2. Configure backups automáticos no Supabase
3. Adicione monitoramento (Sentry, LogRocket)
4. Configure notificações por email

---

**Dúvidas?** Abra uma issue no GitHub ou consulte a documentação:
- [Render Docs](https://render.com/docs)
- [Supabase Docs](https://supabase.com/docs)
