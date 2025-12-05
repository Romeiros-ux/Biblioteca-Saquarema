import { supabase } from '../config/database.js';
import bcrypt from 'bcryptjs';

export const userController = {
  // Listar usuários (leitores)
  async listUsers(req, res, next) {
    try {
      const { page = 1, limit = 20, search, type } = req.query;
      const offset = (page - 1) * limit;

      let query = supabase
        .from('library_users')
        .select('*, user_types(name)', { count: 'exact' })
        .order('name')
        .range(offset, offset + limit - 1);

      if (search) {
        query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,cpf.ilike.%${search}%`);
      }

      if (type) query = query.eq('user_type_id', type);

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

  // Buscar usuário por ID
  async getUser(req, res, next) {
    try {
      const { id } = req.params;

      const { data, error } = await supabase
        .from('library_users')
        .select('*, user_types(*)')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) return res.status(404).json({ error: 'Usuário não encontrado' });

      res.json(data);
    } catch (error) {
      next(error);
    }
  },

  // Criar usuário
  async createUser(req, res, next) {
    try {
      const userData = req.body;

      // Verificar se CPF já existe
      if (userData.cpf) {
        const { data: existing } = await supabase
          .from('library_users')
          .select('id')
          .eq('cpf', userData.cpf)
          .single();

        if (existing) {
          return res.status(400).json({ error: 'CPF já cadastrado' });
        }
      }

      userData.created_by = req.user.id;
      userData.active = true;

      const { data, error } = await supabase
        .from('library_users')
        .insert(userData)
        .select()
        .single();

      if (error) throw error;

      res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  },

  // Atualizar usuário
  async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const updates = req.body;
      updates.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from('library_users')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      res.json(data);
    } catch (error) {
      next(error);
    }
  },

  // Bloquear/Desbloquear usuário
  async toggleBlock(req, res, next) {
    try {
      const { id } = req.params;
      const { blocked, block_reason } = req.body;

      const { data, error } = await supabase
        .from('library_users')
        .update({ blocked, block_reason })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      res.json(data);
    } catch (error) {
      next(error);
    }
  },

  // Histórico de empréstimos do usuário
  async getUserHistory(req, res, next) {
    try {
      const { id } = req.params;

      const { data, error } = await supabase
        .from('lendings')
        .select('*, holdings(barcode, bibliographic_records(title, author))')
        .eq('user_id', id)
        .order('lend_date', { ascending: false });

      if (error) throw error;

      res.json({ data, count: data.length });
    } catch (error) {
      next(error);
    }
  },

  // Listar tipos de usuário
  async getUserTypes(req, res, next) {
    try {
      const { data, error } = await supabase
        .from('user_types')
        .select('*')
        .order('name');

      if (error) throw error;

      res.json(data);
    } catch (error) {
      next(error);
    }
  },
};
