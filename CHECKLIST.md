# 🎯 Checklist de Configuração

Use este checklist para garantir que tudo está configurado corretamente.

## ✅ Pré-requisitos

- [ ] Node.js 18+ instalado ([Download](https://nodejs.org))
- [ ] Conta no Supabase criada ([Criar conta](https://supabase.com))
- [ ] Git instalado ([Download](https://git-scm.com))

## ✅ Configuração do Supabase

### Passo 1: Acessar o Projeto
- [ ] Acesse: https://supabase.com/dashboard/project/jilwzfxlroenxsdyjhsd
- [ ] Verifique se o projeto "Biblioteca" está ativo

### Passo 2: Executar Schema SQL
- [ ] Clique em **SQL Editor** no menu lateral
- [ ] Clique em **New Query**
- [ ] Abra o arquivo `database/schema.sql` no seu editor
- [ ] Copie TODO o conteúdo (Ctrl+A, Ctrl+C)
- [ ] Cole no SQL Editor do Supabase
- [ ] Clique em **Run** (ou Ctrl+Enter)
- [ ] Aguarde a mensagem "Success. No rows returned"

### Passo 3: Executar Dados de Exemplo
- [ ] Clique em **New Query** novamente
- [ ] Abra o arquivo `database/seed.sql`
- [ ] Copie TODO o conteúdo
- [ ] Cole no SQL Editor do Supabase
- [ ] Clique em **Run**
- [ ] Aguarde a conclusão

### Passo 4: Verificar Tabelas Criadas
- [ ] Clique em **Table Editor** no menu lateral
- [ ] Você deve ver as seguintes tabelas:
  - [ ] roles
  - [ ] system_users
  - [ ] configurations
  - [ ] bibliographic_records
  - [ ] holdings
  - [ ] authorities
  - [ ] user_types
  - [ ] library_users
  - [ ] lendings
  - [ ] reservations
  - [ ] access_control
  - [ ] suppliers
  - [ ] acquisition_requests
  - [ ] quotations
  - [ ] purchase_orders
  - [ ] digital_media

## ✅ Instalação Local

### Opção A: Instalação Automática (Recomendado)

- [ ] Abra o PowerShell na pasta do projeto
- [ ] Execute: `.\install.ps1`
- [ ] Aguarde a instalação das dependências

### Opção B: Instalação Manual

#### Backend
- [ ] Abra terminal na pasta `backend`
- [ ] Execute: `npm install`
- [ ] Aguarde a instalação

#### Frontend
- [ ] Abra terminal na pasta `frontend`
- [ ] Execute: `npm install`
- [ ] Aguarde a instalação

## ✅ Verificar Configurações

### Backend (.env)
- [ ] Arquivo `backend/.env` existe
- [ ] Contém `SUPABASE_URL=https://jilwzfxlroenxsdyjhsd.supabase.co`
- [ ] Contém as chaves do Supabase

### Frontend (.env)
- [ ] Arquivo `frontend/.env` existe
- [ ] Contém `VITE_API_URL=http://localhost:3001/api`
- [ ] Contém a URL do Supabase

## ✅ Iniciar o Sistema

### Método 1: Scripts Automáticos

#### Terminal 1 - Backend
- [ ] Execute: `.\start-backend.ps1`
- [ ] Aguarde a mensagem: "🚀 Servidor rodando na porta 3001"

#### Terminal 2 - Frontend
- [ ] Execute: `.\start-frontend.ps1`
- [ ] Aguarde a mensagem com a URL local

### Método 2: Manual

#### Terminal 1 - Backend
- [ ] `cd backend`
- [ ] `npm run dev`
- [ ] Aguarde: "🚀 Servidor rodando na porta 3001"

#### Terminal 2 - Frontend
- [ ] `cd frontend`
- [ ] `npm run dev`
- [ ] Aguarde a URL aparecer

## ✅ Testar o Sistema

### Backend
- [ ] Abra: http://localhost:3001/health
- [ ] Deve retornar: `{"status":"ok","timestamp":"..."}`

### Frontend
- [ ] Abra: http://localhost:3000
- [ ] Página de login deve aparecer

### Login
- [ ] Email: `admin@biblioteca.com`
- [ ] Senha: `admin123`
- [ ] Clique em "Entrar"
- [ ] Dashboard deve aparecer

## ✅ Verificar Funcionalidades

- [ ] **Dashboard** - Estatísticas aparecem
- [ ] **Catálogo** - Menu lateral funciona
- [ ] **Usuários** - Menu lateral funciona
- [ ] **Navegação** - Todos os menus estão clicáveis
- [ ] **Logout** - Botão de sair funciona

## ✅ Dados de Exemplo Carregados

Verifique se os dados de exemplo foram carregados:

### No Supabase (Table Editor)

#### system_users
- [ ] Usuário "Administrador" existe
- [ ] Usuário "Maria Silva" existe

#### bibliographic_records
- [ ] Livro "Dom Casmurro" existe
- [ ] Livro "O Cortiço" existe
- [ ] Livro "Clean Code" existe
- [ ] Livro "1984" existe

#### library_users
- [ ] Usuário "João Silva Santos" existe
- [ ] Usuário "Ana Paula Oliveira" existe
- [ ] Professor "Carlos Eduardo" existe

#### lendings
- [ ] Deve haver 2 empréstimos de exemplo

## 🐛 Troubleshooting

### ❌ Backend não inicia

**Erro: "Port 3001 already in use"**
- [ ] Verifique processos na porta: `netstat -ano | findstr :3001`
- [ ] Mate o processo ou mude a porta no `.env`

**Erro: "Cannot connect to Supabase"**
- [ ] Verifique se o Supabase está online
- [ ] Verifique as credenciais no `.env`
- [ ] Teste a URL: https://jilwzfxlroenxsdyjhsd.supabase.co

### ❌ Frontend não carrega

**Erro: "Network Error"**
- [ ] Certifique-se que o backend está rodando
- [ ] Verifique `VITE_API_URL` no `frontend/.env`
- [ ] Teste: http://localhost:3001/health

**Erro: "Cannot GET /"**
- [ ] Limpe cache do navegador (Ctrl+Shift+Del)
- [ ] Tente em modo anônimo
- [ ] Verifique se `npm run dev` está rodando

### ❌ Login não funciona

**"Credenciais inválidas"**
- [ ] Verifique se executou `seed.sql` no Supabase
- [ ] Verifique na tabela `system_users` se há o admin
- [ ] Use exatamente: `admin@biblioteca.com` / `admin123`

**"Token inválido"**
- [ ] Verifique `JWT_SECRET` no `backend/.env`
- [ ] Limpe localStorage do navegador (F12 > Application > Local Storage)

### ❌ Tabelas não aparecem no Supabase

- [ ] Execute novamente `schema.sql`
- [ ] Verifique erros no SQL Editor
- [ ] Certifique-se de copiar TODO o arquivo

## 📞 Suporte

Se todos os passos falharem:

1. Verifique os logs do backend no terminal
2. Abra o Console do navegador (F12)
3. Verifique os logs do Supabase
4. Revise `INICIO-RAPIDO.md`
5. Revise `README.md`

---

## 🎉 Sistema Pronto!

Se todos os checkboxes estão marcados, parabéns! 🎊

Seu sistema de biblioteca está funcionando perfeitamente!

### Próximos Passos

- [ ] Alterar senha do admin
- [ ] Cadastrar primeiros livros
- [ ] Cadastrar primeiros usuários reais
- [ ] Configurar logo da biblioteca
- [ ] Personalizar cores (se desejado)

---

**Data da instalação:** ___/___/______  
**Instalado por:** _________________  
**Versão:** 1.0.0
