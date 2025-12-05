-- =====================================================
-- DADOS DE EXEMPLO PARA DESENVOLVIMENTO/TESTES
-- =====================================================

-- Usuário administrador padrão (senha: admin123)
-- Hash BCrypt de 'admin123'
INSERT INTO system_users (name, email, password_hash, role_id, active) 
SELECT 
  'Administrador',
  'admin@biblioteca.com',
  '$2a$10$elLVUSrSvUIbDj3UajQ8hOEvFp1fExyQxkTDNYUIn9.yk9kdzS/Ka',
  id,
  true
FROM roles WHERE name = 'admin';

-- Bibliotecário de exemplo
INSERT INTO system_users (name, email, password_hash, role_id, active)
SELECT
  'Maria Silva',
  'maria@biblioteca.com',
  '$2a$10$elLVUSrSvUIbDj3UajQ8hOEvFp1fExyQxkTDNYUIn9.yk9kdzS/Ka',
  id,
  true
FROM roles WHERE name = 'librarian';

-- =====================================================
-- REGISTROS BIBLIOGRÁFICOS DE EXEMPLO
-- =====================================================

INSERT INTO bibliographic_records 
(title, subtitle, author, isbn, publisher, publication_year, publication_place, edition, pages, language, call_number, subject, keywords, material_type, description)
VALUES
(
  'Dom Casmurro',
  NULL,
  'Machado de Assis',
  '978-8535908770',
  'Companhia das Letras',
  2008,
  'São Paulo',
  '1ª',
  256,
  'pt',
  'B869.3',
  ARRAY['Literatura Brasileira', 'Romance', 'Século XIX'],
  ARRAY['realismo', 'ciúme', 'literatura clássica'],
  'book',
  'Romance clássico da literatura brasileira que narra a história de Bentinho e Capitu.'
),
(
  'O Cortiço',
  NULL,
  'Aluísio Azevedo',
  '978-8508040506',
  'Ática',
  2012,
  'São Paulo',
  '3ª',
  192,
  'pt',
  'B869.3',
  ARRAY['Literatura Brasileira', 'Romance', 'Naturalismo'],
  ARRAY['naturalismo', 'sociedade', 'brasil'],
  'book',
  'Romance naturalista que retrata a vida em um cortiço no Rio de Janeiro.'
),
(
  'Clean Code',
  'A Handbook of Agile Software Craftsmanship',
  'Robert C. Martin',
  '978-0132350884',
  'Prentice Hall',
  2008,
  'Boston',
  '1ª',
  464,
  'en',
  '005.1',
  ARRAY['Programação', 'Engenharia de Software', 'Boas Práticas'],
  ARRAY['código limpo', 'agile', 'desenvolvimento'],
  'book',
  'Guia essencial sobre práticas de programação e código limpo.'
),
(
  '1984',
  NULL,
  'George Orwell',
  '978-8535914849',
  'Companhia das Letras',
  2009,
  'São Paulo',
  '1ª',
  416,
  'pt',
  '823',
  ARRAY['Ficção', 'Distopia', 'Literatura Inglesa'],
  ARRAY['totalitarismo', 'vigilância', 'distopia'],
  'book',
  'Clássico distópico sobre um regime totalitário de vigilância.'
);

-- =====================================================
-- EXEMPLARES (HOLDINGS) DE EXEMPLO
-- =====================================================

-- Adicionar exemplares aos livros
DO $$
DECLARE
  record_dom_casmurro UUID;
  record_cortico UUID;
  record_clean_code UUID;
  record_1984 UUID;
BEGIN
  SELECT id INTO record_dom_casmurro FROM bibliographic_records WHERE isbn = '978-8535908770';
  SELECT id INTO record_cortico FROM bibliographic_records WHERE isbn = '978-8508040506';
  SELECT id INTO record_clean_code FROM bibliographic_records WHERE isbn = '978-0132350884';
  SELECT id INTO record_1984 FROM bibliographic_records WHERE isbn = '978-8535914849';

  -- Dom Casmurro - 3 exemplares
  INSERT INTO holdings (record_id, barcode, accession_number, location, status, acquisition_date, acquisition_type)
  VALUES
    (record_dom_casmurro, '0001001', '2024-001', 'Estante A1 - Literatura Brasileira', 'available', '2024-01-15', 'purchase'),
    (record_dom_casmurro, '0001002', '2024-002', 'Estante A1 - Literatura Brasileira', 'available', '2024-01-15', 'purchase'),
    (record_dom_casmurro, '0001003', '2024-003', 'Estante A1 - Literatura Brasileira', 'lent', '2024-01-15', 'purchase');

  -- O Cortiço - 2 exemplares
  INSERT INTO holdings (record_id, barcode, accession_number, location, status, acquisition_date, acquisition_type)
  VALUES
    (record_cortico, '0002001', '2024-004', 'Estante A1 - Literatura Brasileira', 'available', '2024-01-20', 'purchase'),
    (record_cortico, '0002002', '2024-005', 'Estante A1 - Literatura Brasileira', 'available', '2024-01-20', 'donation');

  -- Clean Code - 2 exemplares
  INSERT INTO holdings (record_id, barcode, accession_number, location, status, acquisition_date, acquisition_type)
  VALUES
    (record_clean_code, '0003001', '2024-006', 'Estante B2 - Tecnologia', 'available', '2024-02-01', 'purchase'),
    (record_clean_code, '0003002', '2024-007', 'Estante B2 - Tecnologia', 'available', '2024-02-01', 'purchase');

  -- 1984 - 4 exemplares
  INSERT INTO holdings (record_id, barcode, accession_number, location, status, acquisition_date, acquisition_type)
  VALUES
    (record_1984, '0004001', '2024-008', 'Estante A2 - Ficção', 'available', '2024-02-10', 'purchase'),
    (record_1984, '0004002', '2024-009', 'Estante A2 - Ficção', 'available', '2024-02-10', 'purchase'),
    (record_1984, '0004003', '2024-010', 'Estante A2 - Ficção', 'lent', '2024-02-10', 'donation'),
    (record_1984, '0004004', '2024-011', 'Estante A2 - Ficção', 'available', '2024-02-10', 'purchase');
