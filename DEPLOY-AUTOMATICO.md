# 🔄 Deploy Automático no Render

Este documento explica como funciona o deploy automático e como gerenciar atualizações.

## 🤖 Deploy Automático Configurado

Por padrão, o Render está configurado para fazer **deploy automático** sempre que você fizer push para a branch `main`.

### Como Funciona

1. Você faz alterações no código
2. Commita e faz push para o GitHub:
   ```bash
   git add .
   git commit -m "Descrição da alteração"
   git push origin main
   ```
3. O Render detecta automaticamente o push
4. Inicia o build e deploy dos serviços alterados
5. Em 3-5 minutos, as alterações estão em produção

### Webhook Configurado

O Render cria automaticamente um webhook no seu repositório GitHub:
- **Evento:** Push para branch `main`
- **Ação:** Trigger deploy automático
- **Status:** Ativo ✅

## 🎛️ Controlar Deploy Automático

### Desabilitar Deploy Automático

Se preferir fazer deploys manualmente:

1. Acesse o serviço no Render Dashboard
2. Vá em: **Settings**
3. Procure: **Auto-Deploy**
4. Desabilite: **Auto-Deploy on Push**
5. Salve as alterações

Agora você precisará clicar em **"Manual Deploy"** sempre que quiser atualizar.

### Habilitar Deploy Automático

Para reativar:

1. Acesse: **Settings**
2. Habilite: **Auto-Deploy on Push**
3. Selecione a branch: `main`
4. Salve

## 🌿 Deploy de Branches Específicas

### Criar Ambiente de Staging

Para ter um ambiente de testes separado:

1. Crie uma branch de staging:
   ```bash
   git checkout -b staging
   git push origin staging
   ```

2. No Render, crie novos serviços:
   - Nome: `biblioteca-api-staging`
   - Branch: `staging`
   - Auto-Deploy: Habilitado

3. Configure variáveis separadas (pode usar banco de testes)

4. Agora você tem:
   - **Produção:** `main` → `biblioteca-api.onrender.com`
   - **Staging:** `staging` → `biblioteca-api-staging.onrender.com`

### Workflow Recomendado

```bash
# Desenvolvimento
git checkout -b feature/nova-funcionalidade
# ... faz alterações ...
git commit -m "Adiciona nova funcionalidade"

# Merge para staging (testes)
git checkout staging
git merge feature/nova-funcionalidade
git push origin staging
# Deploy automático para staging

# Testa em staging, se OK:
git checkout main
git merge staging
git push origin main
# Deploy automático para produção
```

## 🔒 Deploy com Aprovação

### Configurar Deploy Manual Obrigatório

Para ambientes críticos de produção:

1. Desabilite auto-deploy em **produção**
2. Mantenha auto-deploy em **staging**
3. Workflow:
   - Push para `staging` → Deploy automático
   - Testa no staging
   - Se OK, push para `main` → Deploy MANUAL

## 📦 Versionamento

### Tags de Versão

Recomendado para rastrear versões em produção:

```bash
# Após deploy bem-sucedido
git tag -a v1.0.0 -m "Versão 1.0.0 - Release inicial"
git push origin v1.0.0

# Próxima versão
git tag -a v1.1.0 -m "Versão 1.1.0 - Nova funcionalidade X"
git push origin v1.1.0
```

### Ver Versões Deployadas

No Render Dashboard:
1. Acesse o serviço
2. Vá em: **Events**
3. Veja histórico completo de deploys com commits

## 🚨 Rollback Rápido

### Reverter para Versão Anterior

#### Opção 1: Via Render Dashboard (Mais Rápido)

1. Acesse o serviço
2. Vá em: **Events**
3. Encontre o deploy anterior que funcionava
4. Clique em: **Rollback to this deploy**
5. Confirme
6. Em 1-2 minutos está revertido

#### Opção 2: Via Git

```bash
# Ver histórico
git log --oneline

# Reverter último commit (cria novo commit)
git revert HEAD
git push origin main
# Deploy automático com a reversão

# Ou voltar para commit específico
git revert abc123
git push origin main
```

