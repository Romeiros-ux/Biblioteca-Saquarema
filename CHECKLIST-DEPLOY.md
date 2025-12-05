# ✅ Checklist de Deploy - Sistema Biblioteca

Use este checklist para garantir um deploy bem-sucedido no Render.

## 📋 Pré-Deploy

### Código e Repositório
- [ ] Todas as alterações foram testadas localmente
- [ ] Build do frontend funciona: `cd frontend && npm run build`
- [ ] Backend inicia sem erros: `cd backend && npm start`
- [ ] Não há erros no console do navegador
- [ ] Testes passando (se houver)
- [ ] Código commitado no Git
- [ ] Push feito para o GitHub (branch `main`)

### Supabase
- [ ] Projeto criado no Supabase
- [ ] Banco de dados populado com `schema.sql`
- [ ] Dados iniciais inseridos com `seed.sql`
- [ ] URL do projeto anotada
- [ ] Chave `anon/public` anotada
- [ ] Chave `service_role` anotada (opcional)
- [ ] RLS (Row Level Security) configurado corretamente
- [ ] Tabelas criadas sem erros

### Arquivos de Configuração
- [ ] `render.yaml` presente na raiz do projeto
- [ ] `backend/.env.production` criado
- [ ] `frontend/.env.production` criado
- [ ] `frontend/vite.config.js` atualizado
- [ ] `.gitignore` não está ignorando arquivos necessários

---

## 🚀 Deploy no Render

