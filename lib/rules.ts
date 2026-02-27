/**
 * Tier-1 Rules Engine
 * 
 * Intercepts common user queries to provide instant, zero-cost responses.
 * This avoids unnecessary LLM calls for basic greetings or FAQs.
 */

import { RULES } from './rules-data';

/**
 * Checks if a message matches any registered rules.
 * @param message The user's input message
 * @returns The response string if a match is found, null otherwise.
 */
export async function checkRules(message: string): Promise<string | null> {
    const cleanMessage = message.toLowerCase().trim().replace(/[?!.,]/g, '');
    const words = new Set(cleanMessage.split(/\s+/));
    const now = new Date();

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

    // 3. Static Keyword Rules
    for (const rule of RULES) {
        if (cleanMessage.length < 60) {
            // Check if any keyword matches as a full phrase or a single word
            const match = rule.keywords.some(k => {
                if (k.includes(' ')) {
                    return cleanMessage.includes(k);
                }
                return words.has(k);
            });

            if (match) {
                return rule.response;
            }
        }
    }

    return null;
}
