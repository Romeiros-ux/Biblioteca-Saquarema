import xlsx from 'xlsx';
import { supabaseAdmin } from '../config/database.js';
import logger from '../config/logger.js';

export const importController = {
  // Importar livros de arquivo Excel
  async importFromExcel(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Nenhum arquivo enviado' });
      }

      // Verificar se SERVICE_KEY está configurada
      const serviceKey = process.env.SUPABASE_SERVICE_KEY?.trim();
      if (!serviceKey) {
        logger.error('❌ SUPABASE_SERVICE_KEY não configurada - importação falhará por RLS');
        return res.status(500).json({ 
          error: 'Configuração incorreta',
          message: 'SUPABASE_SERVICE_KEY não está configurada no servidor. Configure a variável de ambiente e tente novamente.'
        });
      }

      // Log para debug da chave
      logger.info('🔑 SERVICE_KEY info:', {
        length: serviceKey.length,
        start: serviceKey.substring(0, 30),
        end: serviceKey.substring(serviceKey.length - 30)
      });

      // Testar conexão com supabaseAdmin antes de importar
      try {
        const { data: testData, error: testError } = await supabaseAdmin
          .from('bibliographic_records')
          .select('id')
          .limit(1);
        
        if (testError) {
          logger.error('❌ Erro ao testar supabaseAdmin:', testError);
          return res.status(500).json({
            error: 'Erro de autenticação Supabase',
            message: `SERVICE_KEY inválida ou sem permissões: ${testError.message}`,
            details: testError
          });
        }
        
        logger.info('✅ supabaseAdmin validado com sucesso');
      } catch (testErr) {
        logger.error('❌ Exceção ao testar supabaseAdmin:', testErr);
        return res.status(500).json({
          error: 'Erro ao validar conexão',
          message: testErr.message
        });
      }

      // Ler arquivo Excel do buffer
      const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(sheet);

      logger.info(`Iniciando importação de ${data.length} registros`);

      let imported = 0;
      let errors = 0;
      const errorDetails = [];

      for (const row of data) {
        try {
          // Mapear campos da planilha
          const bookData = {
            title: row['Título principal'] || row['Título'] || row['TÍTULO'] || row['titulo'] || 'Sem título',
            subtitle: row['Subtítulo'] || row['SUBTÍTULO'] || null,
            author: row['Autor'] || row['AUTOR'] || row['autor'] || null,
            publisher: row['Editora'] || row['EDITORA'] || row['editora'] || null,
            publication_year: row['Ano'] || row['ANO'] || row['ano'] || null,
            isbn: row['ISBN'] || row['isbn'] || null,
            call_number: row['Classificação'] || row['CLASSIFICAÇÃO'] || row['Tombo'] || row['TOMBO'] || null,
            material_type: 'book',
            language: 'pt',
            pages: row['Páginas'] || row['PÁGINAS'] || null,
            edition: row['Edição'] || row['EDIÇÃO'] || null,
            notes: row['Observações'] || row['OBSERVAÇÕES'] || null,
            subject: row['Assunto'] ? [row['Assunto']] : [],
            created_by: req.user.id,
          };

          // Inserir registro bibliográfico (usando supabaseAdmin para bypass RLS)
          const { data: record, error: recordError } = await supabaseAdmin
            .from('bibliographic_records')
            .insert(bookData)
            .select()
            .single();

          if (recordError) {
            errors++;
            errorDetails.push({ title: bookData.title, error: recordError.message });
            continue;
          }

          // Criar exemplar (usando supabaseAdmin para bypass RLS)
          const holdingData = {
            bibliographic_record_id: record.id,
            barcode: row['Código de Barras'] || row['CÓDIGO'] || null,
            acquisition_date: row['Data Aquisição'] || new Date().toISOString(),
            status: 'available',
            location: row['Localização'] || row['LOCALIZAÇÃO'] || 'Acervo Principal',
          };

          await supabaseAdmin.from('holdings').insert(holdingData);
          imported;

        } catch (error) {
          errors++;
          errorDetails.push({ title: row['Título'] || 'Desconhecido', error: error.message });
        }
      }

      logger.info(`Importação concluída: ${imported} sucesso, ${errors} erros`);

      res.json({
        message: 'Importação concluída',
        imported,
        errors,
        total: data.length,
        errorDetails: errorDetails.slice(0, 10), // Primeiros 10 erros
      });

    } catch (error) {
      next(error);
    }
  },

  // Limpar todos os livros
  async clearAllBooks(req, res, next) {
    try {
      // Remover exemplares (usando supabaseAdmin para bypass RLS)
      await supabaseAdmin
        .from('holdings')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      // Remover registros bibliográficos (usando supabaseAdmin para bypass RLS)
      const { error } = await supabaseAdmin
        .from('bibliographic_records')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (error) throw error;

      logger.info('Todos os livros foram removidos');

      res.json({ message: 'Todos os livros foram removidos com sucesso' });
    } catch (error) {
      next(error);
    }
  },

  // Preview do arquivo antes de importar
  async previewExcel(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Nenhum arquivo enviado' });
      }

      const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(sheet);

      // Log para debug - ver nomes reais das colunas
      if (data.length > 0) {
        logger.info('Colunas encontradas na planilha:', Object.keys(data[0]));
      }

      // Retornar apenas os primeiros 10 registros como preview
      const preview = data.slice(0, 10).map(row => ({
        title: row['Título principal'] || row['Título'] || row['TÍTULO'] || row['titulo'],
        author: row['Autor'] || row['AUTOR'] || row['autor'],
        publisher: row['Editora'] || row['EDITORA'] || row['editora'],
        year: row['Ano'] || row['ANO'] || row['ano'],
        isbn: row['ISBN'] || row['isbn'],
      }));

      res.json({
        total: data.length,
        preview,
        columns: Object.keys(data[0] || {}),
      });

    } catch (error) {
      next(error);
    }
  },
};
