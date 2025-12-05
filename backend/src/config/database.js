import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Carregar dotenv apenas em desenvolvimento
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

console.log('🔍 Debug variáveis:', {
  NODE_ENV: process.env.NODE_ENV,
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseKey,
  urlStart: supabaseUrl?.substring(0, 20),
  keyStart: supabaseKey?.substring(0, 20)
});

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Variáveis de ambiente do Supabase não configuradas');
}

// Cliente público (para operações normais)
export const supabase = createClient(supabaseUrl, supabaseKey);

// Cliente admin (para operações administrativas)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export default supabase;
