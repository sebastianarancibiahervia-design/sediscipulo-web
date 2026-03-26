import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Enhanced logging for production debugging
if (typeof window !== 'undefined') {
  if (supabaseUrl === 'https://placeholder.supabase.co') {
    console.warn('⚠️ [Supabase Client] Usando valores de marcador (PLACEHOLDER). Verifica las variables de entorno en Vercel.');
  } else {
    console.log('✅ [Supabase Client] Inicializado con éxito.');
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
