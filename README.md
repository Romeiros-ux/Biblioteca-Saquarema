# 📚 Sistema de Biblioteca

Sistema completo de gestão de bibliotecas desenvolvido com Node.js, React e Supabase, baseado no Biblivre-5.

## 🚀 Tecnologias

### Backend
- **Node.js** 18+ com Express
- **Supabase** (PostgreSQL)
- **JWT** para autenticação
- **Winston** para logs
- **Bcrypt** para criptografia de senhas

### Frontend
- **React** 18+
- **Material-UI** (MUI)
- **Vite** como bundler
- **Zustand** para gerenciamento de estado
- **Axios** para requisições HTTP

### Infraestrutura
- **Docker** & Docker Compose
- **Nginx** (para servir frontend em produção)
- **Render** (deploy)

## 📋 Funcionalidades

### ✅ Catalogação
- Cadastro de registros bibliográficos (MARC21)
- Gestão de exemplares/holdings
- Busca avançada no catálogo
- Controle de autoridades

### ✅ Circulação
- Empréstimo e devolução
- Renovação de empréstimos
- Reservas de materiais
- Controle de multas
- Histórico de empréstimos

### ✅ Usuários
- Cadastro de leitores
- Tipos de usuário configuráveis
- Bloqueio/desbloqueio de usuários
- Histórico individual

### ✅ Administração
- Gestão de usuários do sistema
- Configurações gerais
- Relatórios e estatísticas
- Sistema de permissões por role

### ✅ Aquisições
- Requisições de compra
- Cotações de fornecedores
- Pedidos de compra
- Gestão de fornecedores

## 📦 Instalação

### Pré-requisitos
- Node.js 18+
- Docker e Docker Compose (opcional)
- Conta no Supabase

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/biblioteca-saquarema.git
cd biblioteca-saquarema
```

### 2. Configure o Supabase

#### 2.1. Crie um projeto no Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Aguarde a criação do banco de dados

#### 2.2. Execute os scripts SQL
1. No painel do Supabase, vá em **SQL Editor**
2. Execute o arquivo `database/schema.sql`
3. Execute o arquivo `database/seed.sql` (dados de exemplo)

#### 2.3. Obtenha as credenciais
- URL do projeto: `Settings > API > Project URL`
- Chave anônima: `Settings > API > anon/public key`
- Chave service_role: `Settings > API > service_role key`

### 3. Configure o Backend

```bash
cd backend
npm install

# Copie o arquivo de exemplo
cp .env.example .env

# Edite o .env com suas credenciais do Supabase
```

**Arquivo `.env`:**
```env
PORT=3001
NODE_ENV=development

SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_KEY=sua-chave-anonima
SUPABASE_SERVICE_KEY=sua-chave-service-role

JWT_SECRET=sua-chave-secreta-super-segura
JWT_EXPIRES_IN=7d

CORS_ORIGIN=http://localhost:3000
```

### 4. Configure o Frontend

```bash
cd ../frontend
npm install

# Copie o arquivo de exemplo
cp .env.example .env

# Edite o .env
```

**Arquivo `.env`:**
```env
VITE_API_URL=http://localhost:3001/api
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_KEY=sua-chave-anonima
```

### 5. Execute o projeto

#### Opção A: Iniciar Tudo Junto (Recomendado)

```powershell
# Na raiz do projeto
.\start-all.ps1
```

Isso abrirá duas janelas do PowerShell (backend e frontend) e o navegador automaticamente.

#### Opção B: Desenvolvimento local (Manual)

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Acesse: `http://localhost:3000`

#### Opção C: Docker Compose

```bash
# Na raiz do projeto
docker-compose up --build
```

Acesse: `http://localhost:3000`

## 🔐 Login Padrão

**Email:** `admin@biblioteca.com`  
**Senha:** `admin123`

⚠️ **Importante:** Altere a senha padrão após o primeiro login!

## 📊 Estrutura do Banco de Dados

### Principais Tabelas

- **system_users** - Usuários do sistema (bibliotecários, admins)
- **roles** - Perfis e permissões
- **bibliographic_records** - Registros bibliográficos
- **holdings** - Exemplares/cópias físicas
- **library_users** - Usuários/leitores da biblioteca
- **user_types** - Tipos de usuário (estudante, professor, etc)
- **lendings** - Empréstimos
- **reservations** - Reservas
- **suppliers** - Fornecedores
- **acquisition_requests** - Requisições de compra

## 🚀 Deploy no Render

### Deploy Rápido com Blueprint (Recomendado)

