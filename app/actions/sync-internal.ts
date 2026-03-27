'use server';

import { RULES } from '@/lib/rules-data';
import { addDocument } from '@/lib/vector-store';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function syncInternalData(offset = 0, limit = 20, isInitialCall = true) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        const adminSupabase = createAdminClient();
        
        if (isInitialCall && offset === 0) {
            console.log(`[Sync] Starting sync of ${RULES.length} internal rules...`);
            // 1. Clear old internal data to prevent duplicates
            console.log("[Sync] Clearing old internal rules...");
            const { error: deleteError } = await adminSupabase
                .from('documents')
                .delete()
                .eq('metadata->>source', 'internal_fixed_data');
                
            if (deleteError) {
                console.error("[Sync] Delete failed:", deleteError);
            }
        }

        const batchRules = RULES.slice(offset, offset + limit);
        let syncedCount = 0;
        const CONCURRENCY_LIMIT = 2; // Reduced to mitigate HF rate limits & SocketErrors

        for (let i = 0; i < batchRules.length; i += CONCURRENCY_LIMIT) {
            const batch = batchRules.slice(i, i + CONCURRENCY_LIMIT);
            
            await Promise.all(batch.map(async (rule) => {
                let retries = 3;
                let success = false;
                
                while (retries > 0 && !success) {
                    try {
                        const content = `[OFFICIAL RULE/FAQ]\nKeywords: ${rule.keywords.join(', ')}\nResponse: ${rule.response}`;
                        
                        await addDocument(content, {
                            source: 'internal_fixed_data',
                            type: 'official_rule',
                            synced_at: new Date().toISOString()
                        }, user?.id);
                        
                        success = true;
                        syncedCount++;
                    } catch (error: any) {
                        retries--;
                        if (retries > 0) {
                            console.warn(`[Sync] Item failed, retrying... (${retries} left):`, error.message);
                            await new Promise(resolve => setTimeout(resolve, 2000));
                        } else {
                            console.error(`[Sync] Item failed after all retries:`, error.message);
                            // Don't throw, allow other items in batch to proceed
                        }
                    }
                }
            }));

            if (i + CONCURRENCY_LIMIT < batchRules.length) {
                // Short break between sub-batches
                await new Promise(resolve => setTimeout(resolve, 1500));
            }
        }

        const nextOffset = offset + batchRules.length;
        const hasMore = nextOffset < RULES.length;

        console.log(`[Sync] Synced ${syncedCount} rules (Total so far: ${nextOffset}/${RULES.length}).`);
        return { success: true, count: syncedCount, nextOffset, hasMore, total: RULES.length };
    } catch (error: any) {
        console.error('[Sync Error]:', error);
        return { success: false, error: error.message };
    }
}
