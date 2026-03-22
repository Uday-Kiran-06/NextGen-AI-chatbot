/**
 * Tier-1 Rules Engine
 * 
 * Intercepts common user queries to provide instant, zero-cost responses.
 * This avoids unnecessary LLM calls for basic greetings or FAQs.
 */

import { RULES } from './rules-data';
import Fuse from 'fuse.js';

// Pre-compute the fuzzy search index
const fuse = new Fuse(RULES, {
    keys: ['keywords'],
    threshold: 0.3, // Allow minor misspellings
    includeScore: true,
    ignoreLocation: true,
});

/**
 * Checks if a message matches any registered rules.
 * @param message The user's input message
 * @returns The response string if a match is found, null otherwise.
 */
export async function checkRules(message: string): Promise<string | null> {
    const cleanMessage = message.toLowerCase().trim().replace(/[?!.,]/g, '');
    const words = new Set(cleanMessage.split(/\s+/));
    const now = new Date();

    // 0. Explicit AI/Coding Bypass
    // If the user is asking for code, math, or translation, the college rules engine should back off.
    const aiIntents = ['write', 'code', 'build', 'create', 'how to', 'calculate', 'solve', 'translate', 'explain', 'python', 'javascript', 'java', 'c++', 'calculator', 'formula'];
    const collegeKeywords = ['fee', 'payment', 'admission', 'aliet', 'erp', 'principal', 'faculty', 'admission', 'apply', 'join', 'seat'];
    
    // Only bypass if it doesn't look like a college-related query
    const hasCollegeKeyword = collegeKeywords.some(k => cleanMessage.includes(k));
    if (!hasCollegeKeyword && aiIntents.some(intent => cleanMessage.includes(intent))) {
        return null;
    }

    // 1. Dynamic Weather Rule (Priority)
    if (words.has('weather') || words.has('temperature') || words.has('temp')) {
        // Simple heuristic to find a city: word after "in", "at", or "for"
        const cityMatch = message.match(/(?:in|at|for)\s+([a-zA-Z\s]{3,20})/i);
        const city = cityMatch ? cityMatch[1].trim() : "";

        try {
            // Use wttr.in for fast, keyless text-based weather
            const url = city ? `https://wttr.in/${encodeURIComponent(city)}?format=3` : `https://wttr.in?format=4`;
            const res = await fetch(url);
            if (res.ok) {
                const weatherText = await res.text();
                if (weatherText && !weatherText.includes('404')) {
                    return `🌤️ **Current Weather**:\n${weatherText.trim()}\n\n_Fetched instantly via Rules Engine_`;
                }
            }
        } catch (error) {
            console.error('[Rules Engine] Weather fetch failed:', error);
            // Fall back to AI if weather rule fails
        }
    }

    // 2. Dynamic Date/Time Rules (Priority)
    if (cleanMessage.includes('today') || cleanMessage.includes('current')) {
        if (words.has('date') || words.has('day')) {
            return `Today's date is **${now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}**. 📅`;
        }
        if (words.has('time')) {
            return `The current time is **${now.toLocaleTimeString()}**. 🕒`;
        }
    }

    if (cleanMessage === 'date' || cleanMessage === 'time') {
        return cleanMessage === 'date'
            ? `Today's date is **${now.toLocaleDateString()}**. 📅`
            : `The current time is **${now.toLocaleTimeString()}**. 🕒`;
    }

    // 3. Fuzzy Keyword Rules
    if (cleanMessage.length < 80) {
        // Try to match the entire phrase (handles phrases and exact matches well)
        const phraseResults = fuse.search(cleanMessage);
        // Stricter threshold for phrases (0.2 instead of 0.3)
        if (phraseResults.length > 0 && phraseResults[0].score !== undefined && phraseResults[0].score <= 0.2) {
            return phraseResults[0].item.response;
        }

        // If no full phrase match, check individual significant words
        // We use a very strict threshold here to prevent false positives for single tokens.
        for (const word of words) {
            // Only fuzzy match significant, unique words to avoid common token collisions
            if (word.length >= 5) { 
                const wordResults = fuse.search(word);
                if (wordResults.length > 0 && wordResults[0].score !== undefined && wordResults[0].score <= 0.15) {
                    // Check if the matched rule actually has the word as a keyword (not just fuzzy overlap)
                    const matchedItem = wordResults[0].item;
                    const hasHighConfidenceMatch = matchedItem.keywords.some(k => k.includes(word) || word.includes(k));
                    
                    if (hasHighConfidenceMatch) {
                        return matchedItem.response;
                    }
                }
            }
        }
    }

    return null;
}
