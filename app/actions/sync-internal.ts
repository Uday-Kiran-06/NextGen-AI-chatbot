'use server';

import { RULES } from '@/lib/rules-data';
import { addDocument } from '@/lib/vector-store';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function syncInternalData() {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        const adminSupabase = createAdminClient();
        
        console.log(`[Sync] Starting sync of ${RULES.length} internal rules...`);

        // 1. Clear old internal data to prevent duplicates
        console.log("[Sync] Clearing old internal rules...");
        const { error: deleteError } = await adminSupabase
            .from('documents')
            .delete()
            .eq('metadata->>source', 'internal_fixed_data');
            
        if (deleteError) {
            console.error("[Sync] Delete failed:", deleteError);
            // We continue anyway, but log it
        }

        let syncedCount = 0;
        const CONCURRENCY_LIMIT = 2; // Reduced to mitigate HF rate limits & SocketErrors

        for (let i = 0; i < RULES.length; i += CONCURRENCY_LIMIT) {
            const batch = RULES.slice(i, i + CONCURRENCY_LIMIT);
            
            await Promise.all(batch.map(async (rule) => {
                const content = `[OFFICIAL RULE/FAQ]\nKeywords: ${rule.keywords.join(', ')}\nResponse: ${rule.response}`;
                
                await addDocument(content, {
                    source: 'internal_fixed_data',
                    type: 'official_rule',
                    synced_at: new Date().toISOString()
                }, user?.id);
                
                syncedCount++;
            }));

            if (i + CONCURRENCY_LIMIT < RULES.length) {
                // Slower batching to stay under 15 RPM for Free Tier embedding-001
                await new Promise(resolve => setTimeout(resolve, 4000));
            }
        }

        console.log(`[Sync] Successfully synced ${syncedCount} rules to vector store.`);
        return { success: true, count: syncedCount };
    } catch (error: any) {
        console.error('[Sync Error]:', error);
        return { success: false, error: error.message };
    }
}
