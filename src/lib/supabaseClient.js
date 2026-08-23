import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

// Fail loudly and early. Without this, createClient throws from deep inside the
// library, or worse produces confusing 401s later on.
if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing Supabase environment variables. Copy .env.example to .env.local ' +
      'and set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.',
  )
}

// No options object on purpose. The defaults — persistSession,
// autoRefreshToken, and detectSessionInUrl (which is what consumes the
// password-recovery link) — are exactly what the auth flow relies on.
export const supabase = createClient(supabaseUrl, supabaseKey)
