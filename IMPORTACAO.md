# 📚 Importação de Livros

Este guia explica como importar livros de uma planilha Excel para o sistema.

## 🎯 Duas Formas de Importar

### **Opção 1: Via Interface Web (Recomendado)**

1. Faça login no sistema
2. Vá em **"Importar Livros"** no menu lateral
3. Clique em **"Escolher Arquivo"** e selecione sua planilha Excel
4. Clique em **"Visualizar Preview"** para ver os primeiros 10 registros
5. Se estiver correto, clique em **"Importar Livros"**
6. Aguarde a importação concluir

**Vantagens:**
- ✅ Interface visual
- ✅ Preview antes de importar
- ✅ Relatório de erros detalhado
- ✅ Não precisa acessar terminal

---

### **Opção 2: Via Linha de Comando**

1. Coloque sua planilha na raiz do projeto com o nome:
   ```
   Cópia de Planilha de Descarte de material da Biblioteca Municipal(10).xlsx
   ```

2. Execute o comando:
   ```bash
   cd backend
   npm run import:books
   ```

3. O script irá:
   - ❌ Remover todos os livros fictícios do banco
   - ✅ Importar os livros da planilha
   - 📊 Mostrar relatório de importação

---

## 📋 Formato da Planilha

A planilha deve ter as seguintes colunas (não importa se estão em maiúsculas ou minúsculas):

| Coluna | Obrigatório | Exemplo |
|--------|-------------|---------|
| **Título** | ✅ Sim | "Dom Casmurro" |
| Subtítulo | ❌ Não | "Romance" |
| **Autor** | ✅ Sim | "Machado de Assis" |
| Editora | ❌ Não | "Ática" |
| Ano | ❌ Não | 2005 |
| ISBN | ❌ Não | "978-85-08-12345-6" |
| Classificação | ❌ Não | "869.3" |
| Tombo | ❌ Não | "000123" |
| Páginas | ❌ Não | 256 |
| Edição | ❌ Não | "3ª edição" |
| Assunto | ❌ Não | "Literatura Brasileira" |
| Código de Barras | ❌ Não | "789012345678" |
| Localização | ❌ Não | "Estante 3, Prateleira 2" |
| Observações | ❌ Não | "Bom estado" |

### 📝 Nomes Alternativos Aceitos

O sistema reconhece diferentes formas de escrever as colunas:
- **Título**: `Título`, `TÍTULO`, `titulo`
- **Autor**: `Autor`, `AUTOR`, `autor`
- **Editora**: `Editora`, `EDITORA`, `editora`
- E assim por diante...

---

## 🔥 Limpar Acervo

Para remover **TODOS** os livros do banco de dados:

### Via Interface Web:
1. Vá em **"Importar Livros"**
2. Role até o final da página (Zona de Perigo)
3. Clique em **"Limpar Todo o Acervo"**
4. Confirme a ação

### Via API:
```bash
# Requer autenticação como admin
DELETE /api/import/books/clear-all
```

⚠️ **ATENÇÃO:** Esta ação é irreversível!

---

## 🛠️ Endpoints da API

### **1. Preview do Arquivo**
```
POST /api/import/preview
Content-Type: multipart/form-data
Authorization: Bearer <token>

Body: { file: arquivo.xlsx }
```

**Resposta:**
```json
{
  "total": 150,
  "preview": [
    {
      "title": "Dom Casmurro",
      "author": "Machado de Assis",
      "publisher": "Ática",
      "year": 2005
    }
  ],
  "columns": ["Título", "Autor", "Editora", ...]
}
```

---

### **2. Importar Livros**
```
POST /api/import/books
Content-Type: multipart/form-data
Authorization: Bearer <token>

Body: { file: arquivo.xlsx }
```

**Resposta:**
```json
{
  "message": "Importação concluída",
  "imported": 145,
  "errors": 5,
  "total": 150,
  "errorDetails": [
    {
      "title": "Livro Exemplo",
      "error": "Título é obrigatório"
    }
  ]
}
```

---

### **3. Limpar Acervo**
```
DELETE /api/import/books/clear-all
Authorization: Bearer <token>
```

**Resposta:**
```json
{
  "message": "Todos os livros foram removidos com sucesso"
}
```

---

## 🔐 Permissões

- **Preview e Importar**: Requer perfil `admin` ou `librarian`
- **Limpar Acervo**: Requer perfil `admin` apenas

---

## ❓ Problemas Comuns

### "Formato de arquivo não suportado"
**Solução:** Certifique-se de que o arquivo é .xlsx, .xls ou .ods

### "Erro ao importar: Título é obrigatório"
**Solução:** Alguns livros na planilha não têm título. Adicione títulos ou remova essas linhas

### "Could not find relationship"
**Solução:** Verifique se as tabelas `bibliographic_records` e `holdings` existem no banco

### Import não aparece no menu
**Solução:** Faça logout e login novamente para atualizar as permissões

---

## 📊 Exemplo de Planilha

Veja o arquivo de exemplo incluído no projeto:
```
Cópia de Planilha de Descarte de material da Biblioteca Municipal(10).xlsx
```

---

## 🎓 Dicas

1. **Sempre faça preview** antes de importar grandes quantidades
2. **Faça backup** do banco de dados antes de limpar o acervo
3. **Verifique os dados** na planilha antes de importar
4. Se houver erros, corrija a planilha e importe novamente
5. Os livros duplicados (mesmo ISBN) serão importados separadamente

---

## 🚀 Status

✅ Sistema de importação funcionando  
✅ Interface web disponível  
✅ Script de linha de comando disponível  
✅ Validação de formatos  
✅ Relatório de erros detalhado  
✅ Preview antes de importar  
✅ Limpeza segura do acervo  
