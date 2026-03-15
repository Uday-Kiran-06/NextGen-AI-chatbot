'use server';

import { WebsiteCrawler } from '@/lib/website-crawler';
import { createClient } from '@/lib/supabase/server';

export async function crawlWebsite(url: string, maxPages: number = 500) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        // Allow bypassing auth in development for easier testing
        const isDev = process.env.NODE_ENV === 'development';
        
        if (!user && !isDev) {
            console.error("Auth check failed:", authError);
            throw new Error("Unauthorized: Please log in to your account first before syncing a website.");
        }

        const userId = user?.id; // Will be undefined if not logged in (allowed in dev)

        const crawler = new WebsiteCrawler({
            maxPages,
            maxDepth: 3,
        });

        // Use the instance method directly - it logs internally
        console.log(`Starting server-side crawl for ${url} (User: ${userId})`);
        
        // We don't await the full crawl if it's large, but for now we will 
        // to ensure it completes in the serverless timeout context (60s in route.ts)
        await crawler.crawl(url);

        return { success: true, message: `Successfully crawled and indexed ${url}` };
    } catch (error: any) {
        console.error("Crawl action error:", error);
        return { success: false, error: error.message || "Failed to crawl website" };
    }
}
