import { createClient } from '@supabase/supabase-js';

export const SupabaseProvider = {
  provide: 'SUPABASE_CLIENT',
  useFactory: () => {
    const supabaseUrl = process.env.DATABASE_URL;
    const supabaseKey = process.env.DATABASE_APIKEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Faltan variables de entorno para conectar con Supabase');
    }

    return createClient(supabaseUrl, supabaseKey);
  },
};
