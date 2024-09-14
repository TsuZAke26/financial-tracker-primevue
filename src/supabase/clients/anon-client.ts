import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

const anonClient = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_KEY as string
)

export { anonClient }
