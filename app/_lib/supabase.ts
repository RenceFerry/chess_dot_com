import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.DATABASE_URL!,
  process.env.SUPABASE_PUBLISHABLE_KEY!
)

export default supabase;