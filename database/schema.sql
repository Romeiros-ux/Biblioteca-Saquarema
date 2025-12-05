-- =====================================================
-- SCHEMA DO BANCO DE DADOS PARA SISTEMA DE BIBLIOTECA
-- Supabase / PostgreSQL
-- =====================================================

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- Para buscas com similaridade

-- =====================================================
-- TABELAS DE ADMINISTRAÇÃO E CONTROLE
-- =====================================================

-- Perfis/Roles do sistema
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  permissions JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Usuários do sistema (bibliotecários, administradores)
CREATE TABLE system_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role_id UUID REFERENCES roles(id),
  active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Configurações do sistema
CREATE TABLE configurations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABELAS DE CATALOGAÇÃO
-- =====================================================

-- Registros bibliográficos
CREATE TABLE bibliographic_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  -- Campos básicos MARC21
  title VARCHAR(500) NOT NULL,
  subtitle VARCHAR(500),
  author VARCHAR(255),
  secondary_authors TEXT[], -- Array de autores secundários
  isbn VARCHAR(20),
  issn VARCHAR(20),
  publisher VARCHAR(255),
  publication_year INTEGER,
  publication_place VARCHAR(255),
  edition VARCHAR(100),
  pages INTEGER,
  language VARCHAR(10) DEFAULT 'pt',
  -- Classificação
  call_number VARCHAR(100), -- Número de chamada (CDU, CDD)
  subject TEXT[], -- Array de assuntos
  keywords TEXT[], -- Array de palavras-chave
  -- Tipo e descrição
  material_type VARCHAR(50) NOT NULL, -- book, journal, article, thesis, multimedia, etc
  description TEXT,
  notes TEXT,
  -- MARC21 completo (JSON)
  marc_data JSONB,
  -- Controle
  created_by UUID REFERENCES system_users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  -- Índices para busca
  search_vector TSVECTOR
);

-- Índices para otimizar buscas
CREATE INDEX idx_biblio_title ON bibliographic_records USING gin(to_tsvector('portuguese', title));
CREATE INDEX idx_biblio_author ON bibliographic_records USING gin(to_tsvector('portuguese', author));
CREATE INDEX idx_biblio_subject ON bibliographic_records USING gin(subject);
CREATE INDEX idx_biblio_isbn ON bibliographic_records(isbn);
CREATE INDEX idx_biblio_material ON bibliographic_records(material_type);
CREATE INDEX idx_biblio_search ON bibliographic_records USING gin(search_vector);

