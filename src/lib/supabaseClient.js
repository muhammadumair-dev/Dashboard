import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase project credentials
// You can find them in your Supabase project dashboard under:
// Settings > API > Project URL / anon public
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://kfoyibjewuvpxrseugyc.supabase.co';
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_d83my_1WlEHHrNfxog7h2g_6FcuWQ5Q';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Table names
export const TABLES = {
  PRODUCTS: 'products',
  ORDERS: 'public_orders',
  COMMENTS: 'comments',
  CATEGORIES: 'categories',
};
