import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

function isSupabaseConfigured(): boolean {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    return !!(url && key && 
               url !== 'your_supabase_project_url' && 
               key !== 'your_supabase_anon_key' &&
               (url.startsWith('http://') || url.startsWith('https://')));
}

export async function createClient() {
    if (!isSupabaseConfigured()) {
        return null;
    }

  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
          }
        },
      },
    }
  )
}

export { isSupabaseConfigured };
