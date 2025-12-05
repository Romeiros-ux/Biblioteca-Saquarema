import { supabase } from '../config/database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import logger from '../config/logger.js';

export const authController = {
  // Login
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const { data: user, error } = await supabase
        .from('system_users')
        .select('*, roles(name, permissions)')
        .eq('email', email)
        .eq('active', true)
        .single();

      if (error || !user) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      const validPassword = await bcrypt.compare(password, user.password_hash);
      if (!validPassword) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.roles.name,
          permissions: user.roles.permissions,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      logger.info(`Login bem-sucedido: ${email}`);

      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.roles.name,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // Registro de novo usuário do sistema
  async register(req, res, next) {
    try {
      const { name, email, password, role_id } = req.body;

      // Verificar se email já existe
      const { data: existing } = await supabase
        .from('system_users')
        .select('id')
        .eq('email', email)
        .single();

      if (existing) {
        return res.status(400).json({ error: 'Email já cadastrado' });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const { data: user, error } = await supabase
        .from('system_users')
        .insert({
          name,
          email,
          password_hash: passwordHash,
          role_id,
          active: true,
        })
        .select()
        .single();

      if (error) throw error;

      logger.info(`Novo usuário registrado: ${email}`);

      res.status(201).json({
        message: 'Usuário criado com sucesso',
        user: { id: user.id, name: user.name, email: user.email },
      });
    } catch (error) {
      next(error);
    }
  },

  // Verificar token
  async verifyToken(req, res) {
    res.json({ valid: true, user: req.user });
  },

  // Atualizar senha
  async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;

      const { data: user } = await supabase
        .from('system_users')
        .select('password_hash')
        .eq('id', userId)
        .single();

      const validPassword = await bcrypt.compare(currentPassword, user.password_hash);
      if (!validPassword) {
        return res.status(400).json({ error: 'Senha atual incorreta' });
      }

      const newPasswordHash = await bcrypt.hash(newPassword, 10);

      await supabase
        .from('system_users')
        .update({ password_hash: newPasswordHash })
        .eq('id', userId);

      res.json({ message: 'Senha alterada com sucesso' });
    } catch (error) {
      next(error);
    }
  },

  // Listar todos os usuários do sistema
  async getUsers(req, res, next) {
    try {
      const { data: users, error } = await supabase
        .from('system_users')
        .select('id, name, email, role_id, active, created_at, roles(id, name)')
        .order('name');

      if (error) throw error;

      // Formatar resposta
      const formattedUsers = users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role_id: user.role_id,
        role_name: user.roles?.name || 'N/A',
        active: user.active,
        created_at: user.created_at
      }));

      res.json({ users: formattedUsers });
    } catch (error) {
      next(error);
    }
  },

  // Atualizar usuário do sistema
  async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const { name, email, password, role_id, active } = req.body;

      const updateData = {
        name,
        email,
        role_id,
        active,
        updated_at: new Date().toISOString()
      };

      // Se senha foi fornecida, atualizar também
      if (password) {
        updateData.password_hash = await bcrypt.hash(password, 10);
      }

      const { data: user, error } = await supabase
        .from('system_users')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      logger.info(`Usuário atualizado: ${email}`);

      res.json({
        message: 'Usuário atualizado com sucesso',
        user: { id: user.id, name: user.name, email: user.email }
      });
    } catch (error) {
      next(error);
    }
  },

  // Excluir usuário do sistema
  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;

      // Não permitir excluir o próprio usuário
      if (id === req.user.id) {
        return res.status(400).json({ error: 'Você não pode excluir sua própria conta' });
      }

      const { error } = await supabase
        .from('system_users')
        .delete()
        .eq('id', id);

      if (error) throw error;

      logger.info(`Usuário excluído: ${id}`);

      res.json({ message: 'Usuário excluído com sucesso' });
    } catch (error) {
      next(error);
    }
  },

  // Listar perfis/funções disponíveis
  async getRoles(req, res, next) {
    try {
      const { data: roles, error } = await supabase
        .from('roles')
        .select('*')
        .order('name');

      if (error) throw error;

      res.json({ roles });
    } catch (error) {
      next(error);
    }
  },
};
