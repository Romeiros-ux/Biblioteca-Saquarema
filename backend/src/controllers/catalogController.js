import { supabase } from '../config/database.js';
import logger from '../config/logger.js';

export const catalogController = {
  // Listar registros bibliográficos
  async listRecords(req, res, next) {
    try {
      const { page = 1, limit = 20, search, material_type } = req.query;
      const offset = (page - 1) * limit;

      let query = supabase
        .from('bibliographic_records')
        .select('*, holdings(count)', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (search) {
        query = query.or(`title.ilike.%${search}%,author.ilike.%${search}%,isbn.ilike.%${search}%`);
      }

      if (material_type) {
        query = query.eq('material_type', material_type);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      res.json({
        data,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          pages: Math.ceil(count / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // Buscar registro por ID
  async getRecord(req, res, next) {
    try {
      const { id } = req.params;

      const { data, error } = await supabase
        .from('bibliographic_records')
        .select('*, holdings(*)')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) return res.status(404).json({ error: 'Registro não encontrado' });

      res.json(data);
    } catch (error) {
      next(error);
    }
  },

  // Criar novo registro
  async createRecord(req, res, next) {
    try {
      const recordData = req.body;
      recordData.created_by = req.user.id;

      const { data, error } = await supabase
        .from('bibliographic_records')
        .insert(recordData)
        .select()
        .single();

      if (error) throw error;

      logger.info(`Registro bibliográfico criado: ${data.id}`);
      res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  },

  // Atualizar registro
  async updateRecord(req, res, next) {
    try {
      const { id } = req.params;
      const updates = req.body;
      updates.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from('bibliographic_records')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      logger.info(`Registro bibliográfico atualizado: ${id}`);
      res.json(data);
    } catch (error) {
      next(error);
    }
  },

  // Deletar registro
  async deleteRecord(req, res, next) {
    try {
      const { id } = req.params;

      // Verificar se há exemplares
      const { data: holdings } = await supabase
        .from('holdings')
        .select('id')
        .eq('record_id', id);

      if (holdings && holdings.length > 0) {
        return res.status(400).json({ 
          error: 'Não é possível excluir um registro com exemplares cadastrados' 
        });
      }

      const { error } = await supabase
        .from('bibliographic_records')
        .delete()
        .eq('id', id);

      if (error) throw error;

      logger.info(`Registro bibliográfico deletado: ${id}`);
      res.json({ message: 'Registro excluído com sucesso' });
    } catch (error) {
      next(error);
    }
  },

  // Busca avançada
  async advancedSearch(req, res, next) {
    try {
      const { title, author, subject, isbn, year, material_type } = req.body;

      let query = supabase.from('bibliographic_records').select('*');

      if (title) query = query.ilike('title', `%${title}%`);
      if (author) query = query.ilike('author', `%${author}%`);
      if (subject) query = query.ilike('subject', `%${subject}%`);
      if (isbn) query = query.eq('isbn', isbn);
      if (year) query = query.eq('publication_year', year);
      if (material_type) query = query.eq('material_type', material_type);

      const { data, error } = await query.limit(100);

      if (error) throw error;

      res.json({ data, count: data.length });
    } catch (error) {
      next(error);
    }
  },
};