END $$;

-- =====================================================
-- USUÁRIOS (LEITORES) DE EXEMPLO
-- =====================================================

DO $$
DECLARE
  user_type_student UUID;
  user_type_teacher UUID;
  admin_id UUID;
BEGIN
  SELECT id INTO user_type_student FROM user_types WHERE name = 'Estudante';
  SELECT id INTO user_type_teacher FROM user_types WHERE name = 'Professor';
  SELECT id INTO admin_id FROM system_users WHERE email = 'admin@biblioteca.com';

  INSERT INTO library_users 
  (user_type_id, name, cpf, email, phone, mobile, address, neighborhood, city, state, zip_code, active, registration_date, created_by)
  VALUES
    (
      user_type_student,
      'João Silva Santos',
      '123.456.789-00',
      'joao.santos@email.com',
      '(21) 3333-4444',
      '(21) 98888-9999',
      'Rua das Flores, 123',
      'Centro',
      'Saquarema',
      'RJ',
      '28990-000',
      true,
      CURRENT_DATE - INTERVAL '3 months',
      admin_id
    ),
    (
      user_type_student,
      'Ana Paula Oliveira',
      '987.654.321-00',
      'ana.oliveira@email.com',
      NULL,
      '(21) 97777-8888',
      'Av. Principal, 456',
      'Jaconé',
      'Saquarema',
      'RJ',
      '28990-000',
      true,
      CURRENT_DATE - INTERVAL '2 months',
      admin_id
    ),
    (
      user_type_teacher,
      'Prof. Carlos Eduardo',
      '111.222.333-44',
      'carlos.eduardo@escola.com',
      '(21) 3344-5566',
      '(21) 96666-7777',
      'Rua da Escola, 789',
      'Bacaxá',
      'Saquarema',
      'RJ',
      '28990-000',
      true,
      CURRENT_DATE - INTERVAL '6 months',
      admin_id
    ),
    (
      user_type_student,
      'Mariana Costa',
      '555.666.777-88',
      'mariana.costa@email.com',
      NULL,
      '(21) 95555-6666',
      'Rua das Palmeiras, 321',
      'Itaúna',
      'Saquarema',
      'RJ',
      '28990-000',
      true,
      CURRENT_DATE - INTERVAL '1 month',
      admin_id
    );
END $$;

-- =====================================================
-- EMPRÉSTIMOS DE EXEMPLO
-- =====================================================

DO $$
DECLARE
  user_joao UUID;
  user_carlos UUID;
  holding_dom_casmurro UUID;
  holding_1984 UUID;
  admin_id UUID;
BEGIN
  SELECT id INTO user_joao FROM library_users WHERE cpf = '123.456.789-00';
  SELECT id INTO user_carlos FROM library_users WHERE cpf = '111.222.333-44';
  SELECT id INTO holding_dom_casmurro FROM holdings WHERE barcode = '0001003';
  SELECT id INTO holding_1984 FROM holdings WHERE barcode = '0004003';
  SELECT id INTO admin_id FROM system_users WHERE email = 'admin@biblioteca.com';

  -- Empréstimo ativo de João (vence em 2 dias)
  INSERT INTO lendings (user_id, holding_id, lend_date, due_date, created_by)
  VALUES (
    user_joao,
    holding_dom_casmurro,
    CURRENT_TIMESTAMP - INTERVAL '5 days',
    CURRENT_TIMESTAMP + INTERVAL '2 days',
    admin_id
  );

  -- Empréstimo ativo de Carlos (vencido há 3 dias)
  INSERT INTO lendings (user_id, holding_id, lend_date, due_date, fine_amount, created_by)
  VALUES (
    user_carlos,
    holding_1984,
    CURRENT_TIMESTAMP - INTERVAL '17 days',
    CURRENT_TIMESTAMP - INTERVAL '3 days',
    6.00, -- 3 dias * R$ 2,00
    admin_id
  );
END $$;

-- =====================================================
-- FORNECEDORES DE EXEMPLO
-- =====================================================

INSERT INTO suppliers (name, cnpj, email, phone, contact_person, active)
VALUES
  ('Livraria Cultura', '12.345.678/0001-90', 'vendas@cultura.com.br', '(11) 3333-4444', 'Pedro Mendes', true),
  ('Saraiva Educação', '98.765.432/0001-10', 'contato@saraiva.com.br', '(11) 2222-3333', 'Ana Santos', true),
  ('Distribuidora de Livros ABC', '55.666.777/0001-88', 'abc@livros.com', '(21) 4444-5555', 'Carlos Lima', true);

-- =====================================================
-- FIM DOS DADOS DE EXEMPLO
-- =====================================================
