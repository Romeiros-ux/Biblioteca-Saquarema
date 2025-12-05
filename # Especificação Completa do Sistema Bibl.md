# Especificação Completa do Sistema Biblivre-5

## 📋 Visão Geral

**Biblivre** é um Sistema Integrado de Gestão de Bibliotecas (SIGB) open-source completo, desenvolvido em Java com arquitetura web moderna.

**Versão:** 5.0.5  
**Tecnologia Base:** Java 8, PostgreSQL, Apache Tomcat  
**Arquitetura:** MVC com camadas BO (Business Object), DAO (Data Access Object), DTO (Data Transfer Object)  
**Interface:** JSP com AJAX/JSON para comunicação assíncrona

---

## 🏗️ Arquitetura do Sistema

### Stack Tecnológica

**Backend:**
- Java 8 (JDK 1.8)
- Apache Tomcat 7.0+
- PostgreSQL 9.1+ (database)
- Apache Maven 3.2+ (build tool)
- MARC4J 2.5.1 (processamento de registros MARC)

**Frontend:**
- JSP (JavaServer Pages)
- JavaScript/jQuery
- CSS3 com SASS
- AJAX para comunicação assíncrona

**Bibliotecas e Frameworks:**
- Apache Commons (Lang, IO, Collections, Codec, FileUpload)
- Log4j 1.2.17 (logging)
- JSON.org (processamento JSON)
- iText 4.2.1 (geração de PDFs)
- Apache POI 3.9 (Excel/Word)
- JFreeChart (gráficos e relatórios)

### Estrutura de Diretórios

```
biblivre-5/
├── src/java/biblivre/          # Código-fonte principal
│   ├── acquisition/            # Módulo de Aquisições
│   ├── administration/         # Módulo de Administração
│   ├── cataloging/            # Módulo de Catalogação
│   ├── circulation/           # Módulo de Circulação
│   ├── core/                  # Classes core do sistema
│   ├── digitalmedia/          # Mídias digitais
│   ├── login/                 # Autenticação
│   ├── marc/                  # Processamento MARC21
│   └── menu/                  # Sistema de menus
├── WebContent/                # Recursos web
│   ├── jsp/                   # Páginas JSP
│   ├── static/                # CSS, JS, imagens
│   └── WEB-INF/              # Configurações web
├── sql/                       # Scripts SQL
├── lib/                       # Bibliotecas locais
└── pom.xml                    # Configuração Maven
```

---

## 📦 Módulos Funcionais

### 1. **CATALOGAÇÃO** (`cataloging/`)

Sistema completo de catalogação bibliográfica com suporte a padrão MARC21.

#### Submódulos:

**1.1. Catalogação Bibliográfica** (`bibliographic/`)
- Cadastro de registros bibliográficos
- Suporte completo ao formato MARC21
- Campos: título, autor, ISBN, ISSN, editora, ano, etc.
- Importação/exportação de registros MARC
- Catalogação de diferentes tipos de materiais:
  - Livros
  - Periódicos
  - Artigos
  - Teses
  - Multimídia
  - Manuscritos
  - Materiais especiais

**1.2. Autoridades** (`authorities/`)
- Controle de autoridades (autores, assuntos)
- Padronização de entradas
- Relacionamento entre termos

**1.3. Vocabulário** (`vocabulary/`)
- Tesauros e vocabulários controlados
- Descritores e termos de indexação

**1.4. Holdings/Cópias** (`holding/`)
- Gestão de exemplares físicos
- Localização na biblioteca
- Status de disponibilidade
- Códigos de barras
- Números de tombo

**1.5. Etiquetas** (`labels/`)
- Geração de etiquetas para lombadas
- Códigos de barras para exemplares
- Impressão em lote

**1.6. Importação** (`ImportBO.java`, `ImportDAO.java`)
- Importação de registros MARC
- Importação de arquivos CSV
- Integração com Z39.50 (opcional)

**Funcionalidades Principais:**
- Editor MARC visual e em texto
- Busca e recuperação de registros
- Duplicação de registros
- Histórico de alterações
- Anexos digitais
- Tags customizáveis

---

### 2. **CIRCULAÇÃO** (`circulation/`)

Gerenciamento completo do empréstimo e devolução de materiais.

#### Submódulos:

**2.1. Usuários** (`user/`)
- Cadastro de usuários/leitores
- Tipos de usuário configuráveis
- Campos personalizáveis:
  - Nome, CPF, RG
  - Endereço, telefone, email
  - Foto do usuário
  - Status (ativo, bloqueado, pendente)
  - Observações

