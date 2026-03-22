'use server';

import { RULES } from '@/lib/rules-data';
import { addDocument } from '@/lib/vector-store';
import { createClient } from '@/lib/supabase/server';

export async function syncInternalData() {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        // Optional: We allow syncing core data even if guest, as it's system-wide
        console.log(`[Sync] Starting sync of ${RULES.length} internal rules...`);
        let syncedCount = 0;

        const CONCURRENCY_LIMIT = 5;
        for (let i = 0; i < RULES.length; i += CONCURRENCY_LIMIT) {
            const batch = RULES.slice(i, i + CONCURRENCY_LIMIT);
            
            await Promise.all(batch.map(async (rule) => {
                const content = `[OFFICIAL RULE/FAQ]\nKeywords: ${rule.keywords.join(', ')}\nResponse: ${rule.response}`;
                
                // Marks as internal data so we can update/delete it easily if needed
                await addDocument(content, {
                    source: 'internal_fixed_data',
                    type: 'official_rule',
                    synced_at: new Date().toISOString()
                }, user?.id);
                
                syncedCount++;
            }));

            // Small delay between batches to be safe with rate limits, 
            // but much faster than 500ms per individual rule.
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
