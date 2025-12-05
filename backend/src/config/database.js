import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Carregar dotenv apenas em desenvolvimento
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const supabaseUrl = process.env.SUPABASE_URL?.trim();
const supabaseKey = (process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY)?.trim();
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY?.trim();

console.log('🔍 Debug variáveis:', {
  NODE_ENV: process.env.NODE_ENV,
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseKey,
  urlStart: supabaseUrl?.substring(0, 20),
  keyStart: supabaseKey?.substring(0, 20),
  keyLength: supabaseKey?.length,
  keyType: typeof supabaseKey
});

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis faltando:', { supabaseUrl, supabaseKey: supabaseKey?.substring(0, 50) + '...' });
  throw new Error('Variáveis de ambiente do Supabase não configuradas');
}

// Opções para o cliente Supabase
const options = {
  auth: {
    autoRefreshToken: true,
    persistSession: false
  }
};

// Cliente público (para operações normais)
export const supabase = createClient(supabaseUrl, supabaseKey, options);

// Cliente admin (para operações administrativas)
export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, options)
  : supabase;

export default supabase;