**2.2. Empréstimos** (`lending/`)
- Registro de empréstimos
- Cálculo automático de datas de devolução
- Renovações (online e presencial)
- Multas e penalidades
- Histórico de empréstimos

**2.3. Reservas** (`reservation/`)
- Sistema de reservas de materiais
- Fila de espera
- Notificações automáticas

**2.4. Controle de Acesso** (`accesscontrol/`)
- Controle de entrada/saída da biblioteca
- Registro de visitas
- Estatísticas de frequência

**2.5. Cartões de Usuário** (`user_cards/`)
- Geração de carteirinhas
- Códigos de barras para usuários
- Impressão em lote

**Funcionalidades Principais:**
- Empréstimo rápido via código de barras
- Cálculo automático de multas
- Políticas de empréstimo por tipo de usuário
- Bloqueio automático por atrasos
- Notificações de vencimento
- Estatísticas de circulação

---

### 3. **AQUISIÇÕES** (`acquisition/`)

Gestão completa do processo de aquisição de acervo.

#### Submódulos:

**3.1. Requisições** (`request/`)
- Solicitações de compra
- Aprovação de pedidos
- Priorização

**3.2. Cotações** (`quotation/`)
- Solicitação de orçamentos
- Comparação de preços
- Seleção de fornecedores

**3.3. Pedidos** (`order/`)
- Emissão de pedidos de compra
- Acompanhamento de status
- Recebimento de materiais

**3.4. Fornecedores** (`supplier/`)
- Cadastro de fornecedores
- Histórico de compras
- Avaliação de fornecedores

**Funcionalidades Principais:**
- Workflow completo de aquisição
- Controle orçamentário
- Relatórios de compras
- Integração com catalogação

---

### 4. **ADMINISTRAÇÃO** (`administration/`)

Configuração e manutenção do sistema.

#### Submódulos:

**4.1. Configurações** (`configurations/`)
- Configurações gerais da biblioteca
- Parâmetros do sistema
- Personalização de interface

**4.2. Usuários do Sistema** (`permissions/`)
- Gestão de usuários do sistema
- Permissões e perfis
- Controle de acesso por módulo

**4.3. Tipos de Usuário** (`usertype/`)
- Definição de tipos de leitores
- Políticas de empréstimo por tipo
- Limites e prazos

**4.4. Traduções** (`translations/`)
- Sistema multilíngue (pt-BR, en-US, es)
- Edição de textos da interface
- Adição de novos idiomas

**4.5. Relatórios** (`reports/`)
- Relatórios pré-definidos:
  - Acervo total
  - Empréstimos por período
  - Usuários ativos
  - Materiais mais emprestados
  - Atrasos e multas
  - Estatísticas de catalogação
- Geração em PDF e Excel
- Gráficos e dashboards

**4.6. Backup** (`backup/`)
- Backup do banco de dados
- Backup de arquivos digitais
- Restauração de backups
- Agendamento automático

**4.7. Indexação** (`indexing/`)
- Reindexação do acervo
- Otimização de buscas
- Manutenção de índices

**4.8. Personalização** (`customization/`)
- Upload de logo
- Cores e temas
- Textos personalizados

**4.9. Migração de Dados** (`setup/`)
- Importação de Biblivre 3
- Assistente de instalação
- Configuração inicial

**4.10. Cartões de Acesso** (`accesscards/`)
- Gerenciamento de cartões RFID
- Integração com catracas

---

### 5. **CORE** (`core/`)

Funcionalidades centrais compartilhadas.

#### Componentes:

**5.1. Autenticação e Sessão**
- Login de usuários
- Controle de sessão
- Níveis de permissão

**5.2. Multi-Schema**
- Suporte a múltiplas bibliotecas
- Isolamento de dados por schema
- Gestão centralizada

**5.3. Configurações** (`configurations/`)
- Armazenamento de configurações
- Cache de configurações

**5.4. Schemas** (`schemas/`)
- Gerenciamento de bibliotecas
- Criação de novos schemas

**5.5. Utils**
- Utilidades de data/hora
- Formatação de texto
- Manipulação de arquivos
- Conexão com banco de dados

**5.6. Updates**
- Sistema de atualização automática
- Migração de versões
- Patches de banco de dados

---

### 6. **BUSCA E RECUPERAÇÃO** (`cataloging/search/`)

