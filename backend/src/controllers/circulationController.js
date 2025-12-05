import { supabase } from '../config/database.js';
import logger from '../config/logger.js';

export const circulationController = {
  // Realizar empréstimo
  async lendItem(req, res, next) {
    try {
      const { user_id, holding_id } = req.body;

      // Verificar status do usuário
      const { data: user } = await supabase
        .from('library_users')
        .select('*, user_types(*)')
        .eq('id', user_id)
        .eq('active', true)
        .single();

      if (!user) {
        return res.status(400).json({ error: 'Usuário inválido ou inativo' });
      }

      // Verificar se usuário está bloqueado
      if (user.blocked) {
        return res.status(400).json({ error: 'Usuário bloqueado' });
      }

      // Verificar limite de empréstimos
      const { count: activeLoans } = await supabase
        .from('lendings')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user_id)
        .is('return_date', null);

      if (activeLoans >= user.user_types.max_lendings) {
        return res.status(400).json({ error: 'Limite de empréstimos atingido' });
      }

      // Verificar disponibilidade do exemplar
      const { data: holding } = await supabase
        .from('holdings')
        .select('*')
        .eq('id', holding_id)
        .eq('status', 'available')
        .single();

      if (!holding) {
        return res.status(400).json({ error: 'Exemplar indisponível' });
      }

      // Calcular data de devolução
      const lendDate = new Date();
      const dueDate = new Date(lendDate);
      dueDate.setDate(dueDate.getDate() + user.user_types.loan_days);

      // Criar empréstimo
      const { data: lending, error } = await supabase
        .from('lendings')
        .insert({
          user_id,
          holding_id,
          lend_date: lendDate.toISOString(),
          due_date: dueDate.toISOString(),
          created_by: req.user.id,
        })
        .select()
        .single();

      if (error) throw error;

      // Atualizar status do exemplar
      await supabase
        .from('holdings')
        .update({ status: 'lent' })
        .eq('id', holding_id);

      logger.info(`Empréstimo realizado: ${lending.id}`);
      res.status(201).json(lending);
    } catch (error) {
      next(error);
    }
  },

  // Realizar devolução
  async returnItem(req, res, next) {
    try {
      const { id } = req.params;

      const { data: lending } = await supabase
        .from('lendings')
        .select('*, holdings(*), library_users(*, user_types(*))')
        .eq('id', id)
        .single();

      if (!lending) {
        return res.status(404).json({ error: 'Empréstimo não encontrado' });
      }

      if (lending.return_date) {
        return res.status(400).json({ error: 'Item já devolvido' });
      }

      const returnDate = new Date();
      const dueDate = new Date(lending.due_date);

      // Calcular multa se houver atraso
      let fine = 0;
      if (returnDate > dueDate) {
        const daysLate = Math.ceil((returnDate - dueDate) / (1000 * 60 * 60 * 24));
        fine = daysLate * lending.library_users.user_types.fine_per_day;
      }

      // Atualizar empréstimo
      const { data: updatedLending, error } = await supabase
        .from('lendings')
        .update({
          return_date: returnDate.toISOString(),
          fine_amount: fine,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Atualizar status do exemplar
      await supabase
        .from('holdings')
        .update({ status: 'available' })
        .eq('id', lending.holding_id);

      // Verificar se há reservas
      const { data: reservation } = await supabase
        .from('reservations')
        .select('*')
        .eq('holding_id', lending.holding_id)
        .eq('status', 'pending')
        .order('created_at', { ascending: true })
        .limit(1)
        .single();

      if (reservation) {
        await supabase
          .from('reservations')
          .update({ status: 'available' })
          .eq('id', reservation.id);
      }

      logger.info(`Devolução realizada: ${id}`);
      res.json({ ...updatedLending, hasReservation: !!reservation });
    } catch (error) {
      next(error);
    }
  },

  // Renovar empréstimo
  async renewLending(req, res, next) {
    try {
      const { id } = req.params;

      const { data: lending } = await supabase
        .from('lendings')
        .select('*, library_users(*, user_types(*)), holdings(*)')
        .eq('id', id)
        .single();

      if (!lending || lending.return_date) {
        return res.status(400).json({ error: 'Empréstimo inválido' });
      }

      if (lending.renewals >= lending.library_users.user_types.max_renewals) {
        return res.status(400).json({ error: 'Limite de renovações atingido' });
      }

      // Verificar se há reservas para o item
      const { data: reservations } = await supabase
        .from('reservations')
        .select('id')
        .eq('holding_id', lending.holding_id)
        .eq('status', 'pending');

      if (reservations && reservations.length > 0) {
        return res.status(400).json({ error: 'Há reservas pendentes para este item' });
      }

      // Nova data de devolução
      const newDueDate = new Date(lending.due_date);
      newDueDate.setDate(newDueDate.getDate() + lending.library_users.user_types.loan_days);

      const { data: updated, error } = await supabase
        .from('lendings')
        .update({
          due_date: newDueDate.toISOString(),
          renewals: lending.renewals + 1,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      logger.info(`Empréstimo renovado: ${id}`);
      res.json(updated);
    } catch (error) {
      next(error);
    }
  },

  // Listar empréstimos
  async listLendings(req, res, next) {
    try {
      const { user_id, status, page = 1, limit = 20 } = req.query;
      const offset = (page - 1) * limit;

      let query = supabase
        .from('lendings')
        .select('*, library_users(name, email), holdings(barcode, bibliographic_records(title, author))', { count: 'exact' })
        .order('lend_date', { ascending: false })
        .range(offset, offset + limit - 1);

      if (user_id) query = query.eq('user_id', user_id);
      if (status === 'active') query = query.is('return_date', null);
      if (status === 'returned') query = query.not('return_date', 'is', null);

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

  // Empréstimos atrasados
  async overdueLendings(req, res, next) {
    try {
      const today = new Date().toISOString();

      const { data, error } = await supabase
        .from('lendings')
        .select('*, library_users(name, email, phone), holdings(barcode, bibliographic_records(title))')
        .is('return_date', null)
        .lt('due_date', today)
        .order('due_date', { ascending: true });

      if (error) throw error;

      res.json({ data, count: data.length });
    } catch (error) {
      next(error);
    }
  },
};
