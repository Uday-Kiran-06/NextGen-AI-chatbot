import { createBrowserClient } from '@supabase/ssr'

let supabaseClient: ReturnType<typeof createBrowserClient> | null = null;

function isSupabaseConfigured(): boolean {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    return !!(url && key && 
               url !== 'your_supabase_project_url' && 
               key !== 'your_supabase_anon_key' &&
               (url.startsWith('http://') || url.startsWith('https://')));
}

export function createClient() {
    if (!isSupabaseConfigured()) {
        return null;
    }
    
    if (!supabaseClient) {
        supabaseClient = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
    }
    
    return supabaseClient;
}

export function isSupabaseAvailable(): boolean {
    return isSupabaseConfigured();
}