Sistema avançado de busca bibliográfica.

**Tipos de Busca:**
- Busca simples (palavra-chave)
- Busca avançada (múltiplos campos)
- Busca por:
  - Título
  - Autor
  - Assunto
  - ISBN/ISSN
  - Número de chamada
  - Todos os campos

**Funcionalidades:**
- Operadores booleanos (AND, OR, NOT)
- Busca fonética
- Correção ortográfica
- Filtros por:
  - Tipo de material
  - Ano de publicação
  - Status de disponibilidade
  - Localização
- Ordenação de resultados
- Exportação de resultados
- Histórico de buscas

---

### 7. **MÍDIAS DIGITAIS** (`digitalmedia/`)

Gestão de arquivos digitais.

**Funcionalidades:**
- Upload de arquivos PDF, imagens, vídeos
- Vinculação com registros bibliográficos
- Armazenamento em banco de dados
- Download de arquivos
- Visualização inline
- Controle de acesso

---

### 8. **MARC21** (`marc/`)

Suporte completo ao padrão MARC21.

**Componentes:**
- `MarcUtils` - Utilitários MARC
- `MarcFileReader` - Leitura de arquivos MARC
- `MarcDataReader` - Parsing de registros
- `MaterialType` - Tipos de materiais
- `RecordStatus` - Status de registros

**Funcionalidades:**
- Parsing de MARC21
- Validação de registros
- Conversão MARC ↔ JSON
- Importação/exportação ISO2709
- Suporte a MARCXML

---

## 🗄️ Modelo de Dados

### Principais Tabelas

**Catalogação:**
```sql
biblio_records           -- Registros bibliográficos
biblio_holdings         -- Exemplares/cópias
biblio_searches         -- Buscas e índices
authorities_records     -- Registros de autoridades
vocabulary_records      -- Vocabulário controlado
```

**Circulação:**
```sql
users                   -- Usuários/leitores
users_fields           -- Campos customizáveis de usuários
lending                -- Empréstimos
lending_fines          -- Multas
reservations           -- Reservas
access_control         -- Controle de acesso
access_cards           -- Cartões de acesso
```

**Aquisições:**
```sql
acquisition_request    -- Requisições
acquisition_quotation  -- Cotações
acquisition_order      -- Pedidos
acquisition_supplier   -- Fornecedores
```

**Administração:**
```sql
configurations         -- Configurações do sistema
logins                -- Usuários do sistema
permissions           -- Permissões
translations          -- Traduções
backups               -- Histórico de backups
digital_media         -- Arquivos digitais
schemas               -- Bibliotecas (multi-tenant)
```

---

## 🔐 Sistema de Permissões

### Perfis de Usuário

1. **Administrador**
   - Acesso total ao sistema
   - Configurações globais
   - Gestão de usuários

2. **Bibliotecário**
   - Catalogação
   - Circulação
   - Aquisições
   - Relatórios

3. **Auxiliar**
   - Circulação
   - Busca
   - Leitura de relatórios

4. **Consulta**
   - Apenas busca no catálogo
   - Visualização de registros

### Permissões Granulares

Permissões por módulo:
- `cataloging_bibliographic_list`
- `cataloging_bibliographic_save`
- `cataloging_bibliographic_delete`
- `circulation_lending_list`
- `circulation_lending_lend`
- `circulation_lending_return`
- `acquisition_request_save`
- `administration_configuration`
- `administration_reports`

---

## 🌐 Interface Web

### Estrutura de Páginas

**Páginas JSP principais:**
```
index.jsp              -- Página inicial
login.jsp              -- Login
menu.jsp               -- Menu principal
```

**Módulos (estrutura padrão):**
```
jsp/cataloging/
  ├── bibliographic.jsp
  ├── authorities.jsp
  ├── vocabulary.jsp
  └── holding.jsp

jsp/circulation/
  ├── user.jsp
  ├── lending.jsp
  ├── reservation.jsp
  └── access_control.jsp

jsp/acquisition/
  ├── request.jsp
  ├── quotation.jsp
  └── order.jsp

jsp/administration/
  ├── configuration.jsp
  ├── permissions.jsp
  ├── reports.jsp
  └── backup.jsp
```

### Comunicação AJAX

**Padrão de comunicação:**
```javascript
// Request
{
  "controller": "json",
  "module": "cataloging.bibliographic",
  "action": "search",
  "query": "termo de busca"
}

// Response
{
  "success": true,
  "data": [...],
  "message": "Operação realizada com sucesso"
}
```