#### Opção 3: Revert Forçado (Cuidado!)

```bash
# Voltar para commit específico (reescreve histórico)
git reset --hard abc123
git push origin main --force
# Deploy automático
```

⚠️ **Atenção:** `--force` reescreve o histórico do Git. Use apenas se necessário.

## 📊 Monitorar Deploys

### Receber Notificações

Configure notificações no Render:

1. Vá em: **Account Settings** → **Notifications**
2. Habilite:
   - **Deploy Started** ✉️
   - **Deploy Succeeded** ✅
   - **Deploy Failed** ❌
3. Adicione email ou integre com Slack

### Integração com Slack

1. No Slack, crie um Incoming Webhook
2. No Render: **Settings** → **Notifications**
3. Adicione o Webhook URL
4. Escolha eventos para notificar

Você receberá mensagens como:
```
🚀 Deploy iniciado
   Serviço: biblioteca-api
   Commit: "Adiciona nova funcionalidade"
   
✅ Deploy concluído com sucesso
   Duração: 3m 45s
   URL: https://biblioteca-api.onrender.com
```

## 🔐 Variáveis de Ambiente e Deploys

### Alterar Variáveis Sem Rebuild

Algumas variáveis podem ser alteradas sem rebuild:

1. Acesse: **Environment**
2. Altere a variável
3. Clique em: **Save Changes**
4. O serviço reinicia automaticamente (sem rebuild)

### Variáveis que Exigem Rebuild

Variáveis que começam com `VITE_` no frontend exigem rebuild:

1. Altere `VITE_API_URL`
2. Vá em: **Manual Deploy**
3. Clique: **Clear build cache & deploy**

## 🧪 Testar Antes de Deploy

### Build Local

Sempre teste antes de fazer push:

```bash
# Backend
cd backend
npm install
npm start

# Frontend
cd frontend
npm install
npm run build
```

### Script Automático

Use o script fornecido:

```powershell
# Windows
.\test-build.ps1
```

```bash
# Linux/Mac
./test-build.sh
```

Se o script passar, pode fazer push com confiança!

## 📅 Agendar Deploys

### Deploy em Horário Específico

Para deploys em produção fora do horário comercial:

1. Desabilite auto-deploy
2. Faça push para `main` durante o dia
3. À noite/madrugada, acesse Render Dashboard
4. Clique: **Manual Deploy**

### Automação com GitHub Actions (Avançado)

Crie `.github/workflows/deploy.yml`:

```yaml
name: Deploy Agendado
on:
  schedule:
    - cron: '0 2 * * *' # 2h da manhã, todo dia
  workflow_dispatch: # Permite trigger manual

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Trigger Render Deploy
        run: |
          curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK }}
```

Configure o webhook secret no GitHub.

## 🎯 Best Practices

### ✅ Fazer

- Commitar frequentemente com mensagens claras
- Testar localmente antes de fazer push
- Usar branches para features grandes
- Fazer pequenos commits incrementais
- Monitorar logs após cada deploy
- Manter staging sincronizado com produção

### ❌ Evitar

- Fazer push direto para main sem testar
- Commits enormes com muitas alterações
- Alterar múltiplas variáveis de uma vez
- Fazer deploy durante horário de pico
- Ignorar warnings de build
- Não documentar alterações

## 📈 Métricas de Deploy

### Acompanhar no Render

No Dashboard você vê:
- **Deploy Frequency:** Quantos deploys por semana
- **Lead Time:** Tempo do commit até produção
- **Change Failure Rate:** % de deploys que falharam
- **Mean Time to Recovery:** Tempo médio para rollback

### Metas Recomendadas

- **Deploy Frequency:** 1-3x por semana
- **Lead Time:** < 10 minutos
- **Change Failure Rate:** < 5%
- **MTTR:** < 5 minutos

## 🔗 Recursos

- [Render Deploys](https://render.com/docs/deploys)
- [Git Workflows](https://www.atlassian.com/git/tutorials/comparing-workflows)
- [Semantic Versioning](https://semver.org/)

---

**Última atualização:** Dezembro 2025