### Criar Conta e Conectar GitHub
- [ ] Conta criada no Render (https://render.com)
- [ ] GitHub conectado ao Render
- [ ] Repositório autorizado no Render

### Criar Blueprint
- [ ] Acessou: **New +** → **Blueprint**
- [ ] Selecionou o repositório correto
- [ ] Render detectou o `render.yaml`
- [ ] Clicou em: **Apply**
- [ ] Dois serviços foram criados:
  - [ ] `biblioteca-api` (Web Service)
  - [ ] `biblioteca-frontend` (Static Site)

### Configurar Backend (`biblioteca-api`)
- [ ] Acessou o serviço no Dashboard
- [ ] Foi em: **Environment**
- [ ] Adicionou variável: `NODE_ENV=production`
- [ ] Adicionou variável: `PORT=10000`
- [ ] Adicionou variável: `SUPABASE_URL=<sua_url>`
- [ ] Adicionou variável: `SUPABASE_ANON_KEY=<sua_chave>`
- [ ] Gerou e adicionou: `JWT_SECRET=<chave_forte>`
- [ ] Adicionou variável: `CORS_ORIGIN=https://biblioteca-saquarema.onrender.com`
- [ ] Salvou as configurações

**Gerar JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Configurar Frontend (`biblioteca-frontend`)
- [ ] Acessou o serviço no Dashboard
- [ ] Foi em: **Environment**
- [ ] Adicionou variável: `VITE_API_URL=https://biblioteca-api.onrender.com/api`
- [ ] Salvou as configurações

### Iniciar Deploy
- [ ] Clicou em: **Manual Deploy** no backend
- [ ] Clicou em: **Deploy latest commit** no backend
- [ ] Aguardou build do backend (3-5 minutos)
- [ ] Backend mostra status: **Live**
- [ ] Clicou em: **Manual Deploy** no frontend
- [ ] Clicou em: **Deploy latest commit** no frontend
- [ ] Aguardou build do frontend (2-4 minutos)
- [ ] Frontend mostra status: **Live**

---

## 🧪 Testes Pós-Deploy

### Verificar Backend
- [ ] Acessou: https://biblioteca-api.onrender.com/health
- [ ] Resposta: `{"status":"ok","timestamp":"..."}`
- [ ] Não há erros nos logs do backend

**Comando para testar:**
```bash
curl https://biblioteca-api.onrender.com/health
```

### Verificar Frontend
- [ ] Acessou: https://biblioteca-saquarema.onrender.com
- [ ] Página carrega corretamente
- [ ] CSS e imagens aparecem
- [ ] Não há erros no console (F12)

### Testar Login
- [ ] Acessou a página de login
- [ ] Tentou login com:
  - Email: `admin@biblioteca.com`
  - Senha: `admin123`
- [ ] Login bem-sucedido
- [ ] Redirecionou para o Dashboard
- [ ] Token salvo no localStorage

### Testar Navegação
- [ ] Menu lateral abre/fecha
- [ ] Navegou para: **Dashboard** ✅
- [ ] Navegou para: **Catálogo** ✅
- [ ] Navegou para: **Circulação** ✅
- [ ] Navegou para: **Usuários** ✅
- [ ] Navegou para: **Relatórios** ✅
- [ ] Navegou para: **Configurações** ✅
- [ ] Navegou para: **Importar Livros** ✅
- [ ] Todas as páginas carregam sem erros

### Testar Funcionalidades Principais
- [ ] **Catálogo:** Lista de livros carrega
- [ ] **Circulação:** Empréstimos aparecem
- [ ] **Usuários:** Lista de usuários carrega
- [ ] **Configurações:** Funcionários listados
- [ ] **Import:** Upload de arquivo funciona

### Testar em Dispositivos Móveis
- [ ] Abriu DevTools (F12)
- [ ] Ativou modo responsivo
- [ ] Testou em: iPhone SE (375px)
- [ ] Testou em: iPad (768px)
- [ ] Testou em: Desktop (1920px)
- [ ] Layout responsivo funcionando
- [ ] Sidebar colapsa em mobile
- [ ] Botões acessíveis em telas pequenas

---

## 🔍 Troubleshooting

### Erro de CORS
- [ ] Verificou `CORS_ORIGIN` no backend
- [ ] Verificou se não tem `/` no final da URL
- [ ] Reiniciou o backend após alterar variável

### Frontend não conecta ao Backend
- [ ] Verificou `VITE_API_URL` no frontend
- [ ] Testou URL do backend: `/health`
- [ ] Verificou logs do backend
- [ ] Rebuild do frontend após alterar variável

### Erro 500 no Backend
- [ ] Verificou logs no Render Dashboard
- [ ] Confirmou variáveis do Supabase corretas
- [ ] Testou conexão com Supabase localmente

### Build do Frontend Falha
- [ ] Verificou logs de build no Render
- [ ] Testou build local: `npm run build`
- [ ] Verificou se todas as deps estão no `package.json`
- [ ] Limpou cache: **Settings** → **Clear build cache**

---

## 📊 Monitoramento

### Configurar Alertas (Opcional)
- [ ] Configurou Uptime Robot ou similar
- [ ] Endpoint monitorado: `/health`
- [ ] Intervalo: 5 minutos
- [ ] Email de alerta configurado

### Keep-Alive (Evitar Sleep)
- [ ] Configurou cron-job.org (opcional)
- [ ] URL: https://biblioteca-api.onrender.com/health
- [ ] Frequência: a cada 10 minutos
- [ ] Horário: 6h às 22h

---

## 📝 Documentação

### Atualizar URLs
- [ ] Anotou URL da API: `https://biblioteca-api.onrender.com`
- [ ] Anotou URL do Frontend: `https://biblioteca-saquarema.onrender.com`
- [ ] Compartilhou URLs com a equipe
- [ ] Atualizou documentação interna

### Backup
- [ ] Documentou variáveis de ambiente
- [ ] Fez backup do Supabase
- [ ] Salvou credenciais em local seguro
- [ ] Anotou versão deployada

---

## 🎉 Conclusão

### Deploy Finalizado
- [ ] Todos os testes passaram ✅
- [ ] Sistema funcionando em produção ✅
- [ ] Equipe notificada ✅
- [ ] Documentação atualizada ✅

### Próximos Passos
- [ ] Monitorar logs nas primeiras 24h
- [ ] Treinar usuários finais
- [ ] Coletar feedback
- [ ] Planejar melhorias

---

## 📞 Suporte

**Documentação:**
- [DEPLOY-RENDER.md](./DEPLOY-RENDER.md) - Guia completo
- [COMANDOS-DEPLOY.md](./COMANDOS-DEPLOY.md) - Comandos úteis
- [DEPLOY-FILES.md](./DEPLOY-FILES.md) - Arquivos de configuração

**Links Úteis:**
- Render Docs: https://render.com/docs
- Supabase Docs: https://supabase.com/docs
- Render Status: https://status.render.com

---

**Data do Deploy:** ___________________  
**Responsável:** ___________________  
**Versão:** ___________________  

✅ **Status Final:** [ ] Aprovado para Produção