---

## 📊 Relatórios e Estatísticas

### Relatórios Disponíveis

**Catalogação:**
- Acervo total por tipo de material
- Novos registros por período
- Materiais sem exemplares
- Registros incompletos

**Circulação:**
- Empréstimos por período
- Empréstimos por usuário
- Materiais mais emprestados
- Atrasos e pendências
- Multas por período
- Usuários bloqueados
- Estatísticas de reservas

**Aquisições:**
- Pedidos por fornecedor
- Gastos por período
- Materiais aguardando recebimento

**Geral:**
- Usuários ativos
- Crescimento do acervo
- Estatísticas de acesso

**Formatos de Exportação:**
- PDF (via iText)
- Excel (via Apache POI)
- CSV
- JSON

---

## 🔄 Fluxos de Trabalho

### Fluxo de Catalogação

1. Criar novo registro bibliográfico
2. Preencher campos MARC21
3. Salvar registro
4. Adicionar exemplares (holdings)
5. Definir localização e código de barras
6. Registro disponível para circulação

### Fluxo de Empréstimo

1. Escanear código de barras do usuário
2. Escanear código de barras do material
3. Sistema verifica:
   - Status do usuário (ativo/bloqueado)
   - Limite de empréstimos
   - Disponibilidade do material
4. Calcular data de devolução
5. Registrar empréstimo
6. Imprimir comprovante (opcional)

### Fluxo de Devolução

1. Escanear código de barras do material
2. Sistema identifica empréstimo
3. Calcular multa (se houver atraso)
4. Registrar devolução
5. Atualizar status do material
6. Verificar reservas (notificar próximo usuário)

### Fluxo de Aquisição

1. Criar requisição de compra
2. Aprovar requisição
3. Solicitar cotações de fornecedores
4. Comparar cotações
5. Emitir pedido de compra
6. Acompanhar entrega
7. Receber materiais
8. Catalogar novos materiais

---

## 🛠️ Configurações e Personalização

### Configurações Principais

**Biblioteca:**
- Nome da biblioteca
- Endereço, telefone, email
- Horário de funcionamento
- Logo e brasão
- Cores do tema

**Catalogação:**
- Formato MARC padrão
- Campos obrigatórios
- Validações customizadas

**Circulação:**
- Prazo de empréstimo por tipo de material
- Limite de empréstimos por usuário
- Quantidade de renovações permitidas
- Valor de multas por dia de atraso
- Dias de tolerância

**Sistema:**
- Idioma padrão
- Formato de data
- Backup automático
- Log de auditoria

---

## 📱 Recursos Especiais

### Multi-Tenant (Multi-Schema)

- Suporte a múltiplas bibliotecas na mesma instalação
- Isolamento completo de dados por schema PostgreSQL
- Gestão centralizada de schemas
- URL por biblioteca: `http://servidor/{schema}/`

### Importação/Exportação

**Formatos suportados:**
- MARC21 (ISO2709)
- MARCXML
- CSV
- JSON

**Integrações:**
- Z39.50 (desabilitado na versão atual)
- OAI-PMH (planejado)
- SRU/SRW (planejado)

### Acessibilidade

- Interface responsiva
- Suporte a leitores de tela
- Contraste ajustável
- Navegação por teclado

---

## 🚀 Requisitos para Nova Implementação

### Requisitos Funcionais

**Essenciais:**
1. ✅ Sistema de catalogação com MARC21
2. ✅ Gestão de usuários/leitores
3. ✅ Empréstimo e devolução
4. ✅ Busca avançada no catálogo
5. ✅ Relatórios básicos
6. ✅ Multi-biblioteca
7. ✅ Sistema de permissões

**Desejáveis:**
8. ✅ Aquisições completo
9. ✅ Reservas online
10. ✅ Portal do usuário (renovação online)
11. ✅ Notificações por email/SMS
12. ✅ Integração com Z39.50
13. ✅ API REST para integrações

### Requisitos Não-Funcionais

**Performance:**
- Suporte a 10.000+ registros bibliográficos
- Suporte a 5.000+ usuários
- Resposta < 2s para buscas
- Suporte a 50+ usuários simultâneos

**Segurança:**
- Autenticação forte
- Criptografia de senhas (BCrypt)
- Proteção contra SQL Injection
- Proteção contra XSS
- Auditoria de operações

