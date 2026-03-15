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

        for (const rule of RULES) {
            const content = `[OFFICIAL RULE/FAQ]\nKeywords: ${rule.keywords.join(', ')}\nResponse: ${rule.response}`;
            
            // Marks as internal data so we can update/delete it easily if needed
            await addDocument(content, {
                source: 'internal_fixed_data',
                type: 'official_rule',
                synced_at: new Date().toISOString()
            }, user?.id);
            
            syncedCount++;
            // Throttling to avoid rate limits
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        console.log(`[Sync] Successfully synced ${syncedCount} rules to vector store.`);
        return { success: true, count: syncedCount };
    } catch (error: any) {
        console.error('[Sync Error]:', error);
        return { success: false, error: error.message };
    }
}
