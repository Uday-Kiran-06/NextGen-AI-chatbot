'use server';

import { RULES } from '@/lib/rules-data';
import { addDocument } from '@/lib/vector-store';
import { createClient } from '@/lib/supabase/server';

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
        const CONCURRENCY_LIMIT = 5;

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
                await new Promise(resolve => setTimeout(resolve, 200));
            }
        }

        console.log(`[Sync] Successfully synced ${syncedCount} rules to vector store.`);
        return { success: true, count: syncedCount };
    } catch (error: any) {
        console.error('[Sync Error]:', error);
        return { success: false, error: error.message };
    }
}
