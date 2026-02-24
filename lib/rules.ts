/**
 * Tier-1 Rules Engine
 * 
 * Intercepts common user queries to provide instant, zero-cost responses.
 * This avoids unnecessary LLM calls for basic greetings or FAQs.
 */

interface Rule {
    keywords: string[];
    response: string;
}

const RULES: Rule[] = [
    {
        keywords: ['hi', 'hii', 'hello', 'hey', 'greetings', 'yo', 'hi there'],
        response: "Hello! I'm NextGen AI. How can I assist you today? 🚀"
    },
    {
        keywords: ['who are you', 'your name', 'what are you', 'tell me about yourself'],
        response: "I am NextGen AI, a powerful chatbot designed to assist you with reasoning, coding, search, and image generation. 🤖"
    },
    {
        keywords: ['how are you', 'how s it going', 'how are things'],
        response: "I'm doing great and ready to help! What's on your mind? ✨"
    },
    {
        keywords: ['bye', 'goodbye', 'see ya', 'take care'],
        response: "Goodbye! Have a productive day! 👋"
    },
    {
        keywords: ['help', 'commands', 'what can you do', 'menu'],
        response: "I can help you with:\n- 🧠 **Complex Reasoning**: Using Pro models.\n- 💻 **Coding**: Writing and debugging scripts.\n- 🔍 **Web Search**: Real-time information access.\n- 🎨 **Image Generation**: Just use the `/image` command!\n- 📁 **File Analysis**: Upload PDFs or text files."
    },
    {
        keywords: ['aliet', 'college', 'my college', 'andhra loyola'],
        response: `🏥 **Andhra Loyola Institute of Engineering & Technology (ALIET)**

**Motto**: _Service & Excellence_
**Established**: 2008 (Managed by Jesuits)
**Accreditation**: NAAC A+ Accredited | Affiliated to JNTU Kakinada

---

### 🏛️ Quick Facts
- **Campus**: Verdant 98-acre campus at the foothills of Eastern Ghats.
- **Departments**: 8 B.Tech programs (CSE, AI&ML, Data Science, IT, ECE, EEE, MECH, CIVIL) & 3 PG programs.
- **Sister Institution**: Andhra Loyola College (est. 1953).

---

### 🚀 Centers of Excellence
- **Siemens Training Centre**: Industry-standard automation & digitalization.
- **CM's Excellence Centre**: Government recognized training hub.
- **Skill Development Centre**: Partnered with APSSDC for advanced training.

---

### 🎓 Leadership

**Rev. Fr. Dr. B. Joji Reddy S.J**
![Director](https://aliet.ac.in/storage/blocks/01K8D7DZ0AZSD7TWV75WK07MM0.jpg)
_*Secretary & Director*_

**Dr. O. Mahesh**
![Principal](https://aliet.ac.in/storage/blocks/01KA7ZR9JFP4NTFJJ9WY63HNQ0.jpg)
_*Principal*_

---

### 📞 Contact & Support
- **Address**: ITI Road, ALC Campus, Vijayawada - 520008.
- **Phone**: 0866-2498978
- **Email**: info@aliet.ac.in
- **Website**: [aliet.ac.in](https://aliet.ac.in/)

How can I help you regarding your college? 🎓`
    }
];

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
