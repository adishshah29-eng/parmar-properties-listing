import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Note: This client uses the SERVICE ROLE key and bypasses Row Level Security.
// ONLY use this on the server for admin tasks, NEVER in client components.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}
