import { supabase } from '../config/database.js';
import logger from '../config/logger.js';

export const publicCatalogController = {
  // Buscar livros (público)
  async searchBooks(req, res, next) {
    try {
      const { q } = req.query;

      if (!q || q.trim().length < 2) {
        return res.status(400).json({ 
          error: 'Termo de busca deve ter pelo menos 2 caracteres' 
        });
      }

      const searchTerm = `%${q}%`;

      // Buscar registros bibliográficos com contagem de exemplares
      const { data, error, count } = await supabase
        .from('bibliographic_records')
        .select(`
          *,
          holdings:holdings(count)
        `, { count: 'exact' })
        .or(`title.ilike.${searchTerm},author.ilike.${searchTerm},isbn.ilike.${searchTerm},publisher.ilike.${searchTerm}`)
        .order('title');

      if (error) throw error;

      // Calcular exemplares disponíveis para cada livro
      const booksWithAvailability = await Promise.all(
        data.map(async (book) => {
          const { count: availableCount } = await supabase
            .from('holdings')
            .select('*', { count: 'exact', head: true })
            .eq('bibliographic_record_id', book.id)
            .eq('status', 'available');

          const { count: totalCount } = await supabase
            .from('holdings')
            .select('*', { count: 'exact', head: true })
            .eq('bibliographic_record_id', book.id);

          return {
            ...book,
            available_copies: availableCount || 0,
            total_copies: totalCount || 0,
          };
        })
      );

      logger.info(`Busca pública: "${q}" - ${count} resultados`);

      res.json({
        data: booksWithAvailability,
        count,
      });
    } catch (error) {
      next(error);
    }
  },

  // Livros em destaque (público)
  async getFeaturedBooks(req, res, next) {
    try {
      // Buscar últimos livros adicionados
      const { data, error } = await supabase
        .from('bibliographic_records')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(12);

      if (error) throw error;

      // Calcular disponibilidade
      const booksWithAvailability = await Promise.all(
        data.map(async (book) => {
          const { count: availableCount } = await supabase
            .from('holdings')
            .select('*', { count: 'exact', head: true })
            .eq('bibliographic_record_id', book.id)
            .eq('status', 'available');

          const { count: totalCount } = await supabase
            .from('holdings')
            .select('*', { count: 'exact', head: true })
            .eq('bibliographic_record_id', book.id);

          return {
            ...book,
            available_copies: availableCount || 0,
            total_copies: totalCount || 0,
          };
        })
      );

      res.json({
        data: booksWithAvailability,
        count: data.length,
      });
    } catch (error) {
      next(error);
    }
  },

  // Detalhes de um livro (público)
  async getBookDetails(req, res, next) {
    try {
      const { id } = req.params;

      const { data, error } = await supabase
        .from('bibliographic_records')
        .select('*, holdings(*)')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (!data) {
        return res.status(404).json({ error: 'Livro não encontrado' });
      }

      // Calcular disponibilidade
      const availableCount = data.holdings.filter(h => h.status === 'available').length;

      const bookWithAvailability = {
        ...data,
        available_copies: availableCount,
        total_copies: data.holdings.length,
      };

      res.json(bookWithAvailability);
    } catch (error) {
      next(error);
    }
  },
};