**Disponibilidade:**
- Uptime 99.5%
- Backup automático diário
- Recuperação de desastres

**Usabilidade:**
- Interface intuitiva
- Tempo de treinamento < 4 horas
- Acessibilidade WCAG 2.1 AA

---

## 🔧 Tecnologias Recomendadas para Modernização

### Backend Moderno

**Opção 1: Java Moderno**
- Spring Boot 3.x
- Spring Security (autenticação)
- Spring Data JPA (persistência)
- Hibernate 6.x
- Java 17+ (LTS)

**Opção 2: Node.js**
- Node.js 18+ LTS
- Express.js ou NestJS
- Sequelize ou TypeORM
- Passport.js (autenticação)

**Opção 3: Python**
- Django 4.x ou FastAPI
- Django ORM ou SQLAlchemy
- Django REST Framework

### Frontend Moderno

**Opção 1: React**
- React 18+
- Material-UI ou Ant Design
- Redux ou Context API
- React Router

**Opção 2: Vue.js**
- Vue 3
- Vuetify ou Element Plus
- Pinia (state management)
- Vue Router

**Opção 3: Angular**
- Angular 16+
- Angular Material
- RxJS

### Database

- PostgreSQL 14+ (manter compatibilidade)
- Prisma ou Drizzle ORM
- Redis (cache)

### DevOps

- Docker + Docker Compose
- CI/CD (GitHub Actions, GitLab CI)
- Kubernetes (para produção em escala)
- Nginx (reverse proxy)

### Observabilidade

- Logs: Winston, Log4j2, ou ELK Stack
- Métricas: Prometheus + Grafana
- APM: New Relic, Datadog, ou Sentry

---

## 📋 Checklist de Migração

### Fase 1: Análise e Planejamento
- [ ] Documentar todos os módulos atuais
- [ ] Mapear fluxos de trabalho
- [ ] Identificar dependências críticas
- [ ] Definir stack tecnológica
- [ ] Criar cronograma

### Fase 2: Setup da Infraestrutura
- [ ] Configurar ambiente de desenvolvimento
- [ ] Setup Docker/Kubernetes
- [ ] Configurar CI/CD
- [ ] Setup de monitoramento

### Fase 3: Desenvolvimento por Módulo

**Ordem sugerida:**
1. [ ] Core (autenticação, sessão, utils)
2. [ ] Catalogação básica
3. [ ] Busca
4. [ ] Usuários/leitores
5. [ ] Circulação (empréstimo/devolução)
6. [ ] Relatórios básicos
7. [ ] Administração
8. [ ] Aquisições
9. [ ] Recursos avançados

### Fase 4: Migração de Dados
- [ ] Script de migração PostgreSQL
- [ ] Validação de dados migrados
- [ ] Testes de integridade

### Fase 5: Testes
- [ ] Testes unitários (80%+ coverage)
- [ ] Testes de integração
- [ ] Testes end-to-end
- [ ] Testes de carga
- [ ] Testes de segurança

### Fase 6: Implantação
- [ ] Deploy em homologação
- [ ] Testes com usuários
- [ ] Correções e ajustes
- [ ] Deploy em produção
- [ ] Treinamento de usuários

---

## 📞 Contatos e Referências

**Projeto Original:**
- Site: http://www.biblivre.org.br
- GitHub: https://github.com/cleydyr/biblivre

**Desenvolvedores Originais:**
- Alberto Wagner Collavizza
- Danniel Willian B. do Nascimento

**Padrões e Documentação:**
- MARC21: https://www.loc.gov/marc/
- Z39.50: https://www.loc.gov/z3950/
- OAI-PMH: https://www.openarchives.org/pmh/

---

## 📝 Notas Finais

Este documento serve como especificação completa para recriação do sistema Biblivre-5 com tecnologias modernas e arquitetura web atualizada. O objetivo é manter todas as funcionalidades essenciais enquanto resolve problemas de compatibilidade, performance e usabilidade.

**Principais melhorias a implementar:**
1. ✅ API REST moderna
2. ✅ Frontend responsivo e moderno
3. ✅ Autenticação JWT
4. ✅ Cache inteligente
5. ✅ Documentação automática (Swagger/OpenAPI)
6. ✅ Testes automatizados
7. ✅ Deploy containerizado
8. ✅ Monitoramento e logs estruturados

---

**Documento criado em:** 4 de dezembro de 2025  
**Versão do documento:** 1.0  
**Baseado em:** Biblivre-5 versão 5.0.5