-- Trigger para atualizar search_vector
CREATE OR REPLACE FUNCTION update_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('portuguese', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('portuguese', COALESCE(NEW.author, '')), 'B') ||
    setweight(to_tsvector('portuguese', COALESCE(NEW.publisher, '')), 'C') ||
    setweight(to_tsvector('portuguese', COALESCE(array_to_string(NEW.subject, ' '), '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER biblio_search_vector_update
  BEFORE INSERT OR UPDATE ON bibliographic_records
  FOR EACH ROW EXECUTE FUNCTION update_search_vector();

-- Exemplares/Holdings (cópias físicas)
CREATE TABLE holdings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  record_id UUID REFERENCES bibliographic_records(id) ON DELETE RESTRICT,
  barcode VARCHAR(50) UNIQUE NOT NULL,
  accession_number VARCHAR(50), -- Número de tombo
  volume VARCHAR(50),
  copy_number INTEGER DEFAULT 1,
  -- Localização
  location VARCHAR(255) NOT NULL, -- Sala, estante, prateleira
  collection VARCHAR(100), -- Coleção especial
  -- Status
  status VARCHAR(50) DEFAULT 'available', -- available, lent, reserved, maintenance, lost
  acquisition_date DATE,
  acquisition_type VARCHAR(50), -- purchase, donation, exchange
  price DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_holding_barcode ON holdings(barcode);
CREATE INDEX idx_holding_record ON holdings(record_id);
CREATE INDEX idx_holding_status ON holdings(status);

-- Autoridades (autores padronizados)
CREATE TABLE authorities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) UNIQUE NOT NULL,
  type VARCHAR(50) NOT NULL, -- person, organization, event
  alternative_names TEXT[],
  dates VARCHAR(100),
  biography TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABELAS DE USUÁRIOS/LEITORES
-- =====================================================

-- Tipos de usuário
CREATE TABLE user_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  max_lendings INTEGER DEFAULT 3,
  loan_days INTEGER DEFAULT 7,
  max_renewals INTEGER DEFAULT 2,
  fine_per_day DECIMAL(10,2) DEFAULT 2.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Usuários da biblioteca (leitores)
CREATE TABLE library_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_type_id UUID REFERENCES user_types(id),
  -- Dados pessoais
  name VARCHAR(255) NOT NULL,
  cpf VARCHAR(14) UNIQUE,
  rg VARCHAR(20),
  birth_date DATE,
  gender VARCHAR(20),
  photo_url TEXT,
  -- Contato
  email VARCHAR(255),
  phone VARCHAR(20),
  mobile VARCHAR(20),
  -- Endereço
  address VARCHAR(255),
  address_number VARCHAR(20),
  complement VARCHAR(100),
  neighborhood VARCHAR(100),
  city VARCHAR(100),
  state VARCHAR(2),
  zip_code VARCHAR(10),
  -- Status
  active BOOLEAN DEFAULT true,
  blocked BOOLEAN DEFAULT false,
  block_reason TEXT,
  registration_date DATE DEFAULT CURRENT_DATE,
  expiration_date DATE,
  notes TEXT,
  created_by UUID REFERENCES system_users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_cpf ON library_users(cpf);
CREATE INDEX idx_user_name ON library_users USING gin(to_tsvector('portuguese', name));
CREATE INDEX idx_user_active ON library_users(active);

-- =====================================================
-- TABELAS DE CIRCULAÇÃO
-- =====================================================

-- Empréstimos
CREATE TABLE lendings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES library_users(id),
  holding_id UUID REFERENCES holdings(id),
  lend_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  return_date TIMESTAMP WITH TIME ZONE,
  renewals INTEGER DEFAULT 0,
  fine_amount DECIMAL(10,2) DEFAULT 0,
  fine_paid BOOLEAN DEFAULT false,
  notes TEXT,
  created_by UUID REFERENCES system_users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_lending_user ON lendings(user_id);
CREATE INDEX idx_lending_holding ON lendings(holding_id);
CREATE INDEX idx_lending_dates ON lendings(lend_date, due_date, return_date);
CREATE INDEX idx_lending_active ON lendings(return_date) WHERE return_date IS NULL;

-- Reservas
CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES library_users(id),
  holding_id UUID REFERENCES holdings(id),
  reservation_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  expiration_date TIMESTAMP WITH TIME ZONE,
  status VARCHAR(50) DEFAULT 'pending', -- pending, available, completed, cancelled
  notified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reservation_user ON reservations(user_id);
CREATE INDEX idx_reservation_holding ON reservations(holding_id);
CREATE INDEX idx_reservation_status ON reservations(status);

-- Controle de acesso (entrada/saída da biblioteca)
CREATE TABLE access_control (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES library_users(id),
  entry_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  exit_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_access_user ON access_control(user_id);
CREATE INDEX idx_access_date ON access_control(entry_time);

-- =====================================================
-- TABELAS DE AQUISIÇÕES
-- =====================================================

-- Fornecedores
CREATE TABLE suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  cnpj VARCHAR(18) UNIQUE,
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  contact_person VARCHAR(255),
  notes TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Requisições de compra
CREATE TABLE acquisition_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  requester_id UUID REFERENCES system_users(id),
  title VARCHAR(500) NOT NULL,
  author VARCHAR(255),
  isbn VARCHAR(20),
  publisher VARCHAR(255),
  quantity INTEGER DEFAULT 1,
  justification TEXT,
  priority VARCHAR(20) DEFAULT 'normal', -- low, normal, high, urgent
  status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected, ordered
  approved_by UUID REFERENCES system_users(id),
  approval_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Cotações
CREATE TABLE quotations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID REFERENCES acquisition_requests(id),
  supplier_id UUID REFERENCES suppliers(id),
  unit_price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  delivery_time INTEGER, -- dias
  notes TEXT,
  selected BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Pedidos de compra
CREATE TABLE purchase_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID REFERENCES acquisition_requests(id),
  supplier_id UUID REFERENCES suppliers(id),
  order_number VARCHAR(50),
  order_date DATE DEFAULT CURRENT_DATE,
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'ordered', -- ordered, received, cancelled
  expected_delivery DATE,
  received_date DATE,
  notes TEXT,
  created_by UUID REFERENCES system_users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABELAS DE MÍDIAS DIGITAIS
-- =====================================================

CREATE TABLE digital_media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  record_id UUID REFERENCES bibliographic_records(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  file_size INTEGER,
  file_url TEXT,
  description TEXT,
  uploaded_by UUID REFERENCES system_users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- VIEWS ÚTEIS
-- =====================================================

-- View de empréstimos ativos
CREATE VIEW active_lendings AS
SELECT 
  l.*,
  u.name as user_name,
  u.email as user_email,
  u.phone as user_phone,
  h.barcode,
  br.title,
  br.author,
  CASE 
    WHEN l.due_date < CURRENT_TIMESTAMP THEN true
    ELSE false
  END as is_overdue,
  CASE 
    WHEN l.due_date < CURRENT_TIMESTAMP 
    THEN EXTRACT(DAY FROM CURRENT_TIMESTAMP - l.due_date)::INTEGER
    ELSE 0
  END as days_overdue
FROM lendings l
JOIN library_users u ON l.user_id = u.id
JOIN holdings h ON l.holding_id = h.id
JOIN bibliographic_records br ON h.record_id = br.id
WHERE l.return_date IS NULL;

-- View de estatísticas de acervo
CREATE VIEW catalog_statistics AS
SELECT 
  material_type,
  COUNT(*) as total_records,
  SUM((SELECT COUNT(*) FROM holdings WHERE record_id = br.id)) as total_copies,
  SUM((SELECT COUNT(*) FROM holdings WHERE record_id = br.id AND status = 'available')) as available_copies
FROM bibliographic_records br
GROUP BY material_type;

-- =====================================================
-- DADOS INICIAIS
-- =====================================================

-- Role de administrador
INSERT INTO roles (name, description, permissions) VALUES
('admin', 'Administrador do Sistema', '["admin", "catalog_create", "catalog_edit", "catalog_delete", "user_create", "user_edit", "user_block", "circulation_lend", "circulation_return", "circulation_renew"]'),
('librarian', 'Bibliotecário', '["catalog_create", "catalog_edit", "user_create", "user_edit", "circulation_lend", "circulation_return", "circulation_renew"]'),
('assistant', 'Auxiliar', '["circulation_lend", "circulation_return", "circulation_renew"]');

-- Tipos de usuário padrão
INSERT INTO user_types (name, description, max_lendings, loan_days, max_renewals, fine_per_day) VALUES
('Estudante', 'Estudante regular', 3, 7, 2, 2.00),
('Professor', 'Professor', 5, 14, 3, 2.00),
('Comunidade', 'Membro da comunidade', 2, 7, 1, 2.00),
('Pesquisador', 'Pesquisador', 10, 30, 5, 2.00);

-- Configurações básicas
INSERT INTO configurations (key, value, description) VALUES
('library_name', 'Biblioteca Municipal', 'Nome da biblioteca'),
('library_email', 'biblioteca@exemplo.com', 'Email da biblioteca'),
('library_phone', '(21) 0000-0000', 'Telefone da biblioteca'),
('fine_per_day', '2.00', 'Multa por dia de atraso'),
('max_renewals', '2', 'Número máximo de renovações');

-- =====================================================
-- POLÍTICAS RLS (Row Level Security) - Opcional
-- =====================================================

-- Habilitar RLS nas tabelas principais
ALTER TABLE bibliographic_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE holdings ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE lendings ENABLE ROW LEVEL SECURITY;

-- Políticas para leitura pública do catálogo (exemplo)
CREATE POLICY "Catálogo público para leitura" ON bibliographic_records
  FOR SELECT USING (true);

CREATE POLICY "Holdings públicos para leitura" ON holdings
  FOR SELECT USING (true);

-- =====================================================
-- FUNÇÕES ÚTEIS
-- =====================================================

-- Função para calcular multa
CREATE OR REPLACE FUNCTION calculate_fine(
  p_due_date TIMESTAMP WITH TIME ZONE,
  p_return_date TIMESTAMP WITH TIME ZONE,
  p_fine_per_day DECIMAL
)
RETURNS DECIMAL AS $$
DECLARE
  days_late INTEGER;
BEGIN
  IF p_return_date > p_due_date THEN
    days_late := EXTRACT(DAY FROM p_return_date - p_due_date)::INTEGER;
    RETURN days_late * p_fine_per_day;
  ELSE
    RETURN 0;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Função para verificar disponibilidade
CREATE OR REPLACE FUNCTION is_available(p_holding_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM holdings 
    WHERE id = p_holding_id AND status = 'available'
  );
END;
$$ LANGUAGE plpgsql;