O projeto está configurado para deploy automático usando Blueprint do Render:

1. **Faça push do código para o GitHub:**
   ```bash
   git add .
   git commit -m "Preparar para deploy"
   git push origin main
   ```

2. **No Render Dashboard:**
   - Acesse: https://dashboard.render.com
   - Clique em: **New +** → **Blueprint**
   - Conecte seu repositório GitHub
   - O Render detectará automaticamente o `render.yaml`
   - Clique em: **Apply**

3. **Configure as variáveis de ambiente:**
   - Backend (`biblioteca-api`): Adicione as credenciais do Supabase e JWT_SECRET
   - Frontend (`biblioteca-frontend`): Adicione VITE_API_URL

4. **Deploy!**
   - Aguarde 5-10 minutos
   - Acesse suas URLs de produção

📚 **Documentação completa de deploy:** [DEPLOY-RENDER.md](./DEPLOY-RENDER.md)

### Arquivos de Deploy

- `render.yaml` - Configuração Blueprint do Render
- `DEPLOY-RENDER.md` - Guia completo com troubleshooting
- `DEPLOY-FILES.md` - Resumo dos arquivos de configuração
- `COMANDOS-DEPLOY.md` - Comandos úteis para manutenção
- `test-build.ps1` / `test-build.sh` - Scripts para testar build localmente

### URLs de Produção

Após o deploy:
- **API:** https://biblioteca-api.onrender.com
- **Frontend:** https://biblioteca-saquarema.onrender.com
- **Health Check:** https://biblioteca-api.onrender.com/health

⚠️ **Nota:** O plano gratuito do Render deixa o serviço "dormir" após 15 minutos de inatividade. A primeira requisição pode levar 30-60 segundos para "acordar" o servidor.

## 📱 API Endpoints

### Autenticação
```
POST   /api/auth/login          - Login
POST   /api/auth/register       - Registrar usuário do sistema
GET    /api/auth/verify         - Verificar token
POST   /api/auth/change-password - Alterar senha
```

### Catálogo
```
GET    /api/catalog             - Listar registros
GET    /api/catalog/:id         - Buscar por ID
POST   /api/catalog             - Criar registro
PUT    /api/catalog/:id         - Atualizar registro
DELETE /api/catalog/:id         - Deletar registro
POST   /api/catalog/search      - Busca avançada
```

### Circulação
```
POST   /api/circulation/lend             - Realizar empréstimo
POST   /api/circulation/:id/return       - Realizar devolução
POST   /api/circulation/:id/renew        - Renovar empréstimo
GET    /api/circulation                  - Listar empréstimos
GET    /api/circulation/overdue          - Empréstimos atrasados
```

### Usuários
```
GET    /api/users               - Listar usuários
GET    /api/users/:id           - Buscar por ID
POST   /api/users               - Criar usuário
PUT    /api/users/:id           - Atualizar usuário
POST   /api/users/:id/block     - Bloquear/desbloquear
GET    /api/users/:id/history   - Histórico de empréstimos
```

## 🧪 Testes

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## 📝 Desenvolvimento

### Estrutura de Pastas

```
backend/
├── src/
│   ├── config/          # Configurações (DB, logger)
│   ├── controllers/     # Controladores
│   ├── middleware/      # Middlewares
│   ├── routes/          # Rotas da API
│   └── server.js        # Entry point
├── logs/                # Logs da aplicação
└── package.json

frontend/
├── src/
│   ├── components/      # Componentes React
│   ├── pages/           # Páginas
│   ├── services/        # Serviços (API)
│   ├── store/           # Estado global (Zustand)
│   ├── App.jsx          # Componente principal
│   └── main.jsx         # Entry point
└── package.json

database/
├── schema.sql           # Schema do banco
└── seed.sql             # Dados de exemplo
```

## 🔒 Segurança

- ✅ Senhas criptografadas com BCrypt
- ✅ Autenticação via JWT
- ✅ Proteção contra SQL Injection (Supabase)
- ✅ Helmet.js para headers de segurança
- ✅ CORS configurável
- ✅ Row Level Security (RLS) no Supabase

## 📖 Documentação Adicional

- [Especificação completa do sistema](./# Especificação Completa do Sistema Bibl.md)
- [Schema do banco de dados](./database/schema.sql)
- [Documentação da API Supabase](https://supabase.com/docs)

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 👥 Autores

Desenvolvido com base na especificação do Biblivre-5.

## 📞 Suporte

Para dúvidas ou problemas, abra uma issue no GitHub.

---

⭐ Se este projeto foi útil, deixe uma estrela!
