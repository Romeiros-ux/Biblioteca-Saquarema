import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Variáveis de ambiente do Supabase não configuradas');
}

// Cliente público (para operações normais)
export const supabase = createClient(supabaseUrl, supabaseKey);

// Cliente admin (para operações administrativas)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export default supabase;
