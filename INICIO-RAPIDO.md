# 🚀 Guia de Início Rápido

## ✅ Credenciais já configuradas!

Suas credenciais do Supabase já foram configuradas automaticamente nos arquivos `.env`.

**Projeto Supabase:** Biblioteca  
**Project ID:** jilwzfxlroenxsdyjhsd

## 📋 Próximos Passos

### 1️⃣ Configurar o Banco de Dados no Supabase

1. Acesse: https://supabase.com/dashboard/project/jilwzfxlroenxsdyjhsd
2. Vá em **SQL Editor** no menu lateral
3. Clique em **New Query**
4. Copie e cole o conteúdo do arquivo `database/schema.sql`
5. Clique em **Run** (ou pressione Ctrl+Enter)
6. Aguarde a execução (pode levar alguns segundos)
7. Repita o processo com o arquivo `database/seed.sql` (dados de exemplo)

### 2️⃣ Instalar Dependências

Abra dois terminais PowerShell:

**Terminal 1 - Backend:**
```powershell
cd c:\Users\user\Documents\GitHub\Barbearia\Biblioteca-Saquarema\backend
npm install
```

**Terminal 2 - Frontend:**
```powershell
cd c:\Users\user\Documents\GitHub\Barbearia\Biblioteca-Saquarema\frontend
npm install
```

### 3️⃣ Executar o Sistema

**Opção A - Iniciar Tudo Junto (Mais Fácil):**
```powershell
.\start-all.ps1
```
Isso abrirá 2 janelas (backend e frontend) e o navegador automaticamente! 🚀

**Opção B - Manual (Se preferir):**

**Terminal 1 - Backend:**
```powershell
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```

Acesse: http://localhost:3000

### 4️⃣ Fazer Login

**Credenciais padrão:**
- **Email:** admin@biblioteca.com
- **Senha:** admin123

⚠️ **Importante:** Altere a senha após o primeiro login!

---

## 🐛 Problemas Comuns

### Erro "ENOENT: no such file or directory"
Certifique-se de estar na pasta correta antes de executar os comandos.

### Erro "MODULE_NOT_FOUND"
Execute `npm install` novamente na pasta correspondente.

### Erro de conexão com Supabase
1. Verifique se executou os scripts SQL no Supabase
2. Confirme que o projeto está ativo em https://supabase.com/dashboard

### Backend não inicia
Verifique se a porta 3001 não está em uso:
```powershell
netstat -ano | findstr :3001
```

### Frontend não carrega
1. Certifique-se de que o backend está rodando primeiro
2. Limpe o cache do navegador (Ctrl+Shift+Del)
3. Tente acessar: http://localhost:3001/health (deve retornar status "ok")

---

## 📚 Estrutura do Sistema

### Módulos Disponíveis
- **Dashboard** - Visão geral e estatísticas
- **Catálogo** - Gerenciamento de livros e materiais
- **Circulação** - Empréstimos, devoluções e renovações
- **Usuários** - Cadastro de leitores
- **Relatórios** - Estatísticas e relatórios
- **Configurações** - Configurações do sistema

### API Endpoints
- Backend: http://localhost:3001/api
- Health Check: http://localhost:3001/health
- Frontend: http://localhost:3000

---

## 🎯 Comandos Úteis

### Backend
```powershell
cd backend
npm run dev      # Modo desenvolvimento
npm start        # Modo produção
npm test         # Executar testes
```

### Frontend
```powershell
cd frontend
npm run dev      # Modo desenvolvimento
npm run build    # Build para produção
npm run preview  # Preview do build
```

### Docker (alternativa)
```powershell
# Na raiz do projeto
docker-compose up --build
```

---

## 📖 Documentação

- **README.md** - Documentação completa
- **DEPLOY.md** - Guia de deploy no Render
- **database/schema.sql** - Estrutura do banco de dados
- **database/seed.sql** - Dados de exemplo

---

## 🆘 Suporte

Problemas? Verifique:
1. Logs do backend (no terminal)
2. Console do navegador (F12)
3. Logs do Supabase (SQL Editor > Logs)

---

**Desenvolvido para Biblioteca Saquarema** 📚  
*Sistema de Gestão de Bibliotecas Moderno*
