# Project Full Documentation

This file contains the complete source code of the project for documentation purposes.

# File: next-env.d.ts

``typescript
/// <reference types="next" />
/// <reference types="next/image-types/global" />
import "./.next/dev/types/routes.d.ts";

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.

``

---

# File: next.config.ts

``typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '10.13.39.8:3000', '*.ngrok-free.app']
    },
  },
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;

``

---

# File: package.json

``json
{
  "name": "nextgen-chatbot",
  "version": "0.1.0",
  "description": "NextGen AI Chatbot - v2",
  "private": true,
  "dependencies": {
    "@google/generative-ai": "^0.24.1",
    "@supabase/ssr": "^0.8.0",
    "@supabase/supabase-js": "^2.89.0",
    "@tailwindcss/typography": "^0.5.19",
    "@types/react-syntax-highlighter": "^15.5.13",
    "axios": "^1.13.4",
    "cheerio": "^1.2.0",
    "clsx": "^2.1.1",
    "framer-motion": "^12.24.1",
    "fuse.js": "^7.1.0",
    "katex": "^0.16.33",
    "lucide-react": "^0.562.0",
    "next": "16.1.1",
    "next-themes": "^0.4.6",
    "pdf-parse": "^2.4.5",
    "pptxgenjs": "^4.0.1",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "react-markdown": "^10.1.0",
    "react-syntax-highlighter": "^16.1.0",
    "react-zoom-pan-pinch": "^3.7.0",
    "rehype-katex": "^7.0.1",
    "remark-directive": "^4.0.0",
    "remark-gfm": "^4.0.1",
    "remark-math": "^6.0.0",
    "resend": "^6.9.1",
    "shiki": "^4.0.0",
    "sonner": "^2.0.7",
    "tailwind-merge": "^3.4.0",
    "unist-util-visit": "^5.1.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "autoprefixer": "^10.4.23",
    "eslint": "^9",
    "eslint-config-next": "16.1.1",
    "postcss": "^8.5.6",
    "tailwindcss": "^3.4.17",
    "typescript": "^5"
  },
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  }
}

``

---

# File: README.md

``md
# âœ¨ NextGen AI Chatbot

A beautifully designed, high-performance AI chat interface built with Next.js. NextGen AI transforms standard LLM interactions into a powerful, agentic workspace featuring live code execution, real-time web browsing, continuous voice conversations, and seamless Supabase integration.

<img width="1919" height="869" alt="image" src="https://github.com/user-attachments/assets/386ccb37-b173-4584-8b8b-7039739ce1d7" />


## ðŸš€ Key Features

### Core Experience
*   ðŸŽ¨ **Stunning UI/UX**: Premium aesthetic featuring glassmorphism, responsive design, and fluid transitions powered by **Framer Motion**.
*   ðŸ” **Secure Authentication**: Built-in Google OAuth login seamlessly linked to **Supabase**.
*   ðŸ’¾ **Persistent History**: All conversations and messages are securely stored in a Postgres database. Messages dynamically branch when edited or regenerated.
*   ðŸŒ— **Theming**: Flawless Dark and Light mode support with automatic system preference detection.

### ðŸ§  Advanced AI Capabilities
*   **Multi-Model Support**: Chat with Google's **Gemini 2.5 Flash / Pro**, **Groq** (Llama 3 / Mixtral), or switch to **Local AI (Ollama)** for 100% private, zero-cost inference right on your desktop.
*   ðŸŒ **Agentic Web Search**: A dedicated toggle forces the AI to actively use built-in tools (like DuckDuckGo) to research real-time information across the web before answering.
*   ðŸŽ­ **Custom Personas**: Go beyond standard prompts. Create, edit, and save your own detailed "System Instructions" via a custom modal to perfectly tailor the AI's behavior.

### ðŸ’» Developer & Power-User Tools
*   **Live Code Sandbox**: Don't just read codeâ€”**run it**. The built-in Artifact Viewer spins up an isolated browser-based sandbox to execute pure **JavaScript**, or client-side **Python** (via Pyodide), displaying real-time console outputs directly in your chat.
*   **Smart Syntax Highlighting**: Fully styled markdown parsing with GitHub Flavored Markdown (tables, task lists) and intelligent code blocks that automatically collapse if they exceed 20 lines.
*   **Global Chat Search**: Instantly find old code snippets or past conversations with a lightning-fast substring search querying the actual content of every message in your Supabase database.

### ðŸŽ™ï¸ Accessibility & UX Elevators
*   **Continuous Voice Mode**: Hands-free interactions! Engage the microphone, speak naturally, and the app will detect a 2.5-second silence to automatically send your message.
*   **AI-Powered Titles**: Conversations are automatically summarized into punchy, 3-4 word titles in the background using Gemini Flash.
*   **Keyboard Shortcuts**: Press `Esc` to instantly stop AI generation, or use `Cmd/Ctrl + Enter` for quick sends.
*   **PWA Ready**: Install the chatbot directly to your iOS or Android home screen as a standalone Progressive Web App.

---

## ðŸ› ï¸ Tech Stack

*   **Framework**: [Next.js](https://nextjs.org/) (App Router)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Animations**: [Framer Motion](https://www.framer.com/motion/)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL)
*   **AI SDKs**: `@google/generative-ai`, Groq REST API, custom Ollama handler
*   **Utilities**: `react-markdown`, `react-syntax-highlighter`, `pyodide`

---

## âš™ï¸ Local Development Setup

### 1. Prerequisites
*   Node.js 18.x or later
*   A [Supabase](https://supabase.com/) account and project
*   A [Google Gemini API Key](https://aistudio.google.com/)
*   (Optional) [Ollama](https://ollama.com/) installed locally for local model execution

### 2. Clone the Repository
\`\`\`bash
git clone https://github.com/Uday-Kiran-06/NextGen-AI-chatbot.git
cd NextGen-AI-chatbot
\`\`\`

### 3. Install Dependencies
\`\`\`bash
npm install
# or yarn install / pnpm install
\`\`\`

### 4. Environment Variables
Create a \`.env.local\` file in the root of the project and add the following keys:

\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Supabase Auth Settings
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key

# (Optional) Groq API Key for open-source models
GROQ_API_KEY=your_groq_api_key
\`\`\`

*(Note: Don't forget to configure Google OAuth in your Supabase Dashboard under Authentication > Providers).*

### 5. Supabase Database Schema
Navigate to your Supabase SQL Editor and run the provided schema definitions located in `supabase/schema.sql` to initialize your `conversations` and `messages` tables, as well as the necessary RLS (Row Level Security) policies.

### 6. Run the Development Server
\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## ðŸ“ License
This project is open-source and available under the [MIT License](LICENSE).

``

---

# File: tailwind.config.ts

``typescript
import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "rgb(var(--background) / <alpha-value>)",
                foreground: "rgb(var(--foreground) / <alpha-value>)",
                "accent-primary": "var(--accent-primary)",
                "accent-secondary": "var(--accent-secondary)",

                "glass-bg": "var(--glass-bg)",
                "glass-border": "var(--glass-border)",

                "sidebar-bg": "var(--sidebar-bg)",
                "sidebar-hover": "var(--sidebar-hover)",
            },
            animation: {
                "aurora": "aurora 60s linear infinite",
                "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                "music-bar": "music-bar 1s ease-in-out infinite",
            },
            keyframes: {
                aurora: {
                    "0%": {
                        backgroundPosition: "50% 50%, 50% 50%",
                    },
                    "100%": {
                        backgroundPosition: "350% 50%, 350% 50%",
                    },
                },
                "music-bar": {
                    "0%, 100%": { height: "0.5rem" },
                    "50%": { height: "1rem" },
                },
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
};
export default config;

``

---

# File: tsconfig.json

``json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts",
    "**/*.mts"
  ],
  "exclude": ["node_modules"]
}

``

---

# File: app\globals.css

``css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: 2 6 23;
  /* #020617 as RGB */
  --foreground: 248 250 252;
  /* #f8fafc as RGB */

  /* Glassmorphism Tokens */
  --glass-bg: rgba(255, 255, 255, 0.03);
  --glass-border: rgba(255, 255, 255, 0.08);
  --glass-shimmer: rgba(255, 255, 255, 0.1);
  --glass-blur: 16px;

  /* Sidebar Tokens */
  --sidebar-bg: #171717a8;
  --sidebar-hover: rgba(255, 255, 255, 0.05);

  /* Accent Colors - Vibe Driven */
  --accent-primary: #7c3aed;
  /* Violet */
  --accent-secondary: #db2777;
  /* Pink */
  --accent-glow: rgba(124, 58, 237, 0.15);

  /* Font */
  --font-sans: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;

  /* Colors for Aurora */
  --white: 255 255 255;
  --black: 0 0 0;
  --transparent: transparent;
}

.light {
  --background: 248 250 252;
  --foreground: 2 6 23;
  --glass-bg: rgba(0, 0, 0, 0.05);
  --glass-border: rgba(0, 0, 0, 0.1);
  --glass-shimmer: rgba(0, 0, 0, 0.15);
  --sidebar-bg: #c4c3c3;
  --sidebar-hover: rgba(0, 0, 0, 0.05);
  --accent-primary: #6d28d9;
  --accent-secondary: #be185d;
  --accent-glow: rgba(109, 40, 217, 0.2);
}



body {
  color: var(--foreground);
  background: var(--background);
  font-family: var(--font-sans);
  overflow-x: hidden;
  overscroll-behavior-y: none;
  /* Prevent native pull-to-refresh on mobile */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  /* Mobile-specific improvements */
  -webkit-tap-highlight-color: transparent;
  padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

/* Liquid and Aurora Animations */


@keyframes skeleton-pulse {
  0% {
    opacity: 0.5;
  }

  50% {
    opacity: 0.8;
  }

  100% {
    opacity: 0.5;
  }
}

.animate-skeleton {
  animation: skeleton-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes aurora {
  from {
    background-position: 50% 50%, 50% 50%;
  }

  to {
    background-position: 350% 50%, 350% 50%;
  }
}

.animate-aurora {
  animation: aurora 60s linear infinite;
}



::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  transition: all 0.3s ease;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.15);
}

.light ::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
}

.light ::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.2);
}

@layer utilities {
  .glass-panel {
    background: var(--glass-bg);
    backdrop-filter: blur(var(--glass-blur));
    border: 1px solid var(--glass-border);
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  }

  .glass-button {
    background: var(--glass-bg);
    backdrop-filter: blur(var(--glass-blur));
    border: 1px solid var(--glass-border);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  .glass-button:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
    box-shadow: 0 0 25px var(--accent-glow);
    transform: translateY(-2px);
  }

  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }

    100% {
      transform: translateX(100%);
    }
  }

  .premium-gradient {
    background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
  }

  .text-glow {
    text-shadow: 0 0 20px var(--accent-glow);
  }

  .active-bounce:active {
    transform: scale(0.95);
  }

  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }

  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  /* Shiki Syntax Highlighting Overrides */
  .shiki {
    background-color: transparent !important;
    /* Let parent handle bg */
  }

  .shiki span {
    color: var(--shiki-light, inherit);
  }

  .dark .shiki span {
    color: var(--shiki-dark, inherit);
  }
}

* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

a {
  color: inherit;
  text-decoration: none;
}

@media (prefers-color-scheme: dark) {
  html {
    color-scheme: dark;
  }
}
``

---

# File: app\layout.tsx

``typescript
import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import './globals.css';
import 'katex/dist/katex.min.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from 'sonner';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'NextGen AI',
  description: 'Advanced AI Chat Assistant',
  manifest: '/manifest.json',
  icons: {
    icon: '/logo.png?v=2',
    apple: '/logo.png?v=2',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'NextGen AI',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#000000',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={spaceGrotesk.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
          <Toaster position="bottom-right" theme="system" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}

``

---

# File: app\page.tsx

``typescript
'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar/Sidebar';
import ChatInterface from '@/components/Chat/ChatInterface';

export default function Home() {
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [sidebarRefreshKey, setSidebarRefreshKey] = useState(0);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleConversationCreated = (id: string) => {
    setActiveConversationId(id);
    setSidebarRefreshKey(prev => prev + 1);
  };

  return (
    <div className="flex h-[100dvh] w-full bg-background relative z-10 overflow-hidden">
      <Sidebar
        activeId={activeConversationId}
        onSelectChat={setActiveConversationId}
        onNewChat={() => setActiveConversationId(null)}
        refreshKey={sidebarRefreshKey}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />
      <ChatInterface
        conversationId={activeConversationId}
        onConversationCreated={handleConversationCreated}
        onOpenSidebar={() => setIsMobileSidebarOpen(true)}
        onNewChat={() => setActiveConversationId(null)}
      />
    </div>
  );
}

``

---

# File: app\actions\crawl.ts

``typescript
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

``

---

# File: app\actions\scrape-faculty.ts

``typescript
'use server';

import axios from 'axios';
import * as cheerio from 'cheerio';
import { createAdminClient } from '@/lib/supabase/admin';

const DEPARTMENTS = [
  { name: 'Computer Science & Engineering', url: 'https://aliet.ac.in/departments/computer-science-engineering' },
  { name: 'Information Technology', url: 'https://aliet.ac.in/departments/information-technology' },
  { name: 'Electronics & Communication Engineering', url: 'https://aliet.ac.in/departments/electronics-communication-engineering' },
  { name: 'CSE (AI & ML)', url: 'https://aliet.ac.in/departments/cse-ai-ml' },
  { name: 'CSE (Data Science)', url: 'https://aliet.ac.in/departments/cse-data-science' },
  { name: 'Mechanical Engineering', url: 'https://aliet.ac.in/departments/mechanical-engineering' },
  { name: 'Civil Engineering', url: 'https://aliet.ac.in/departments/civil-engineering' },
  { name: 'Electrical & Electronics Engineering', url: 'https://aliet.ac.in/departments/electrical-electronics-engineering' },
  { name: 'Science & Humanities', url: 'https://aliet.ac.in/departments/science-humanities' },
  { name: 'MBA', url: 'https://aliet.ac.in/departments/master-of-business-administration' }
];

export async function scrapeFacultyData() {
  const supabase = createAdminClient();
  let totalScraped = 0;
  const errors = [];

  try {
    for (const dept of DEPARTMENTS) {
      console.log(`[Scrape] Processing ${dept.name}...`);
      try {
        const { data: html } = await axios.get(dept.url, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
        });
        const $ = cheerio.load(html);

        // 1. Extract HOD
        const hodSection = $('.hod-profile, .hod-section, [class*="hod"]').first();
        if (hodSection.length) {
          const name = hodSection.find('h3, h4, .name').first().text().trim();
          const img = hodSection.find('img').attr('src');
          const fullImgUrl = img ? (img.startsWith('http') ? img : `https://aliet.ac.in${img}`) : null;

          if (name) {
            await supabase.from('faculty').upsert({
              name,
              department: dept.name,
              designation: 'HOD',
              image_url: fullImgUrl,
              is_hod: true
            }, { onConflict: 'name,department' });
            totalScraped++;
          }
        }

        // 2. Extract Faculty Table
        const tables = $('table.faculty-table, .faculty-table-scroll table, table').toArray();
        for (const table of tables) {
          const rows = $(table).find('tr').toArray();
          for (let i = 1; i < rows.length; i++) { // Skip header
            const row = rows[i];
            const cols = $(row).find('td');
            if (cols.length >= 2) {
              const name = $(cols[1]).text().trim();
              const designation = $(cols[2]).text().trim() || 'Assistant Professor';
              const qualification = $(cols[3]).text().trim();

              if (name && name.length > 3) {
                await supabase.from('faculty').upsert({
                  name,
                  department: dept.name,
                  designation,
                  qualification,
                  is_hod: designation.toLowerCase().includes('hod')
                }, { onConflict: 'name,department' });
                totalScraped++;
              }
            }
          }
        }

      } catch (err: any) {
        console.error(`Error scraping ${dept.name}:`, err.message);
        errors.push(`${dept.name}: ${err.message}`);
      }
      
      // Small delay to be polite
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return { success: true, count: totalScraped, errors };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

``

---

# File: app\actions\sync-internal.ts

``typescript
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

``

---

# File: app\api\chat\route.ts

``typescript
import { NextRequest, NextResponse } from 'next/server';
import { runAgentWorkflow, executeToolCall } from '@/lib/agent/workflow-engine';
import { createClient } from '@/lib/supabase/server';
import { Cache } from '@/lib/cache';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
    try {
        const payload = await req.json();
        let { history, message, layers, persona, modelId, useWebSearch, rulesEnabled } = payload;

        // Smart Context Truncation: Keep only the last 20 turns
        if (Array.isArray(history) && history.length > 20) {
            history = history.slice(-20);
        }

        // Identify User for RAG Context
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        const userId = user?.id;

        // High-Performance Optimization: Context-Aware Cache
        // Include history length to prevent serving cached first-turn answers on follow-up questions
        const historyLength = Array.isArray(history) ? history.length : 0;
        const cacheKey = `query:${historyLength}:${message}:${persona || 'std'}:${modelId || 'flash'}`;

        // Skip cache if there are images, as context differs
        const cachedResponse = (!layers || layers.length === 0) ? Cache.get(cacheKey) : null;

        if (cachedResponse) {
            // Speed! Return cached response immediately.
            return new NextResponse(new ReadableStream({
                start(controller) {
                    controller.enqueue(new TextEncoder().encode(cachedResponse));
                    controller.close();
                }
            }));
        }

        // Agent Execution Loop
        // 1. Initial Plan/Thought
        // We pass 'history' here, but for the loop we need the accumulated context
        // Create a custom stream to send intermediate thoughts and final results
        const stream = new ReadableStream({
            async start(controller) {
                const encoder = new TextEncoder();
                const sendChunk = (text: string) => controller.enqueue(encoder.encode(text));

                try {
                    // 1. Initial Planned Action
                    sendChunk("__AGENT_ACTION__:Initializing workflow...\n");
                    
                    // Default to true if not specified
                    const enableRules = rulesEnabled !== false;

                    let response = await runAgentWorkflow(history, message, layers, persona, modelId, userId, useWebSearch, enableRules);

                    // 2. Agent Execution Loop with Tool Streaming
                    const workingHistory = [...history];
                    workingHistory.push({ role: 'user', content: message });

                    let depth = 0;
                    while (response.type === 'tool_call' && depth < 3) {
                        const { toolName, toolArgs } = response;

                        // Stream the action to the user
                        let statusText = `Using tool: ${toolName}`;
                        if (toolName === 'web_search') statusText = `Searching the web for "${toolArgs.query}"...`;
                        if (toolName === 'search_knowledge') statusText = `Searching internal documents for info...`;
                        if (toolName === 'generate_image') statusText = `Generating image for "${toolArgs.prompt}"...`;
                        if (toolName === 'calculate') statusText = `Calculating: ${toolArgs.expression}`;
                        if (toolName === 'duckduckgo_search') statusText = `DuckDuckGo: searching "${toolArgs.query}"...`;

                        sendChunk(`__AGENT_ACTION__:${statusText}\n`);

                        // Execute Tool
                        const toolResult = await executeToolCall(toolName!, toolArgs, userId);

                        // Feed back to history
                        workingHistory.push({ role: 'model', content: `Requesting tool: ${toolName}` });
                        workingHistory.push({ role: 'user', content: `Tool Result for ${toolName}: ${JSON.stringify(toolResult)}` });

                        // Re-run Agent
                        sendChunk(`__AGENT_ACTION__:Analyzing results from ${toolName}...\n`);
                        response = await runAgentWorkflow(workingHistory, "Continue based on the tool result.", [], persona, modelId, userId, useWebSearch);
                        depth++;
                    }

                    // 3. Final Output
                    let finalContent = "";
                    if (response.type === 'text') {
                        finalContent = response.content || "";
                        Cache.set(cacheKey, finalContent, 60);
                    } else if (response.type === 'tool_call') {
                        finalContent = "I apologize, but I reached a complexity limit while processing your request with tools.";
                    }

                    if (!finalContent.trim()) {
                        finalContent = "I apologize, but I encountered an issue generating a response.";
                    }

                    // Send final content (clears the action state in frontend)
                    sendChunk(finalContent);
                    controller.close();

                } catch (err: any) {
                    console.error('[Stream Processing Error]:', JSON.stringify(err, Object.getOwnPropertyNames(err)));
                    try {
                        sendChunk(`Error: ${err.message || 'An unexpected error occurred during processing.'}`);
                        controller.close();
                    } catch (closeErr) {
                        console.error('[Stream Close Error]: Could not cleanly close stream after error.', closeErr);
                    }
                }
            }
        });

        return new NextResponse(stream);


    } catch (error: any) {
        // Improved logging to catch Error objects which stringify to {}
        console.error('Error processing chat:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
        return NextResponse.json(
            { error: error.message || String(error) || 'Internal Server Error' },
            { status: 500 }
        );
    }
}

``

---

# File: app\api\generate-title\route.ts

``typescript
import { NextRequest, NextResponse } from 'next/server';
import { getDynamicModel } from '@/lib/gemini';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const { message, modelId, conversationId } = await req.json();

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        const model = getDynamicModel(modelId || 'gemini-1.5-flash');

        const prompt = `Generate a very short, concise 2 to 4 word title for a chat conversation that starts with the following message. Do not use quotes, punctuation, or preamble. Just the title text. \n\nMessage: "${message.slice(0, 500)}"`;

        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: { maxOutputTokens: 20 }
        });

        let title = result.response.text().trim();
        // Clean up any quotes the model might have added despite instructions
        title = title.replace(/^["']|["']$/g, '');

        if (!title) {
            title = message.slice(0, 30) + '...';
        }

        return NextResponse.json({ title });

    } catch (error: any) {
        console.error('Error generating title:', error);
        return NextResponse.json({ error: 'Failed to generate title' }, { status: 500 });
    }
}

``

---

# File: app\api\image\route.ts

``typescript
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
    try {
        const { prompt } = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        const encodedPrompt = encodeURIComponent(prompt);
        const seed = Math.floor(Math.random() * 1000000);
        const apiKey = 'sk_mEWxPjZizTEUPa1FsEFasSWkowb0Yzlt';
        const keyParam = `&key=${apiKey}`;

        // Construct the URL with nologo=true and the secure API key
        const imageUrl = `https://gen.pollinations.ai/image/${encodedPrompt}?width=1024&height=1024&seed=${seed}&model=flux&nologo=true${keyParam}`;

        return NextResponse.json({ imageUrl });

    } catch (error) {
        console.error('Error in image API:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

``

---

# File: app\api\send-reset\route.ts

``typescript
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Environment variables
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const RESEND_API_KEY = process.env.RESEND_API_KEY!;
// Default to Resend's testing domain if not specified.
// User must verify a domain to use a custom email in production.
const EMAIL_FROM = process.env.EMAIL_FROM || 'onboarding@resend.dev';
const SITE_URL = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !RESEND_API_KEY) {
    console.error('Missing required environment variables for password reset (Supabase or Resend).');
}

// Initialize inside the handler to avoid build-time errors if env var is missing
// const resend = new Resend(RESEND_API_KEY);

export async function POST(req: NextRequest) {
    try {
        if (!RESEND_API_KEY) {
            console.error('RESEND_API_KEY is missing. Cannot send email.');
            return NextResponse.json({ error: 'Email service is unavailable' }, { status: 500 });
        }

        const resend = new Resend(RESEND_API_KEY);

        const body = await req.json();
        const email = (body.email || '').trim().toLowerCase();

        if (!email) {
            return NextResponse.json({ error: 'Missing email' }, { status: 400 });
        }

        // 1) Generate recovery link via Supabase Admin endpoint
        const adminResp = await fetch(`${SUPABASE_URL}/auth/v1/admin/generate_link`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                apikey: SUPABASE_SERVICE_ROLE_KEY,
                Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            },
            body: JSON.stringify({
                type: 'recovery',
                email,
                redirectTo: `${SITE_URL}/auth/callback?next=/reset-password`
            }),
        });

        if (!adminResp.ok) {
            const text = await adminResp.text();
            console.error('Supabase admin/generate_link error:', adminResp.status, text);
            return NextResponse.json({ error: 'Failed to generate recovery link' }, { status: 502 });
        }

        const adminData = await adminResp.json();
        const recoveryLink = adminData?.action_link;
        if (!recoveryLink) {
            console.error('No action_link in Supabase response', adminData);
            return NextResponse.json({ error: 'No recovery link returned' }, { status: 502 });
        }

        // 2) Send email via Resend
        const { data, error } = await resend.emails.send({
            from: EMAIL_FROM,
            to: email, // works with 'onboarding@resend.dev' ONLY if 'email' is the account owner's email during testing
            subject: 'Reset your Password - NextGen Chatbot',
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset Request</h2>
          <p>Hello,</p>
          <p>You requested a password reset for your NextGen Chatbot account. Click the button below to reset your password:</p>
          <p style="text-align:center; margin: 30px 0;">
            <a href="${recoveryLink}" style="display:inline-block;padding:12px 24px;background:#8b5cf6;color:#fff;text-decoration:none;border-radius:8px;font-weight:bold;">
              Reset Password
            </a>
          </p>
          <p style="color: #666; font-size: 12px;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
        });

        if (error) {
            console.error('Resend error:', error);
            return NextResponse.json({ error: 'Failed to send email via Resend' }, { status: 502 });
        }

        return NextResponse.json({ ok: true, data });

    } catch (err: any) {
        console.error('send-reset error', err);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}

``

---

# File: app\api\upload\route.ts

``typescript
import { NextRequest, NextResponse } from 'next/server';
import { addDocument } from '@/lib/vector-store';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { fileData, fileName, mimeType, conversationId } = body;

        if (!fileData || !fileName) {
            return NextResponse.json({ error: 'Missing file data' }, { status: 400 });
        }

        // Security: Limit file size to 10MB (base64 is ~1.37x larger)
        const approxSizeInMB = (fileData.length * 0.75) / (1024 * 1024);
        if (approxSizeInMB > 10) {
            return NextResponse.json({ error: 'File size too large. Maximum limit is 10MB.' }, { status: 400 });
        }

        let textContent = '';

        if (mimeType === 'application/pdf') {
            // Decode base64 
            const buffer = Buffer.from(fileData, 'base64');
            const pdfParse = require('pdf-parse');
            const data = await pdfParse(buffer);
            textContent = data.text;
        } else if (mimeType.startsWith('text/')) {
            textContent = Buffer.from(fileData, 'base64').toString('utf-8');
        } else {
            return NextResponse.json({ error: 'Unsupported file type. Only PDF and Text files are supported for document understanding.' }, { status: 400 });
        }

        if (!textContent.trim()) {
            return NextResponse.json({ error: 'Could not extract text from document.' }, { status: 400 });
        }

        // Robust Recursive Chunking
        const recursiveSplit = (text: string, maxSize: number = 1000): string[] => {
            if (text.length <= maxSize) return [text];

            const separators = ['\n\n', '\n', '. ', ' ', ''];
            let bestSeparator = '';

            for (const sep of separators) {
                if (text.includes(sep)) {
                    bestSeparator = sep;
                    break;
                }
            }

            const parts = text.split(bestSeparator);
            const finalChunks = [];
            let current = '';

            for (const part of parts) {
                if ((current + bestSeparator + part).length > maxSize) {
                    if (current) finalChunks.push(current);
                    current = part;
                } else {
                    current = current ? current + bestSeparator + part : part;
                }
            }
            if (current) finalChunks.push(current);
            return finalChunks;
        };

        const chunks = recursiveSplit(textContent, 1500);

        let storedChunks = 0;
        const BATCH_SIZE = 5;

        // Process chunks in batches to improve speed while respecting rate limits
        for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
            const batch = chunks.slice(i, i + BATCH_SIZE);

            const promises = batch.map((chunk, index) => {
                const metadata = {
                    source: fileName,
                    chunk: i + index + 1,
                    totalChunks: chunks.length,
                    conversationId: conversationId || 'global'
                };
                return addDocument(chunk, metadata);
            });

            const results = await Promise.all(promises);
            storedChunks += results.filter(doc => doc !== null).length;

            // Optional: short delay between batches if rate limits are very strict
            // await new Promise(resolve => setTimeout(resolve, 100));
        }

        return NextResponse.json({
            success: true,
            message: `Document processed and learned. Extracted ${storedChunks} chunks.`,
            chunksStored: storedChunks
        });

    } catch (error: any) {
        console.error('Upload Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}

``

---

# File: app\auth\callback\route.ts

``typescript
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { type EmailOtpType } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? '/'

    if (code) {
        const cookieStore = await cookies()
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value
                    },
                    set(name: string, value: string, options: CookieOptions) {
                        cookieStore.set({ name, value, ...options })
                    },
                    remove(name: string, options: CookieOptions) {
                        cookieStore.delete({ name, ...options })
                    },
                },
            }
        )
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            return NextResponse.redirect(`${origin}${next}`)
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}

``

---

# File: app\login\page.tsx

``typescript
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Mail, Lock, Loader2, ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState<'signin' | 'signup' | 'forgot-password'>('signin');
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            if (mode === 'signup') {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${location.origin}/auth/callback`,
                    },
                });
                if (error) throw error;
                setMessage('Check your email for the confirmation link.');
                const response = await fetch('/api/send-reset', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email }),
                });

                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.error || 'Failed to send reset email');
                }

                setMessage('Check your email for the password reset link.');
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                router.push('/');
                router.refresh();
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleOAuth = async (provider: 'google') => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: `${location.origin}/auth/callback`,
                },
            });
            if (error) throw error;
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="bg-background">
            <div className="flex min-h-screen items-center justify-center p-4 relative z-10">
                <button
                    onClick={() => router.push('/')}
                    className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-foreground transition-colors group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-medium hidden sm:block">Back to Home</span>
                </button>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md bg-glass-bg backdrop-blur-xl border border-glass-border rounded-2xl p-8 shadow-2xl"
                >
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-accent-primary to-accent-secondary flex items-center justify-center mb-4 shadow-lg shadow-accent-primary/20">
                            <Sparkles size={24} className="text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-foreground mb-2">
                            {mode === 'signin' ? 'Welcome Back' : mode === 'signup' ? 'Create Account' : 'Reset Password'}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 text-sm text-center">
                            {mode === 'signin'
                                ? 'Enter your credentials to access your chat history'
                                : mode === 'signup'
                                    ? 'Sign up to start your AI journey'
                                    : 'Enter your email to receive a password reset link'}
                        </p>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-700 dark:text-gray-300 ml-1">Email</label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    className="w-full bg-black/5 dark:bg-white/5 border border-glass-border rounded-xl py-3 pl-10 pr-4 text-foreground placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-accent-primary/50 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {mode !== 'forgot-password' && (
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-700 dark:text-gray-300 ml-1">Password</label>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                                        className="w-full bg-black/5 dark:bg-white/5 border border-glass-border rounded-xl py-3 pl-10 pr-4 text-foreground placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-accent-primary/50 transition-all"
                                        required
                                        minLength={6}
                                    />
                                </div>
                            </div>
                        )}

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 p-2 rounded-lg text-center"
                            >
                                {error}
                            </motion.div>
                        )}

                        {message && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="text-green-400 text-xs bg-green-500/10 border border-green-500/20 p-2 rounded-lg text-center"
                            >
                                {message}
                            </motion.div>
                        )}

                        {mode === 'signin' && (
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setMode('forgot-password');
                                        setError(null);
                                        setMessage(null);
                                    }}
                                    className="text-xs text-gray-500 dark:text-gray-400 hover:text-foreground transition-colors"
                                >
                                    Forgot Password?
                                </button>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-accent-primary to-accent-secondary hover:opacity-90 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-accent-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : mode === 'signin' ? (
                                'Sign In'
                            ) : mode === 'signup' ? (
                                'Sign Up'
                            ) : (
                                'Send Reset Link'
                            )}
                        </button>
                    </form>

                    {mode !== 'forgot-password' && (
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-glass-border"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-glass-bg px-2 text-gray-500 rounded-md">Or continue with</span>
                            </div>
                        </div>
                    )}

                    {mode !== 'forgot-password' && (
                        <div className="grid grid-cols-1 gap-3">
                            <button
                                onClick={() => handleOAuth('google')}
                                className="flex items-center justify-center gap-2 py-2.5 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-glass-border rounded-xl text-foreground transition-all text-sm font-medium"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Google
                            </button>
                        </div>
                    )}

                    <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
                        {mode === 'forgot-password' ? (
                            <button
                                onClick={() => {
                                    setMode('signin');
                                    setError(null);
                                    setMessage(null);
                                }}
                                className="text-accent-primary hover:text-accent-secondary font-medium transition-colors"
                            >
                                Back to Sign In
                            </button>
                        ) : (
                            <>
                                {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
                                <button
                                    onClick={() => {
                                        setMode(mode === 'signin' ? 'signup' : 'signin');
                                        setError(null);
                                        setMessage(null);
                                    }}
                                    className="text-accent-primary hover:text-accent-secondary font-medium transition-colors"
                                >
                                    {mode === 'signin' ? 'Sign Up' : 'Sign In'}
                                </button>
                            </>
                        )}
                    </div>
                </motion.div>
            </div >
        </div >
    );
}

``

---

# File: app\reset-password\page.tsx

``typescript
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Lock, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        if (password !== confirmPassword) {
            setError("Passwords don't match");
            setLoading(false);
            return;
        }

        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) throw error;
            setMessage('Password updated successfully. Redirecting to login...');
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background">
            <div className="flex min-h-screen items-center justify-center p-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl"
                >
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-accent-primary to-accent-secondary flex items-center justify-center mb-4 shadow-lg shadow-accent-primary/20">
                            <Sparkles size={24} className="text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">
                            Reset Password
                        </h1>
                        <p className="text-gray-400 text-sm text-center">
                            Enter your new password below
                        </p>
                    </div>

                    <form onSubmit={handleReset} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-300 ml-1">New Password</label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-accent-primary/50 transition-all"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-300 ml-1">Confirm Password</label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-accent-primary/50 transition-all"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 p-2 rounded-lg text-center"
                            >
                                {error}
                            </motion.div>
                        )}

                        {message && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="text-green-400 text-xs bg-green-500/10 border border-green-500/20 p-2 rounded-lg text-center"
                            >
                                {message}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-accent-primary to-accent-secondary hover:opacity-90 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-accent-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : 'Update Password'}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}

``

---

# File: components\ThemeProvider.tsx

``typescript
'use client';

import { ThemeProvider as NextThemesProvider } from "next-themes";
import * as React from "react";

type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>;

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

``

---

# File: components\Chat\ArtifactViewer.tsx

``typescript
'use client';

import React from 'react';
import { X, ExternalLink, Maximize2, Minimize2, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ArtifactViewerProps {
    isOpen: boolean;
    onClose: () => void;
    code: string;
    language: string;
}

export default function ArtifactViewer({ isOpen, onClose, code, language }: ArtifactViewerProps) {
    const [isMaximized, setIsMaximized] = React.useState(false);

    const getPreviewUrl = () => {
        if (language === 'html' || language === 'xml' || language === 'svg') {
            const blob = new Blob([code], { type: 'text/html' });
            return URL.createObjectURL(blob);
        }

        if (language === 'javascript' || language === 'js' || language === 'typescript' || language === 'ts') {
            const jsCodeEncoded = encodeURIComponent(code);
            const fullHtml = `
                <!DOCTYPE html>
                <html>
                    <body style="background: #1e1e1e; color: #d4d4d4; font-family: monospace; padding: 1rem;">
                        <div id="output" style="white-space: pre-wrap;"></div>
                        <script>
                            const output = document.getElementById('output');
                            const originalLog = console.log;
                            console.log = function(...args) {
                                originalLog(...args);
                                const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
                                output.innerHTML += '> ' + msg + '\\n';
                            };
                            const originalError = console.error;
                            console.error = function(...args) {
                                originalError(...args);
                                const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
                                output.innerHTML += '<span style="color: #f87171;">> ' + msg + '</span>\\n';
                            };
                            try {
                                const codeToRun = decodeURIComponent("${jsCodeEncoded}");
                                // Very basic transpilation for TS by stripping typings could go here, but for now just eval JS
                                eval(codeToRun);
                            } catch (e) {
                                console.error(e);
                            }
                        </script>
                    </body>
                </html>
            `;
            const blob = new Blob([fullHtml], { type: 'text/html' });
            return URL.createObjectURL(blob);
        }

        if (language === 'python' || language === 'py') {
            const pyCodeEncoded = encodeURIComponent(code);
            const fullHtml = `
                <!DOCTYPE html>
                <html>
                    <head>
                        <script src="https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js"></script>
                    </head>
                    <body style="background: #1e1e1e; color: #d4d4d4; font-family: monospace; padding: 1rem;">
                        <div id="output" style="white-space: pre-wrap; color: #60a5fa;">[ Sandbox ] Loading Python runtime (Pyodide)...\\n</div>
                        <script>
                            async function main() {
                                try {
                                    let pyodide = await loadPyodide();
                                    const outputDiv = document.getElementById('output');
                                    outputDiv.innerHTML = '<span style="color: #34d399;">[ Sandbox ] Python runtime ready.\\n</span>'; 
                                    
                                    pyodide.setStdout({ batched: (msg) => outputDiv.innerHTML += msg + '\\n' });
                                    pyodide.setStderr({ batched: (msg) => outputDiv.innerHTML += '<span style="color: #f87171;">' + msg + '</span>\\n' });
                                    
                                    const code = decodeURIComponent("${pyCodeEncoded}");
                                    await pyodide.runPythonAsync(code);
                                } catch (e) {
                                    document.getElementById('output').innerHTML += '<span style="color: #f87171;">' + e + '</span>\\n';
                                }
                            }
                            main();
                        </script>
                    </body>
                </html>
            `;
            const blob = new Blob([fullHtml], { type: 'text/html' });
            return URL.createObjectURL(blob);
        }

        // Wrap snippets in a proper HTML doc with Tailwind support
        const fullHtml = `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <script src="https://cdn.tailwindcss.com"></script>
                    <style>
                        body { background: white; min-height: 100vh; margin: 0; padding: 1.5rem; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif; }
                    </style>
                </head>
                <body>
                    ${code}
                </body>
            </html>
        `;
        const blob = new Blob([fullHtml], { type: 'text/html' });
        return URL.createObjectURL(blob);
    };

    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (isOpen && code) {
            const url = getPreviewUrl();
            setPreviewUrl(url);
            return () => {
                if (url) URL.revokeObjectURL(url);
            };
        }
    }, [isOpen, code, language]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ x: '100%', opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: '100%', opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className={cn(
                        "fixed z-[100] glass-panel flex flex-col overflow-hidden shadow-2xl border-white/10",
                        isMaximized
                            ? "top-0 bottom-0 left-0 right-0 rounded-none"
                            : "top-0 bottom-0 right-0 left-0 md:left-auto md:top-4 md:bottom-4 md:right-4 w-full md:w-[min(90vw,650px)] md:rounded-2xl"
                    )}
                >
                    {/* Header */}
                    <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5 backdrop-blur-md">
                        <div className="flex items-center gap-3">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-lg shadow-red-500/20" />
                                <div className="w-3 h-3 rounded-full bg-amber-500/80 shadow-lg shadow-amber-500/20" />
                                <div className="w-3 h-3 rounded-full bg-emerald-500/80 shadow-lg shadow-emerald-500/20" />
                            </div>
                            <span className="text-[10px] font-black text-foreground opacity-40 uppercase tracking-[0.2em] ml-2">
                                Artifact Preview
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setIsMaximized(!isMaximized)}
                                className="p-2 text-foreground/50 hover:text-foreground hover:bg-white/10 rounded-lg transition-all active:scale-95"
                                title={isMaximized ? "Minimize" : "Maximize"}
                            >
                                {isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                            </button>
                            <button
                                onClick={onClose}
                                className="p-2 text-foreground/50 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all active:scale-95"
                                title="Close Preview"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Preview Content */}
                    <div className="flex-1 bg-white relative">
                        {previewUrl ? (
                            <iframe
                                src={previewUrl}
                                className="w-full h-full border-0"
                                title="Live Preview"
                                sandbox="allow-scripts"
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-background">
                                <RotateCcw className="animate-spin mb-2" />
                                <span className="text-sm font-medium">Preparing Sandbox...</span>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-3 bg-black/40 backdrop-blur-md flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-500 font-mono bg-white/5 px-2 py-0.5 rounded border border-white/5 uppercase">
                                {language}
                            </span>
                            <span className="text-[10px] text-gray-600">
                                Sandboxed Environment
                            </span>
                        </div>
                        <a
                            href={previewUrl || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-accent-primary hover:text-accent-secondary flex items-center gap-1.5 transition-colors font-medium"
                        >
                            Open in Browser <ExternalLink size={12} />
                        </a>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

``

---

# File: components\Chat\ChatInterface.tsx

``typescript
'use client';

import React, { useState, useRef, useEffect } from 'react';
import MessageBubble, { MessageSkeleton } from './MessageBubble';
import InputArea from './InputArea';
import WelcomeView from './WelcomeView';
import { Share2, Sparkles, Zap, Image as ImageIcon, Code, PenTool, Menu, Download, ChevronDown, RefreshCw, MessageSquarePlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, vibrate } from '@/lib/utils';
import { chatStore, Message as StoreMessage, Conversation } from '@/lib/chat-store';
import { useShortcuts } from '@/hooks/use-shortcuts';
import { useTheme } from 'next-themes';
import dynamic from 'next/dynamic';
import { FileAttachment } from './types';
import { useChat } from '@/hooks/useChat';

const ArtifactViewer = dynamic(() => import('./ArtifactViewer'), {
    ssr: false,
    loading: () => <div className="hidden">Loading Viewer...</div>
});

interface ChatMessage {
    id: string;
    role: 'user' | 'model';
    content: string;
}



const MODELS = [
    { id: 'gemini-2.5-flash', label: 'Gemini 2.5', icon: Zap, desc: 'Fast & efficient' },
    { id: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro', icon: Sparkles, desc: 'Deep reasoning' },
    { id: 'gemini-3-flash-preview', label: 'Gemini 3 Preview', icon: Sparkles, desc: 'Next-gen frontier model' },
    { id: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B', icon: Zap, desc: 'Powerful Open Source' },
    { id: 'mixtral-8x7b-32768', label: 'Mixtral 8x7b', icon: Zap, desc: 'High-speed efficiency' },
    { id: 'ollama-llama3', label: 'Local (Ollama)', icon: Zap, desc: 'Private localhost:11434' },
];

interface ChatInterfaceProps {
    conversationId: string | null;
    onConversationCreated: (id: string) => void;
    onOpenSidebar?: () => void;
    onNewChat?: () => void;
}

export default function ChatInterface({ conversationId, onConversationCreated, onOpenSidebar, onNewChat }: ChatInterfaceProps) {
    const [modelId, setModelId] = useState('llama-3.3-70b-versatile');
    const activeModel = MODELS.find(m => m.id === modelId) || MODELS[0];
    const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { theme, setTheme } = useTheme();

    const {
        messages,
        isGenerating,
        agentAction,
        handleSendMessage,
        handleEditMessage,
        handleRegenerate,
        handleStopGeneration
    } = useChat({
        conversationId,
        onConversationCreated,
        modelId
    });

    // Round 3: Scroll & Gesture States
    const [showHeader, setShowHeader] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [pullDistance, setPullDistance] = useState(0);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // Artifact Viewer State
    const [artifactCode, setArtifactCode] = useState<string>('');
    const [artifactLang, setArtifactLang] = useState<string>('');
    const [isArtifactOpen, setIsArtifactOpen] = useState(false);

    const handleOpenArtifact = (code: string, lang: string) => {
        setArtifactCode(code);
        setArtifactLang(lang);
        setIsArtifactOpen(true);
    };

    // Keyboard Shortcuts
    useShortcuts({
        onNewChat: () => onNewChat?.(),
        onToggleSidebar: () => onOpenSidebar?.(),
        onFocusInput: () => {
            const textarea = document.querySelector('textarea');
            textarea?.focus();
        },
        onToggleTheme: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
        onStopGeneration: handleStopGeneration
    });

    // Load initial model from localStorage
    useEffect(() => {
        const savedModel = localStorage.getItem('nextgen_model');
        if (savedModel) {
            setModelId(savedModel);
        }
    }, []);

    const handleModelChange = (newModelId: string) => {
        setModelId(newModelId);
        localStorage.setItem('nextgen_model', newModelId);
        setIsModelDropdownOpen(false);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);



    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.currentTarget;
        const currentScrollY = target.scrollTop;

        // Auto-hide header on scroll down, show on scroll up
        if (currentScrollY > 100) {
            if (currentScrollY > lastScrollY && showHeader) {
                setShowHeader(false);
            } else if (currentScrollY < lastScrollY && !showHeader) {
                setShowHeader(true);
            }
        } else {
            setShowHeader(true);
        }
        setLastScrollY(currentScrollY);
    };

    return (
        <div className="flex-1 flex flex-col h-full relative z-0 overflow-hidden">

            {/* Mobile Header - Sticky, Capsule, Floating */}
            <motion.div
                initial={false}
                animate={{
                    y: showHeader ? 0 : -100,
                    opacity: showHeader ? 1 : 0
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="md:hidden absolute top-[calc(env(safe-area-inset-top,0px)+8px)] left-3 right-3 z-50 flex items-center justify-between px-4 py-2.5 bg-sidebar-bg/80 backdrop-blur-xl border border-glass-border rounded-2xl shadow-lg ring-1 ring-white/10"
            >
                <button
                    onClick={onOpenSidebar}
                    className="p-2 -ml-2 text-foreground opacity-70 hover:opacity-100 hover:scale-110 active:scale-95 transition-all rounded-xl hover:bg-white/5 relative z-10"
                    aria-label="Open Sidebar"
                >
                    <Menu size={20} />
                </button>
                <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <div className="font-bold text-[13px] tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-accent-secondary">
                        NextGen AI
                    </div>
                    <div className="text-[9px] font-bold uppercase tracking-[0.1em] text-gray-500 flex items-center gap-1">
                        <Sparkles size={8} className="text-accent-primary animate-pulse" />
                        {activeModel?.label || 'Gemini'}
                    </div>
                </div>
            </motion.div>

            {/* ChatMessages Area */}
            <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-4 md:p-8 pt-20 md:pt-4 relative touch-pan-y"
                onScroll={handleScroll}
            >
                {/* Pull to New Chat Indicator */}
                <AnimatePresence>
                    {pullDistance > 20 && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: Math.min(pullDistance / 100, 1), y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="absolute top-4 left-0 right-0 flex flex-col items-center justify-center gap-1 z-10"
                        >
                            <div className={cn(
                                "p-2 rounded-full bg-accent-primary/20 border border-accent-primary/40 transition-transform",
                                pullDistance > 120 ? "scale-125 rotate-180" : ""
                            )}>
                                <RefreshCw size={16} className={cn("text-accent-primary", pullDistance > 120 ? "animate-spin" : "")} />
                            </div>
                            <span className="text-[10px] font-bold text-accent-primary uppercase tracking-widest">
                                {pullDistance > 120 ? 'Release for New Chat' : 'Pull for New Chat'}
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>
                <div className="max-w-4xl mx-auto space-y-6 h-full flex flex-col">

                    {/* Welcome View */}
                    {messages.length === 0 && (
                        <WelcomeView onSendMessage={handleSendMessage} />
                    )}

                    {messages.map((msg, index) => (
                        <MessageBubble
                            key={`${msg.id}-${index}`}
                            message={msg}
                            isLast={index === messages.length - 1}
                            isGenerating={isGenerating && index === messages.length - 1 && msg.role === 'model'}
                            onEdit={handleEditMessage}
                            onRegenerate={handleRegenerate}
                            onOpenArtifact={handleOpenArtifact}
                            onSendMessage={handleSendMessage}
                        />
                    ))}

                    {/* Typing / Thinking Indicator */}
                    {(isGenerating || agentAction) && (
                        messages.length > 0 && messages[messages.length - 1].role === 'model' && messages[messages.length - 1].content === '' ? (
                            <MessageSkeleton />
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                className="flex items-center gap-4 ml-12 bg-glass-bg/30 backdrop-blur-md px-4 py-2 rounded-2xl border border-glass-border/50 max-w-fit shadow-lg shadow-black/10"
                            >
                                <div className="relative">
                                    <Sparkles size={16} className="animate-spin-slow text-accent-primary relative z-10" />
                                    <div className="absolute inset-0 bg-accent-primary/30 blur-lg rounded-full animate-pulse" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent-primary to-accent-secondary animate-pulse">
                                        {agentAction || "Thinking..."}
                                    </span>
                                    {agentAction && (
                                        <span className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">
                                            Advanced Protocol Alpha
                                        </span>
                                    )}
                                </div>
                            </motion.div>
                        )
                    )}

                    <div ref={messagesEndRef} className="h-1" />
                </div>

                {/* Floating Scroll Pill removed as per request */}
            </div>

            {/* Input Area */}
            <div className="p-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10">
                <div className="max-w-4xl mx-auto">
                    <InputArea onSendMessage={handleSendMessage} isGenerating={isGenerating} modelId={modelId} onModelChange={handleModelChange} onStop={handleStopGeneration} />

                    {/* Artifact Viewer Side Panel */}
                    <ArtifactViewer
                        isOpen={isArtifactOpen}
                        onClose={() => setIsArtifactOpen(false)}
                        code={artifactCode}
                        language={artifactLang}
                    />
                </div>
 
                <div className="flex justify-center items-center gap-4 mt-0.5 mb-1 text-[9px]">
                    <p className="text-[10px] text-foreground opacity-50">
                        AI can make mistakes. Please verify important information.
                    </p>
                    {messages.length > 0 && (
                        <>
                            <button
                                onClick={() => {
                                    const text = messages.map(m => `${m.role === 'user' ? 'YOU' : 'AI'}: ${m.content}`).join('\n\n');
                                    navigator.clipboard.writeText(text);
                                }}
                                className="text-[10px] text-accent-secondary hover:text-accent-primary flex items-center gap-1 hover:scale-110 active:scale-95 transition-all"
                            >
                                <Share2 size={10} /> Copy Chat
                            </button>
                            <button
                                onClick={() => {
                                    const text = messages.map(m => `### ${m.role === 'user' ? 'ðŸ‘¤ YOU' : 'ðŸ¤– AI'}\n${m.content}`).join('\n\n---\n\n');
                                    const blob = new Blob([text], { type: 'text/markdown' });
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = `chat-export-${new Date().toISOString().split('T')[0]}.md`;
                                    document.body.appendChild(a);
                                    a.click();
                                    document.body.removeChild(a);
                                    URL.revokeObjectURL(url);
                                }}
                                className="text-[10px] text-accent-secondary hover:text-accent-primary flex items-center gap-1 hover:scale-110 active:scale-95 transition-all ml-2"
                            >
                                <Download size={10} /> Export (.md)
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

``

---

# File: components\Chat\CodeBlock.tsx

``typescript
import React, { useState } from 'react';
import { Bot, Copy, Check } from 'lucide-react';
import { cn, vibrate } from '@/lib/utils';
import { toast } from 'sonner';
import MermaidDiagram from './MermaidDiagram';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface CodeBlockProps {
    inline?: boolean;
    className?: string;
    children?: React.ReactNode;
    onOpenArtifact?: (code: string, lang: string) => void;
}

export default function CodeBlock({ inline, className, children, onOpenArtifact, ...props }: CodeBlockProps) {
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : '';
    const codeString = String(children).replace(/\n$/, '');
    const [isCopied, setIsCopied] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const PREVIEW_LANGS = ['html', 'css', 'javascript', 'js', 'jsx', 'typescript', 'ts', 'tsx', 'svg'];
    const showPreview = !inline && PREVIEW_LANGS.includes(language.toLowerCase());

    const lines = codeString.split('\n');
    const isLongCode = lines.length > 20;

    if (!inline && language === 'mermaid') {
        return <MermaidDiagram code={codeString} />;
    }

    if (!inline && match) {
        return (
            <div className="relative rounded-lg overflow-hidden my-4 bg-gray-900 border border-gray-800 shadow-xl group/code">
                <div className="flex items-center justify-between px-4 py-1.5 bg-gray-950/80 border-b border-gray-800">
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-gray-400 capitalize">{language}</span>
                        {showPreview && (
                            <button
                                onClick={() => onOpenArtifact?.(codeString, language)}
                                className="flex items-center gap-1.5 text-[10px] font-bold text-accent-primary hover:text-accent-secondary transition-colors px-2 py-0.5 rounded bg-accent-primary/5 border border-accent-primary/20"
                            >
                                <Bot size={12} /> Open Preview
                            </button>
                        )}
                    </div>
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(codeString);
                            setIsCopied(true);
                            vibrate(10);
                            toast.success('Code copied to clipboard');
                            setTimeout(() => setIsCopied(false), 2000);
                        }}
                        className="text-gray-400 hover:text-white transition-colors p-1 rounded-md hover:bg-white/10"
                        title="Copy code"
                        aria-label="Copy code block"
                    >
                        {isCopied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                    </button>
                </div>
                <div className={cn("bg-[#1e1e1e] transition-[max-height,opacity] duration-500 ease-in-out", !isExpanded && isLongCode ? "max-h-[350px] overflow-hidden" : "max-h-[5000px] overflow-visible")}>
                    <div className="overflow-x-auto p-4 text-sm font-mono leading-relaxed pb-4 [&>pre]:!bg-transparent [&>pre]:m-0 [&>pre]:p-0" style={{ scrollbarWidth: 'thin', scrollbarColor: '#30363d transparent' }}>
                        <SyntaxHighlighter
                            language={language || 'text'}
                            style={vscDarkPlus}
                            customStyle={{
                                margin: 0,
                                padding: 0,
                                background: 'transparent',
                            }}
                            codeTagProps={{
                                className: 'font-mono'
                            }}
                        >
                            {codeString}
                        </SyntaxHighlighter>
                    </div>

                    {/* Expand Overlay */}
                    {isLongCode && !isExpanded && (
                        <div className="absolute bottom-0 left-0 right-0 flex justify-center items-end pb-2 pt-16 bg-gradient-to-t from-[#1e1e1e] via-[#1e1e1e]/80 to-transparent pointer-events-none">
                            <button
                                onClick={() => setIsExpanded(true)}
                                className="pointer-events-auto px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-medium text-white shadow-lg backdrop-blur-md transition-all active:scale-95 flex items-center gap-1"
                            >
                                Show All ({lines.length} lines)
                            </button>
                        </div>
                    )}
                </div>
                {/* Show Less Footer */}
                {isLongCode && isExpanded && (
                    <div className="flex justify-center border-t border-gray-800 bg-[#1e1e1e]/90 py-2">
                        <button
                            onClick={() => setIsExpanded(false)}
                            className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-medium text-white shadow-lg backdrop-blur-md transition-all active:scale-95 flex items-center gap-1"
                        >
                            Show Less
                        </button>
                    </div>
                )}
            </div>
        );
    }
    return (
        <code className={cn("bg-black/10 dark:bg-white/10 rounded px-1.5 py-0.5 text-[0.9em] font-mono text-accent-secondary", className)} {...props}>
            {children}
        </code>
    );
}

``

---

# File: components\Chat\ImageAttachment.tsx

``typescript
import React, { useState, useRef } from 'react';
import { X, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import ImageViewer from './ImageViewer';

interface ImageAttachmentProps {
    src: string;
    alt: string;
    variant?: 'single' | 'grid';
}

export default function ImageAttachment({ src, alt, variant = 'single' }: ImageAttachmentProps) {
    const [error, setError] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    // Immediate cache check to prevent flickering
    React.useLayoutEffect(() => {
        if (imgRef.current?.complete) {
            setIsLoading(false);
        }
    }, [src]);

    const handleDownload = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!src) return;

        try {
            setIsDownloading(true);
            const response = await fetch(src);
            const blob = await response.blob() as Blob;
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `image-${Date.now()}.jpg`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            console.error("Failed to download image:", err);
        } finally {
            setIsDownloading(false);
        }
    };

    if (error) {
        return (
            <span className="p-4 rounded-xl border border-white/10 bg-white/5 text-gray-400 text-sm flex items-center gap-2 w-full h-full min-h-[100px] justify-center">
                <X size={16} />
                <span>Failed to load image</span>
            </span>
        );
    }

    const isGrid = variant === 'grid';

    return (
        <>
            <span
                onClick={() => setIsLightboxOpen(true)}
                className={cn(
                    "relative group block overflow-hidden rounded-xl border border-white/10 bg-black/20 shrink-0 cursor-zoom-in snap-center",
                    isGrid ? "w-[200px] h-[200px]" : "w-full max-w-full h-auto min-h-[200px]"
                )}
            >
                {isLoading && (
                    <span className="absolute inset-0 flex items-center justify-center bg-white/5 min-h-[200px]">
                        <span className="w-6 h-6 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
                    </span>
                )}
                <img
                    ref={imgRef}
                    src={src}
                    alt={alt}
                    loading="lazy"
                    decoding="async"
                    className={cn(
                        "transition-opacity duration-200 transition-transform transform-gpu",
                        isGrid ? "w-full h-full object-cover md:hover:scale-105" : "w-full h-auto block max-h-[350px] object-contain",
                        isLoading ? "opacity-0" : "opacity-100"
                    )}
                    onLoad={() => setIsLoading(false)}
                    onError={() => {
                        setIsLoading(false);
                        setError(true);
                        console.error("Image loading failed for URL:", src);
                    }}
                />
                {!isLoading && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 pointer-events-none">
                        <div className="bg-black/60 text-white rounded-full p-2 backdrop-blur-sm">
                            <Download size={18} />
                        </div>
                    </div>
                )}
            </span>

            <ImageViewer
                src={src}
                alt={alt}
                isOpen={isLightboxOpen}
                onClose={() => setIsLightboxOpen(false)}
            />
        </>
    );
}

``

---

# File: components\Chat\ImageViewer.tsx

``typescript

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

interface ImageViewerProps {
    src: string;
    alt: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function ImageViewer({ src, alt, isOpen, onClose }: ImageViewerProps) {
    const [isDownloading, setIsDownloading] = useState(false);

    // Prevent body scrolling when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const handleDownload = async () => {
        try {
            setIsDownloading(true);
            const response = await fetch(src);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `image-${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Failed to download image:', error);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-2xl px-4 py-8 md:p-12"
                >
                    {/* Top Action Bar */}
                    <div className="absolute top-0 left-0 right-0 p-4 md:p-6 flex justify-between items-center z-50 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
                        <button
                            onClick={(e) => { e.stopPropagation(); onClose(); }}
                            className="p-2.5 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-all text-white pointer-events-auto active:scale-95"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex items-center gap-3 pointer-events-auto">
                            <button
                                onClick={(e) => { e.stopPropagation(); handleDownload(); }}
                                className={cn(
                                    "p-2.5 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-all text-white active:scale-95",
                                    isDownloading && "animate-pulse"
                                )}
                            >
                                <Download size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Main Image Viewport using react-zoom-pan-pinch */}
                    <div className="w-full h-full flex items-center justify-center overflow-hidden">
                        <TransformWrapper
                            initialScale={1}
                            minScale={0.5}
                            maxScale={8}
                            centerZoomedOut={true}
                            wheel={{ step: 0.1 }}
                            doubleClick={{ step: 2 }}
                        >
                            {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                                <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }} contentStyle={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={src}
                                        alt={alt || "Viewed image"}
                                        className="max-w-full max-h-screen object-contain rounded-xl shadow-[0_0_80px_rgba(0,0,0,0.5)] select-none"
                                        draggable={false}
                                    />
                                </TransformComponent>
                            )}
                        </TransformWrapper>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

``

---

# File: components\Chat\InputArea.tsx

``typescript
import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Paperclip, Loader2, X, Image as ImageIcon, ChevronDown, Sparkles, Check, Zap, PenTool, Square, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, vibrate } from '@/lib/utils';
import { toast } from 'sonner';
import ModelSelector from './ModelSelector';
import PersonaSelector from './PersonaSelector';
import { FileAttachment } from './types';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

interface InputAreaProps {
    onSendMessage: (text: string, files: FileAttachment[], useWebSearch?: boolean) => void;
    isGenerating: boolean;
    modelId: string;
    onModelChange: (modelId: string) => void;
    onStop?: () => void;
}

export default function InputArea({ onSendMessage, isGenerating, modelId, onModelChange, onStop }: InputAreaProps) {
    const [input, setInput] = useState('');
    const [files, setFiles] = useState<FileAttachment[]>([]);
    const [persona, setPersona] = useState('Standard AI');
    const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
    const [isPersonaDropdownOpen, setIsPersonaDropdownOpen] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const modelDropdownRef = useRef<HTMLDivElement>(null);
    const personaDropdownRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [autoSendTrigger, setAutoSendTrigger] = useState(0);

    const { isRecording, interimTranscript, toggleRecording, stopRecording } = useSpeechRecognition({
        onResult: (transcript) => {
            setInput((prev) => prev + (prev ? ' ' : '') + transcript);
        },
        onSilence: () => {
            setAutoSendTrigger(prev => prev + 1);
        }
    });

    // Auto-Send effect
    useEffect(() => {
        if (autoSendTrigger > 0) {
            handleSend();
        }
    }, [autoSendTrigger]);

    // Auto-expand textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 128) + 'px';
        }
    }, [input]);

    // Close dropdowns on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modelDropdownRef.current && !modelDropdownRef.current.contains(event.target as Node)) {
                setIsModelDropdownOpen(false);
            }
            if (personaDropdownRef.current && !personaDropdownRef.current.contains(event.target as Node)) {
                setIsPersonaDropdownOpen(false);
            }
        };

        if (isModelDropdownOpen || isPersonaDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isModelDropdownOpen, isPersonaDropdownOpen]);

    // Cleanup on unmount
    useEffect(() => {
        const savedPersona = localStorage.getItem('nextgen_persona');
        if (savedPersona) setPersona(savedPersona);
    }, []);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            const processed = await Promise.all(newFiles.map(file => new Promise<any>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const result = reader.result as string;
                    const base64Data = result.split(',')[1];
                    resolve({
                        name: file.name,
                        mimeType: file.type,
                        data: base64Data,
                        preview: result
                    });
                };
                reader.readAsDataURL(file);
            })));
            setFiles(prev => [...prev, ...processed]);
        }
    };

    const removeFile = (index: number) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const [useWebSearch, setUseWebSearch] = useState(false);

    const handleSend = () => {
        if ((!input.trim() && files.length === 0) || isGenerating) return;
        vibrate(10);
        onSendMessage(input, files, useWebSearch);
        setInput('');
        setFiles([]);
        if (isRecording) {
            stopRecording();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = () => {
        setIsDragging(false);
    };

    const onDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files) {
            const newFiles = Array.from(e.dataTransfer.files);
            const processed = await Promise.all(newFiles.map(file => new Promise<any>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const result = reader.result as string;
                    const base64Data = result.split(',')[1];
                    resolve({
                        name: file.name,
                        mimeType: file.type,
                        data: base64Data,
                        preview: result
                    });
                };
                reader.readAsDataURL(file);
            })));
            setFiles(prev => [...prev, ...processed]);
        }
    };

    return (
        <div className="p-1 md:p-2 pb-0 relative w-full z-10">
            <div className="absolute inset-0 top-[-20px] bg-gradient-to-t from-background via-background/95 to-transparent pointer-events-none -z-10" />
            {/* Voice Status Indicator */}
            <AnimatePresence>
                {isRecording && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-2 z-50 pointer-events-none"
                    >
                        <div className="bg-black/80 backdrop-blur-md text-white text-sm px-4 py-2 rounded-full flex items-center gap-2 border border-white/10 shadow-xl">
                            <div className="flex gap-1 items-center h-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-1 bg-red-500 rounded-full animate-music-bar" style={{ animationDelay: `${i * 0.15}s` }} />
                                ))}
                            </div>
                            <span>{interimTranscript || "Listening..."}</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* File Previews */}
            <AnimatePresence>
                {files.length > 0 && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="flex gap-2 mb-3 overflow-x-auto pb-2 scrollbar-hide"
                    >
                        {files.map((file, i) => (
                            <motion.div
                                key={i}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="relative group shrink-0"
                            >
                                <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/10 shadow-lg">
                                    {file.mimeType.startsWith('image/') ? (
                                        <img src={file.preview} alt="upload" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-accent-primary/10 flex items-center justify-center text-accent-primary">
                                            <Paperclip size={20} />
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => removeFile(i)}
                                    className="absolute -top-1.5 -right-1.5 p-1 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X size={10} />
                                </button>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Standard Glass Wrapper */}
            <div
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                className={cn(
                    "glass-panel rounded-[20px] md:rounded-2xl p-1 md:p-2 flex items-end gap-1 md:gap-2 relative transition-all duration-500",
                    isDragging ? "ring-2 ring-accent-primary bg-accent-primary/5 scale-[1.01]" : "focus-within:ring-2 focus-within:ring-accent-primary/60 focus-within:shadow-[0_8px_32px_rgba(0,0,0,0.12)] focus-within:shadow-accent-primary/20 focus-within:-translate-y-0.5"
                )}
            >
                {/* Attach Button */}
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3.5 md:p-3 text-gray-400 hover:text-accent-primary transition-all duration-300 rounded-full hover:bg-white/5 hover:scale-110 active:scale-95 shrink-0"
                    title="Attach Files"
                    aria-label="Attach Files from Computer"
                >
                    <Paperclip size={20} className="md:w-[20px] md:h-[20px] w-[22px] h-[22px]" />
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    multiple
                    accept="image/*,application/pdf,text/*"
                    onChange={handleFileSelect}
                />

                {/* Persona Selector (Custom Dropdown) */}
                <PersonaSelector
                    persona={persona}
                    onPersonaChange={(newPersona) => {
                        setPersona(newPersona);
                        localStorage.setItem('nextgen_persona', newPersona);
                    }}
                    isOpen={isPersonaDropdownOpen}
                    setIsOpen={setIsPersonaDropdownOpen}
                    dropdownRef={personaDropdownRef}
                />

                {/* Text Input */}
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask anything..."
                    className="flex-1 max-h-32 min-h-[40px] md:min-h-[44px] bg-transparent border-none outline-none text-foreground placeholder:text-gray-500 resize-none py-2.5 md:py-3 scrollbar-hide text-[15px] md:text-base leading-relaxed transition-all duration-200"
                    rows={1}
                />

                {/* Right Actions */}
                <div className="flex items-center gap-1 pb-1 shrink-0">
                    <button
                        onClick={() => setUseWebSearch(!useWebSearch)}
                        className={cn(
                            "p-2 rounded-full transition-all duration-300",
                            useWebSearch ? "bg-accent-primary/20 text-accent-primary" : "text-gray-400 hover:bg-white/5 hover:text-white"
                        )}
                        title={useWebSearch ? "Web Search Enabled" : "Enable Web Search"}
                    >
                        <Globe size={18} className={cn(useWebSearch && "animate-pulse")} />
                    </button>

                    <ModelSelector
                        modelId={modelId}
                        onModelChange={onModelChange}
                        isOpen={isModelDropdownOpen}
                        setIsOpen={setIsModelDropdownOpen}
                        dropdownRef={modelDropdownRef}
                    />

                    <AnimatePresence mode="popLayout">
                        {input.trim() || files.length > 0 || isGenerating ? (
                            <motion.button
                                key="send"
                                initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                exit={{ opacity: 0, scale: 0.5, rotate: 10 }}
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                whileHover={{ scale: 1.08 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={isGenerating ? onStop : handleSend}
                                className={cn(
                                    "p-3.5 md:p-3 rounded-full transition-all duration-300",
                                    isGenerating
                                        ? "bg-red-500 text-white shadow-lg shadow-red-500/40 hover:bg-red-600 hover:shadow-xl hover:shadow-red-500/60"
                                        : "bg-accent-primary text-white shadow-lg shadow-accent-primary/40 hover:bg-accent-primary hover:shadow-xl hover:shadow-accent-primary/60"
                                )}
                                aria-label={isGenerating ? "Stop Generation" : "Send Message"}
                                title={isGenerating ? "Stop Generation" : "Send"}
                            >
                                {isGenerating ? <Square size={20} fill="currentColor" className="animate-pulse" /> : <Send size={20} className="translate-x-[1px] translate-y-[-1px] md:w-[20px] md:h-[20px] w-[22px] h-[22px]" />}
                            </motion.button>
                        ) : (
                            <motion.button
                                key="mic"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.15 }}
                                onClick={toggleRecording}
                                className={cn(
                                    "relative p-3.5 md:p-3 transition-all duration-300 rounded-full hover:scale-110 active:scale-95 shrink-0 z-10",
                                    isRecording ? "bg-red-500 text-white shadow-lg shadow-red-500/40" : "text-gray-400 hover:text-accent-primary hover:bg-white/5"
                                )}
                                title={isRecording ? "Stop Recording" : "Voice Input"}
                                aria-label={isRecording ? "Stop Voice Recording" : "Start Voice Recording"}
                            >
                                {/* Recording Pulse Rings */}
                                {isRecording && (
                                    <>
                                        <span className="absolute inset-0 rounded-full border-2 border-red-500 animate-ping opacity-75" style={{ animationDuration: '1.5s' }} />
                                        <span className="absolute -inset-2 rounded-full border border-red-500/50 animate-ping opacity-50" style={{ animationDuration: '2s', animationDelay: '0.2s' }} />
                                    </>
                                )}
                                <Mic size={20} className={cn("relative z-10 md:w-[20px] md:h-[20px] w-[22px] h-[22px]", isRecording && "animate-pulse")} />
                            </motion.button>
                        )}
                    </AnimatePresence>

                </div>
            </div>
        </div>
    );
}

``

---

# File: components\Chat\MermaidDiagram.tsx

``typescript
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface MermaidDiagramProps {
    code: string;
}

export default function MermaidDiagram({ code }: MermaidDiagramProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [svg, setSvg] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAndRender = async () => {
            setLoading(true);
            setError(null);

            try {
                // Check if mermaid is already loaded
                if (!(window as any).mermaid) {
                    const script = document.createElement('script');
                    script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js';
                    script.async = true;
                    document.body.appendChild(script);

                    await new Promise((resolve, reject) => {
                        script.onload = resolve;
                        script.onerror = reject;
                    });
                }

                const mermaid = (window as any).mermaid;
                mermaid.initialize({
                    startOnLoad: false,
                    theme: 'dark',
                    securityLevel: 'loose',
                    fontFamily: 'Inter',
                });

                const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
                const { svg } = await mermaid.render(id, code);
                setSvg(svg);
            } catch (err) {
                console.error('Mermaid render error:', err);
                setError('Failed to render diagram. Please check the syntax.');
            } finally {
                setLoading(false);
            }
        };

        loadAndRender();
    }, [code]);

    if (error) {
        return (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
                <pre className="mt-2 text-xs opacity-60 overflow-x-auto">{code}</pre>
            </div>
        );
    }

    return (
        <div className="relative my-6 glass-panel rounded-xl overflow-hidden bg-gray-900/50 p-6 flex justify-center items-center min-h-[100px]">
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-950/20 backdrop-blur-sm z-10">
                    <Loader2 className="animate-spin text-accent-primary" size={24} />
                </div>
            )}
            <div
                ref={containerRef}
                className="w-full h-full flex justify-center"
                dangerouslySetInnerHTML={{ __html: svg }}
            />
        </div>
    );
}

``

---

# File: components\Chat\MessageBubble.tsx

``typescript
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Bot, User, Copy, Check, ThumbsUp, ThumbsDown, Pencil, X, Send, Download, Volume2, RefreshCw, Sparkles } from 'lucide-react';
import { cn, vibrate } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import CodeBlock from './CodeBlock';
import ImageAttachment from './ImageAttachment';

interface MessageBubbleProps {
    message: {
        id: string;
        role: 'user' | 'model';
        content: string;
    };
    isLast?: boolean;
    isGenerating?: boolean;
    onEdit?: (id: string, newContent: string) => void;
    onRegenerate?: () => void;
    onOpenArtifact?: (code: string, lang: string) => void;
    onSendMessage?: (text: string, files: any[]) => void;
}

const MessageBubble = React.memo(({ message, isLast, isGenerating, onEdit, onRegenerate, onOpenArtifact, onSendMessage }: MessageBubbleProps) => {
    const isUser = message.role === 'user';
    const [isCopied, setIsCopied] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(message.content);
    const [isPlaying, setIsPlaying] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (isEditing && textareaRef.current) {
            textareaRef.current.focus();
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [isEditing]);

    const onOpenArtifactRef = useRef(onOpenArtifact);
    useEffect(() => {
        onOpenArtifactRef.current = onOpenArtifact;
    }, [onOpenArtifact]);

    const markdownComponents = React.useMemo(() => ({
        code: (props: any) => <CodeBlock {...props} onOpenArtifact={(code: string, lang: string) => onOpenArtifactRef.current?.(code, lang)} />,
        p: ({ node, children }: any) => {
            const childrenArray = React.Children.toArray(children);
            const imageChildren = childrenArray.filter(
                (child: any) =>
                    React.isValidElement(child) &&
                    (child as any).props?.node?.tagName === 'img'
            );

            const hasImages = imageChildren.length > 0;

            if (hasImages) {
                const variant = imageChildren.length === 1 ? 'single' : 'grid';

                const content = childrenArray.map((child: any) => {
                    if (React.isValidElement(child) && (child as any).props?.node?.tagName === 'img') {
                        return React.cloneElement(child, { variant } as any);
                    }
                    return child;
                });

                if (variant === 'grid') {
                    return (
                        <div className="flex gap-2 my-2 w-full overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent snap-x">
                            {content}
                        </div>
                    );
                }

                return <div className="mb-2 last:mb-0 w-full">{content}</div>;
            }
            return <div className="mb-4 last:mb-0 leading-7">{children}</div>;
        },
        img: ({ node, ...props }: any) => {
            return <ImageAttachment src={props.src || ''} alt={props.alt || ''} variant={props.variant || 'single'} />;
        },
        a: ({ node, ...props }: any) => {
            const href = props.href || '';
            if (href.startsWith('send:')) {
                const text = href.replace('send:', '');
                return (
                    <button
                        onClick={() => onSendMessage?.(decodeURIComponent(text), [])}
                        className="text-accent-primary hover:text-accent-secondary font-semibold transition-colors bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded-md border border-white/5"
                    >
                        {props.children}
                    </button>
                );
            }
            return <a {...props} target="_blank" rel="noopener noreferrer" className="text-accent-primary hover:text-accent-secondary underline" />;
        }
    }), [onSendMessage]);

    useEffect(() => {
        return () => {
            if (isPlaying) window.speechSynthesis.cancel();
        };
    }, [isPlaying]);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(message.content);
        setIsCopied(true);
        vibrate(10);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleReadAloud = () => {
        if (!window.speechSynthesis) return;

        if (isPlaying) {
            window.speechSynthesis.cancel();
            setIsPlaying(false);
            return;
        }

        const utterance = new SpeechSynthesisUtterance(message.content);
        utterance.onend = () => setIsPlaying(false);
        setIsPlaying(true);
        window.speechSynthesis.speak(utterance);
    };

    const handleSaveEdit = () => {
        if (onEdit && editContent.trim() !== "") {
            onEdit(message.id, editContent);
            setIsEditing(false);
        }
    };

    const handleCancelEdit = () => {
        setEditContent(message.content);
        setIsEditing(false);
    };

    return (
        <motion.div
            layout="position"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
                type: "spring",
                stiffness: 400,
                damping: 25,
            }}
            drag="x"
            dragDirectionLock
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={(_, info) => {
                if (Math.abs(info.offset.x) > 60) {
                    handleCopy();
                }
            }}
            className={cn(
                "flex w-full mb-8 relative touch-pan-y transform-gpu backface-hidden",
                isUser ? "justify-end" : "justify-start"
            )}
        >
            <div className={cn(
                "flex max-w-[85%] md:max-w-[85%] gap-4 group w-full",
                isUser ? "flex-row-reverse" : "flex-row"
            )}>
                <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-lg mt-1",
                    isUser ? "bg-accent-primary text-white" : "bg-transparent text-accent-secondary"
                )}>
                    {isUser ? <User size={16} /> : <Sparkles size={20} />}
                </div>

                {/* Bubble Container */}
                <div className={cn("flex flex-col gap-1 min-w-0 flex-1 md:flex-initial", isUser ? "items-end" : "items-start")}>
                    <div className={cn("flex items-end gap-2 group/bubble w-full", isUser ? "flex-row-reverse" : "flex-row")}>

                        <div className={cn(
                            "relative overflow-hidden w-full",
                            isUser
                                ? "p-4 rounded-2xl shadow-md bg-accent-primary text-white rounded-tr-sm min-w-[60px]"
                                : "py-2 text-foreground", // Removed bubble styling for AI
                            isEditing ? "w-full min-w-[300px]" : ""
                        )}>
                            {/* Shimmer Effect for User */}
                            {isUser && !isEditing && (
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] animate-[shimmer_5s_infinite] pointer-events-none" />
                            )}

                            {isEditing ? (
                                <div className="flex flex-col gap-2 w-full">
                                    <textarea
                                        ref={textareaRef}
                                        value={editContent}
                                        onChange={(e) => {
                                            setEditContent(e.target.value);
                                            e.target.style.height = 'auto';
                                            e.target.style.height = e.target.scrollHeight + 'px';
                                        }}
                                        className="w-full bg-black/5 dark:bg-black/20 text-foreground p-2 rounded-md outline-none resize-none min-h-[60px]"
                                    />
                                    <div className="flex justify-end gap-2">
                                        <button onClick={handleCancelEdit} className="p-1.5 hover:bg-glass-shimmer rounded-lg text-gray-500 dark:text-gray-300 hover:text-foreground hover:scale-110 active:scale-95 transition-all">
                                            <X size={16} />
                                        </button>
                                        <button onClick={handleSaveEdit} className="p-1.5 hover:bg-green-500/10 rounded-lg text-green-600 dark:text-green-400 hover:scale-110 active:scale-95 transition-all shadow-sm">
                                            <Send size={16} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="prose prose-sm md:prose-[15px] max-w-none break-words 
                                    text-foreground/90 prose-zinc dark:prose-invert
                                    prose-pre:bg-transparent prose-pre:p-0 prose-pre:m-0
                                    prose-code:before:content-none prose-code:after:content-none
                                    prose-a:text-accent-primary hover:prose-a:text-accent-secondary
                                ">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm, remarkMath]}
                                        rehypePlugins={[rehypeKatex]}
                                        urlTransform={(value) => value}
                                        components={markdownComponents}
                                    >
                                        {message.content + (isGenerating ? ' â–ˆ' : '')}
                                    </ReactMarkdown>
                                </div>
                            )}
                        </div>
                    </div>

                    <div
                        className={cn(
                            "flex items-center gap-1 md:gap-2 mt-1 px-1 select-none transition-opacity duration-300",
                            "opacity-50 md:opacity-0 md:group-hover:opacity-100 focus-within:opacity-100", // Faintly visible on touch, reveal fully on hover
                            isUser ? "justify-end" : "justify-start"
                        )}
                    >
                        {!isUser && (
                            <>
                                <button onClick={handleReadAloud} className={cn("p-2 mb-1 md:p-1.5 md:mb-0 hover:bg-glass-shimmer rounded-lg hover:scale-110 active:scale-95 transition-all duration-200", isPlaying ? "text-accent-primary opacity-100" : "text-gray-500 dark:text-gray-300 hover:text-accent-primary hover:opacity-100")} title="Read Aloud" aria-label="Read message aloud">
                                    <Volume2 size={16} className="md:w-3.5 md:h-3.5" />
                                </button>
                                {isLast && onRegenerate && (
                                    <button onClick={onRegenerate} className="p-2 mb-1 md:p-1.5 md:mb-0 hover:bg-glass-shimmer rounded-lg text-gray-500 dark:text-gray-300 hover:text-accent-primary hover:opacity-100 hover:scale-110 active:scale-95 transition-all duration-200" title="Regenerate" aria-label="Regenerate message">
                                        <RefreshCw size={16} className="md:w-3.5 md:h-3.5" />
                                    </button>
                                )}
                                <button className="p-2 mb-1 md:p-1.5 md:mb-0 hover:bg-glass-shimmer rounded-lg text-gray-500 dark:text-gray-300 hover:text-accent-primary hover:opacity-100 hover:scale-110 active:scale-95 transition-all duration-200" title="Helpful" aria-label="Rate message as helpful">
                                    <ThumbsUp size={16} className="md:w-3.5 md:h-3.5" />
                                </button>
                                <button className="p-2 mb-1 md:p-1.5 md:mb-0 hover:bg-glass-shimmer rounded-lg text-gray-500 dark:text-gray-300 hover:text-accent-primary hover:opacity-100 hover:scale-110 active:scale-95 transition-all duration-200" title="Not Helpful" aria-label="Rate message as not helpful">
                                    <ThumbsDown size={16} className="md:w-3.5 md:h-3.5" />
                                </button>
                            </>
                        )}

                        {/* Copy Button (Both) */}
                        {!isEditing && (
                            <button
                                onClick={handleCopy}
                                className="p-2 mb-1 md:p-1.5 md:mb-0 hover:bg-glass-shimmer rounded-lg text-gray-500 dark:text-gray-300 hover:text-accent-primary hover:opacity-100 hover:scale-110 active:scale-95 transition-all duration-200"
                                title="Copy"
                                aria-label="Copy message text"
                            >
                                {isCopied ? <Check size={16} className="text-green-500 md:w-3.5 md:h-3.5" /> : <Copy size={16} className="md:w-3.5 md:h-3.5" />}
                            </button>
                        )}

                        {/* Edit Button (User Only) */}
                        {isUser && !isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="p-2 mb-1 md:p-1.5 md:mb-0 hover:bg-glass-shimmer rounded-lg text-gray-500 dark:text-gray-300 hover:text-accent-primary hover:opacity-100 hover:scale-110 active:scale-95 transition-all duration-200"
                                title="Edit"
                                aria-label="Edit your message"
                            >
                                <Pencil size={16} className="md:w-3.5 md:h-3.5" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </motion.div >
    );
});

export const MessageSkeleton = () => (
    <div className="flex w-full mb-8 justify-start">
        <div className="flex max-w-[85%] gap-4 w-full flex-row">
            <div className="w-8 h-8 rounded-full bg-white/5 animate-skeleton shrink-0 mt-1" />
            <div className="flex flex-col gap-2 flex-1">
                <div className="h-4 bg-white/5 rounded-lg w-3/4 animate-skeleton" />
                <div className="h-4 bg-white/5 rounded-lg w-1/2 animate-skeleton" />
                <div className="h-4 bg-white/5 rounded-lg w-2/3 animate-skeleton" />
            </div>
        </div>
    </div>
);

export default MessageBubble;

``

---

# File: components\Chat\ModelSelector.tsx

``typescript
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Sparkles, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export const MODELS = [
    { id: 'gemini-2.5-flash', label: 'Gemini 2.5', icon: Zap, desc: 'Fast & efficient' },
    { id: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro', icon: Sparkles, desc: 'Deep reasoning' },
    { id: 'gemini-3-flash-preview', label: 'Gemini 3 Preview', icon: Sparkles, desc: 'Next-gen frontier model' },
    { id: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B', icon: Zap, desc: 'Powerful Open Source' },
    { id: 'mixtral-8x7b-32768', label: 'Mixtral 8x7b', icon: Zap, desc: 'High-speed efficiency' },
];

interface ModelSelectorProps {
    modelId: string;
    onModelChange: (modelId: string) => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    dropdownRef: React.RefObject<HTMLDivElement | null>;
}

export default function ModelSelector({ modelId, onModelChange, isOpen, setIsOpen, dropdownRef }: ModelSelectorProps) {
    const activeModel = MODELS.find(m => m.id === modelId) || MODELS[0];

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="px-3 py-2 text-gray-400 hover:text-accent-primary transition-all duration-300 rounded-xl hover:bg-white/5 hover:scale-105 active:scale-95 flex items-center gap-2"
                title="Switch Model"
                aria-label="Switch AI Model"
            >
                <activeModel.icon size={18} />
                <span className="hidden md:block text-xs font-semibold tracking-wide whitespace-nowrap">{activeModel.label}</span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: -8, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className={cn(
                            "fixed md:absolute z-[60] bg-white/95 dark:bg-black/95 backdrop-blur-xl border border-black/10 dark:border-white/10 shadow-2xl overflow-hidden transition-all",
                            "bottom-0 left-0 right-0 w-full rounded-t-3xl md:bottom-full md:right-0 md:mb-2 md:w-56 md:rounded-xl"
                        )}
                    >
                        <div className="px-5 py-4 md:p-2 border-b border-glass-border">
                            <h3 className="text-xs md:text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Model Choice</h3>
                        </div>
                        <div className="flex flex-col gap-1 p-2 md:p-0">
                            {MODELS.map((m) => (
                                <button
                                    key={m.id}
                                    onClick={() => {
                                        onModelChange(m.id);
                                        setIsOpen(false);
                                    }}
                                    className={cn(
                                        "w-full flex items-start gap-3 p-2 rounded-lg transition-all text-left group",
                                        modelId === m.id ? "bg-accent-primary/10 text-accent-primary" : "text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5"
                                    )}
                                    aria-label={`Select model: ${m.label}`}
                                >
                                    <div className={cn(
                                        "p-2 rounded-lg bg-black/20 group-hover:bg-accent-primary group-hover:text-white transition-all",
                                        modelId === m.id && "bg-accent-primary text-white"
                                    )}>
                                        <m.icon size={14} />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold flex items-center gap-1">
                                            {m.label}
                                            {modelId === m.id && <Check size={10} />}
                                        </div>
                                        <div className="text-[10px] opacity-50 font-medium leading-tight">{m.desc}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

``

---

# File: components\Chat\PersonaSelector.tsx

``typescript
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, Image as ImageIcon, PenTool, Mic, ChevronDown, Check } from 'lucide-react';
import { cn, vibrate } from '@/lib/utils';

export const PERSONAS = [
    { id: 'Standard AI', label: 'Standard', icon: Sparkles, desc: 'Balanced and helpful' },
    { id: "You are a senior software engineer called 'CodeMaster'.", label: 'Coder', icon: Zap, desc: 'Technical and precise' },
    { id: 'You are a creative copywriter.', label: 'Creative', icon: ImageIcon, desc: 'Inspiring and expressive' },
    { id: 'You are a data analyst.', label: 'Analyst', icon: PenTool, desc: 'Logical and insightful' },
    { id: "You are a sarcastic, witty, and slightly cynical AI assistant. You use dark humor and irony frequently.", label: 'Sarcastic', icon: Mic, desc: 'Witty and cynical' },
];

interface PersonaSelectorProps {
    persona: string;
    onPersonaChange: (persona: string) => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    dropdownRef: React.RefObject<HTMLDivElement | null>;
}

export default function PersonaSelector({ persona, onPersonaChange, isOpen, setIsOpen, dropdownRef }: PersonaSelectorProps) {
    const activePersona = PERSONAS.find(p => p.id === persona) || PERSONAS[0];

    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [customPrompt, setCustomPrompt] = React.useState('');

    const handleOpenCustom = () => {
        setCustomPrompt(localStorage.getItem('nextgen_custom_persona') || '');
        setIsModalOpen(true);
        setIsOpen(false);
    };

    const handleSaveCustom = () => {
        if (customPrompt.trim()) {
            localStorage.setItem('nextgen_custom_persona', customPrompt.trim());
            onPersonaChange(customPrompt.trim());
        } else {
            onPersonaChange('Standard AI');
        }
        setIsModalOpen(false);
        vibrate(5);
    };

    const isCustomActive = persona !== 'Standard AI' && !PERSONAS.some(p => p.id === persona);

    return (
        <>
            <div className="relative shrink-0 flex items-center h-[40px] md:h-[44px]" ref={dropdownRef}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="px-2 sm:px-3 py-1.5 md:py-2 flex items-center gap-1 sm:gap-2 bg-transparent text-[11px] sm:text-xs font-bold text-gray-500 hover:text-accent-primary hover:bg-white/5 rounded-xl transition-all h-full"
                >
                    {isCustomActive ? <PenTool size={16} className="sm:w-3.5 sm:h-3.5" /> : <activePersona.icon size={16} className="sm:w-3.5 sm:h-3.5" />}
                    <span className="hidden xs:block">{isCustomActive ? 'Custom' : activePersona.label}</span>
                    <ChevronDown size={14} className={cn("transition-transform duration-300 sm:w-3 sm:h-3", isOpen && "rotate-180")} />
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: -8, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className={cn(
                                "fixed md:absolute z-[60] bg-white/95 dark:bg-black/95 backdrop-blur-xl border border-black/10 dark:border-white/10 shadow-2xl overflow-hidden transition-all",
                                "bottom-0 left-0 right-0 w-full rounded-t-3xl md:bottom-full md:left-0 md:mb-2 md:w-48 md:rounded-xl"
                            )}
                        >
                            <div className="px-5 py-4 md:p-1.5 border-b border-glass-border">
                                <h3 className="text-xs md:text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">AI Persona</h3>
                            </div>
                            <div className="flex flex-col gap-0.5 p-2 md:p-0">
                                {PERSONAS.map((p) => (
                                    <button
                                        key={p.id}
                                        onClick={() => {
                                            onPersonaChange(p.id);
                                            setIsOpen(false);
                                            vibrate(5);
                                        }}
                                        className={cn(
                                            "w-full flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all text-left group",
                                            persona === p.id ? "bg-accent-primary/10 text-accent-primary" : "text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5"
                                        )}
                                    >
                                        <p.icon size={14} className={persona === p.id ? "opacity-100" : "opacity-50 group-hover:opacity-100"} />
                                        <span className="text-xs font-medium flex-1">{p.label}</span>
                                        {persona === p.id && <Check size={12} />}
                                    </button>
                                ))}
                                <div className="h-px bg-glass-border my-1" />
                                <button
                                    onClick={handleOpenCustom}
                                    className={cn(
                                        "w-full flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all text-left group",
                                        isCustomActive ? "bg-accent-primary/10 text-accent-primary" : "text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5"
                                    )}
                                >
                                    <PenTool size={14} className={isCustomActive ? "opacity-100" : "opacity-50 group-hover:opacity-100"} />
                                    <span className="text-xs font-medium flex-1">Custom...</span>
                                    {isCustomActive && <Check size={12} />}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                            onClick={() => setIsModalOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl z-[101] overflow-hidden"
                        >
                            <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/50">
                                <h3 className="font-semibold text-white">Custom System Instructions</h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white transition-colors p-1">
                                    <ChevronDown size={20} className="rotate-90" />
                                </button>
                            </div>
                            <div className="p-4 space-y-4">
                                <p className="text-sm text-zinc-400 leading-relaxed">
                                    Define exactly how the AI should behave globally. This will override default personas.
                                </p>
                                <textarea
                                    value={customPrompt}
                                    onChange={(e) => setCustomPrompt(e.target.value)}
                                    placeholder="e.g. You are a Senior React Developer. Always use TypeScript..."
                                    className="w-full h-32 bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm text-white placeholder:text-zinc-600 resize-none focus:outline-none focus:ring-1 focus:ring-accent-primary transition-all"
                                />
                            </div>
                            <div className="p-4 flex justify-end gap-2 bg-zinc-950/30 border-t border-zinc-800">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveCustom}
                                    className="px-4 py-2 bg-accent-primary hover:bg-accent-primary/90 text-white text-sm font-medium rounded-lg transition-all active:scale-95 shadow-lg shadow-accent-primary/20"
                                >
                                    Save & Apply
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

``

---

# File: components\Chat\types.ts

``typescript
export interface FileAttachment {
    name: string;
    data: string;
    mimeType: string;
    preview: string;
}

``

---

# File: components\Chat\WelcomeView.tsx

``typescript
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Image as ImageIcon, Code, PenTool } from 'lucide-react';

const QUICK_PROMPTS = [
    { icon: Zap, label: 'Analyze Data', prompt: 'Please analyze this technical data for me.', color: 'text-violet-400' },
    { icon: ImageIcon, label: 'Generate Image', prompt: 'Create a futuristic cyberpunk cityscape.', color: 'text-pink-400' },
    { icon: Code, label: 'Debug Code', prompt: 'Help me debug this React component.', color: 'text-cyan-400' },
    { icon: PenTool, label: 'Write Story', prompt: 'Write a short science fiction story about AI.', color: 'text-amber-400' },
];

interface WelcomeViewProps {
    onSendMessage: (text: string, files: any[]) => void;
}

export default function WelcomeView({ onSendMessage }: WelcomeViewProps) {
    const subtitle = "Your advanced assistant for analysis, creativity, and development.";
    const subtitleWords = subtitle.split(' ');

    return (
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-12 min-h-[50vh] relative z-0">
            {/* Background Gradients */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 flex items-center justify-center">
                <div className="absolute w-[600px] h-[600px] bg-accent-primary/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '6s' }} />
                <div className="absolute w-[500px] h-[500px] bg-accent-secondary/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '7s', animationDelay: '1s' }} />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative"
            >
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-accent-primary to-accent-secondary blur-2xl opacity-20 animate-pulse-slow" />
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-foreground via-foreground to-foreground/50 relative z-10">
                    NextGen AI
                </h1>
                <div className="text-gray-500 mt-6 text-lg md:text-xl max-w-lg mx-auto flex flex-wrap justify-center gap-[0.35rem]">
                    {subtitleWords.map((word, idx) => (
                        <motion.span
                            key={idx}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + idx * 0.08, duration: 0.6, ease: "easeOut" }}
                        >
                            {word}
                        </motion.span>
                    ))}
                </div>
            </motion.div>

            <motion.div
                className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl px-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
            >
                {QUICK_PROMPTS.map((item, i) => (
                    <motion.button
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -8, scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ delay: 0.6 + (i * 0.1), duration: 0.5, type: 'spring', stiffness: 300, damping: 20 }}
                        onClick={() => onSendMessage(item.prompt, [])}
                        className="flex flex-col items-center gap-4 p-5 md:p-6 rounded-3xl glass-panel border border-white/5 bg-glass-bg/50 backdrop-blur-xl hover:bg-glass-shimmer hover:border-accent-primary/30 transition-all duration-500 group hover:shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:shadow-accent-primary/20"
                    >
                        <div className={`p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 ${item.color} group-hover:bg-glass-shimmer transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-sm`}>
                            <item.icon size={24} />
                        </div>
                        <span className="text-sm font-semibold text-foreground/80 group-hover:text-foreground transition-all duration-300">{item.label}</span>
                    </motion.button>
                ))}
            </motion.div>
        </div>
    );
}

``

---

# File: components\Knowledge\KnowledgeManager.tsx

``typescript
'use client';

import React, { useState } from 'react';
import { Globe, Loader2, CheckCircle2, AlertCircle, Plus, BookOpen, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { crawlWebsite } from '@/app/actions/crawl';
import { syncInternalData } from '@/app/actions/sync-internal';
import { toast } from 'sonner';

export default function KnowledgeManager() {
    const [url, setUrl] = useState('https://aliet.ac.in/');
    const [isCrawling, setIsCrawling] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const [isSyncing, setIsSyncing] = useState(false);

    const handleCrawl = async () => {
        if (!url) {
            toast.error("Please enter a valid URL");
            return;
        }

        setIsCrawling(true);
        toast.info(`Starting crawl for ${url}...`);

        try {
            const result = await crawlWebsite(url);
            if (result.success) {
                toast.success(result.message);
                setUrl('');
                setIsOpen(false);
            } else {
                toast.error(result.error || "Failed to crawl");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsCrawling(false);
        }
    };

    const handleSyncCore = async () => {
        setIsSyncing(true);
        try {
            const result = await syncInternalData();
            if (result.success) {
                toast.success(`Success! Synced ${result.count} internal rules.`);
                setIsOpen(false);
            } else {
                toast.error(result.error || "Failed to sync core data");
            }
        } catch (error) {
            toast.error("An unexpected error occurred during sync");
        } finally {
            setIsSyncing(false);
        }
    };

    return (
        <div className="px-3 mb-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-3 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all group"
            >
                <div className="flex items-center gap-2">
                    <BookOpen size={16} className="text-accent-primary" />
                    <span className="text-xs font-bold uppercase tracking-wider text-foreground/70 group-hover:text-foreground">
                        Knowledge Base
                    </span>
                </div>
                <Plus size={14} className={cn("text-foreground/40 transition-transform", isOpen ? "rotate-45" : "")} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="pt-2 pb-1 space-y-2">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="Enter website URL..."
                                    className="w-full bg-black/20 border border-white/5 rounded-lg pl-8 pr-3 py-2 text-[11px] focus:outline-none focus:border-accent-primary/50 transition-colors"
                                />
                                <Globe size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/30" />
                            </div>
                            
                            <button
                                onClick={handleCrawl}
                                disabled={isCrawling || !url}
                                className="w-full bg-accent-primary/20 hover:bg-accent-primary/30 disabled:opacity-50 disabled:hover:bg-accent-primary/20 text-accent-primary text-[10px] font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-2"
                            >
                                {isCrawling ? (
                                    <>
                                        <Loader2 size={12} className="animate-spin" />
                                        INDEXING SITE...
                                    </>
                                ) : (
                                    <>
                                        <Globe size={12} />
                                        SYNC WEBSITE
                                    </>
                                )}
                            </button>
                            
                            <button
                                onClick={handleSyncCore}
                                disabled={isSyncing}
                                className="w-full bg-white/5 hover:bg-white/10 border border-white/5 disabled:opacity-50 text-foreground/70 text-[10px] font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-2"
                            >
                                {isSyncing ? (
                                    <>
                                        <Loader2 size={12} className="animate-spin" />
                                        SYNCING CORE...
                                    </>
                                ) : (
                                    <>
                                        <Zap size={12} className="text-yellow-500" />
                                        SYNC CORE DATA (RULES)
                                    </>
                                )}
                            </button>

                            
                            <p className="text-[9px] text-white/30 text-center px-2">
                                Scrapes up to 500 pages using recursive domain crawling.
                                <br />
                                Core Data syncs fixed rules from project files.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Helper for class names since I don't want to import it if it's not standard in the file
function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}

``

---

# File: components\Sidebar\ChatListItem.tsx

``typescript
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { History, Pin, MoreVertical, Edit2, Share, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Conversation } from '@/lib/chat-store';

interface ChatListItemProps {
    item: Conversation;
    activeId: string | null;
    isCollapsed: boolean;
    onSelectChat: (id: string) => void;
    onClose?: () => void;
    handleRenameSubmit: (e: React.FormEvent | React.FocusEvent, id: string) => void;
    editingId: string | null;
    editTitle: string;
    setEditTitle: (title: string) => void;
    setEditingId: (id: string | null) => void;
    activeMenuId: string | null;
    setActiveMenuId: (id: string | null) => void;
    handleAction: (e: React.MouseEvent, action: string, conversation: Conversation) => void;
}

const MenuOption = ({ icon: Icon, label, onClick, className }: any) => (
    <button
        onClick={onClick}
        className={cn("w-full flex items-center gap-2 px-3 py-2 text-xs text-foreground opacity-70 hover:opacity-100 hover:bg-glass-shimmer rounded-lg transition-all active:scale-95 text-left", className)}
        suppressHydrationWarning
    >
        <Icon size={14} className="opacity-70" />
        {label}
    </button>
);

export default function ChatListItem({
    item,
    activeId,
    isCollapsed,
    onSelectChat,
    onClose,
    handleRenameSubmit,
    editingId,
    editTitle,
    setEditTitle,
    setEditingId,
    activeMenuId,
    setActiveMenuId,
    handleAction
}: ChatListItemProps) {
    return (
        <div className="relative group/item">
            {editingId === item.id ? (
                <form
                    onSubmit={(e) => handleRenameSubmit(e, item.id)}
                    className="p-1 px-2"
                >
                    <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onBlur={(e) => handleRenameSubmit(e, item.id)}
                        onKeyDown={(e) => {
                            if (e.key === 'Escape') setEditingId(null);
                        }}
                        autoFocus
                        className="w-full bg-white/5 text-foreground rounded-lg px-2 py-1.5 text-sm outline-none border border-accent-primary/50"
                    />
                </form>
            ) : (
                <button
                    onClick={() => {
                        onSelectChat(item.id);
                        if (window.innerWidth < 768) onClose?.();
                    }}
                    className={cn(
                        "w-full text-left p-2.5 rounded-xl text-sm transition-all duration-300 flex items-center gap-3 relative overflow-hidden",
                        activeId === item.id
                            ? "bg-gradient-to-r from-accent-primary/20 to-accent-primary/5 text-accent-primary font-semibold shadow-[0_2px_10px_rgba(0,0,0,0.1)] border border-accent-primary/10"
                            : "text-foreground/70 hover:text-foreground hover:bg-glass-shimmer border border-transparent",
                        isCollapsed && "justify-center"
                    )}>

                    {/* Icon */}
                    {item.is_pinned ? (
                        <Pin size={14} className="shrink-0 text-accent-secondary fill-accent-secondary" />
                    ) : (
                        <History size={16} className={cn(
                            "shrink-0 transition-colors",
                            activeId === item.id ? "text-accent-primary" : "opacity-40 group-hover/item:opacity-100 group-hover/item:text-accent-primary"
                        )} />
                    )}

                    {/* Title */}
                    {!isCollapsed && (
                        <span className="truncate flex-1 tracking-tight">
                            {item.title}
                        </span>
                    )}

                    {/* Active Indicator */}
                    {activeId === item.id && !isCollapsed && (
                        <motion.div
                            layoutId="active-chat"
                            className="absolute left-0 w-1 h-8 bg-accent-primary rounded-r-full shadow-[0_0_15px_rgba(var(--accent-primary-rgb,124,58,237),0.5)]"
                            initial={{ opacity: 0, scaleY: 0.5 }}
                            animate={{ opacity: 1, scaleY: 1 }}
                            exit={{ opacity: 0, scaleY: 0.5 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        />
                    )}
                </button>
            )}

            {/* Action Menu Trigger */}
            {!isCollapsed && !editingId && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(activeMenuId === item.id ? null : item.id);
                    }}
                    className={cn(
                        "chat-menu-trigger absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-foreground hover:bg-glass-shimmer transition-all opacity-0 group-hover/item:opacity-100 z-20",
                        activeMenuId === item.id && "opacity-100 bg-glass-shimmer"
                    )}
                >
                    <MoreVertical size={14} />
                </button>
            )}

            {/* Dropdown Menu */}
            {!isCollapsed && activeMenuId === item.id && (
                <div className="chat-menu-content absolute right-0 top-full mt-1 w-44 bg-popover border border-glass-border rounded-xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                    <div className="p-1">
                        <MenuOption icon={Edit2} label="Rename" onClick={(e: any) => handleAction(e, 'rename', item)} />
                        <MenuOption icon={Pin} label={item.is_pinned ? "Unpin" : "Pin"} onClick={(e: any) => handleAction(e, 'pin', item)} />
                        <MenuOption icon={Share} label="Export Chat" onClick={(e: any) => handleAction(e, 'share', item)} />
                        <div className="h-px bg-white/5 my-1 mx-2" />
                        <MenuOption icon={Trash2} label="Delete" onClick={(e: any) => handleAction(e, 'delete', item)} className="text-red-400 hover:bg-red-500/10" />
                    </div>
                </div>
            )}
        </div>
    );
}

``

---

# File: components\Sidebar\Sidebar.tsx

``typescript
'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquarePlus, History, ChevronLeft, ChevronRight, Sparkles, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { chatStore, Conversation } from '@/lib/chat-store';
import { createClient } from '@/lib/supabase/client';
import ChatListItem from './ChatListItem';
import SidebarFooter from './SidebarFooter';
import KnowledgeManager from '../Knowledge/KnowledgeManager';

interface SidebarProps {
    activeId: string | null;
    onSelectChat: (id: string) => void;
    onNewChat: () => void;
    refreshKey: number;
}

export default function Sidebar({ activeId, onSelectChat, onNewChat, refreshKey, isOpen, onClose }: SidebarProps & { isOpen?: boolean, onClose?: () => void }) {
    const supabase = createClient();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        // Fetch Chats
        const fetchChats = async () => {
            setLoading(true);
            const data = await chatStore.getConversations();
            setConversations(data);
            setLoading(false);
        };
        fetchChats();

        // Check Auth
        const checkUser = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                setUser(user);
            } catch (error) {
                console.warn('Sidebar auth check failed:', error);
                setUser(null);
            }
        };
        checkUser();

        // Listen for Auth Changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
            setUser(session?.user ?? null);
            fetchChats(); // Re-fetch chats on auth change
        });

        return () => subscription.unsubscribe();

    }, [refreshKey]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.reload();
    };

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState('');
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

    // Click outside to close menu
    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (!event.target.closest('.chat-menu-trigger') && !event.target.closest('.chat-menu-content')) {
                setActiveMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleAction = async (e: React.MouseEvent, action: string, conversation: Conversation) => {
        e.stopPropagation(); // Prevent navigation
        setActiveMenuId(null);

        switch (action) {
            case 'rename':
                setEditingId(conversation.id);
                setEditTitle(conversation.title);
                break;
            case 'pin':
                await chatStore.togglePin(conversation.id, !conversation.is_pinned);
                refreshChats();
                break;
            case 'archive':
                if (confirm('Archive this chat?')) {
                    await chatStore.toggleArchive(conversation.id, true);
                    refreshChats();
                    if (activeId === conversation.id) onNewChat();
                }
                break;
            case 'delete':
                if (confirm('Delete this conversation permanently?')) {
                    await chatStore.deleteConversation(conversation.id);
                    refreshChats();
                    if (activeId === conversation.id) onNewChat();
                }
                break;
            case 'share':
                const messages = await chatStore.getMessages(conversation.id);
                const text = messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n');
                navigator.clipboard.writeText(text);
                alert('Conversation copied to clipboard!');
                break;
        }
    };

    const handleRenameSubmit = async (e: React.FormEvent | React.FocusEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();

        // Optimistic Update
        if (editTitle.trim() && editTitle !== conversations.find(c => c.id === id)?.title) {
            setConversations(prev => prev.map(c =>
                c.id === id ? { ...c, title: editTitle } : c
            ));

            await chatStore.renameConversation(id, editTitle);
            refreshChats(); // Background refresh
        }
        setEditingId(null);
    };

    const refreshChats = async () => {
        // Helper to re-fetch without full loading state if desired, or just re-trigger effect
        // For now, we can just trigger the parent's refresh logic if we had one, 
        // but since we keep local state 'conversations', we should re-fetch:
        const data = await chatStore.getConversations();
        setConversations(data);
    };

    const [matchedMessageConvoIds, setMatchedMessageConvoIds] = useState<string[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        if (!searchTerm.trim()) {
            setMatchedMessageConvoIds([]);
            return;
        }

        const timer = setTimeout(async () => {
            setIsSearching(true);
            const ids = await chatStore.searchConversations(searchTerm);
            setMatchedMessageConvoIds(ids);
            setIsSearching(false);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    const filteredHistory = conversations.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        matchedMessageConvoIds.includes(item.id)
    );

    const groupConversations = (items: Conversation[]) => {
        const groups: { [key: string]: Conversation[] } = {
            'Today': [],
            'Yesterday': [],
            'Previous 7 Days': [],
            'Older': []
        };

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const lastWeek = new Date(today);
        lastWeek.setDate(lastWeek.getDate() - 7);

        items.forEach(c => {
            const date = new Date(c.created_at);
            if (date >= today) groups['Today'].push(c);
            else if (date >= yesterday) groups['Yesterday'].push(c);
            else if (date >= lastWeek) groups['Previous 7 Days'].push(c);
            else groups['Older'].push(c);
        });

        return groups;
    };

    const conversationGroups = groupConversations(filteredHistory);

    const SidebarContent = (
        <div className="flex flex-col h-full w-full">
            {/* Header */}
            <div className={cn("flex items-center p-3 shrink-0", isCollapsed ? "flex-col justify-start gap-2 mt-2 mb-2" : "h-14 justify-between")}>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="hidden md:flex p-2 text-gray-500 dark:text-gray-400 hover:text-foreground hover:bg-sidebar-hover rounded-lg transition-colors cursor-pointer group relative w-9 h-9 items-center justify-center"
                        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                        suppressHydrationWarning
                    >
                        {isCollapsed ? (
                            <>
                                <Sparkles size={20} className="absolute text-foreground/70 transition-opacity duration-300 group-hover:opacity-0" />
                                <ChevronRight size={20} className="absolute opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                            </>
                        ) : (
                            <ChevronLeft size={20} />
                        )}
                    </button>
                    {!isCollapsed && (
                        <div className="flex items-center gap-2 px-1">
                            <Sparkles size={16} className="text-foreground/70" />
                            <span className="font-semibold text-[14px] text-foreground/90 tracking-wide">NextGen</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center">
                    <button
                        onClick={() => {
                            onNewChat();
                            setIsCollapsed(false);
                            if (window.innerWidth < 768) onClose?.();
                        }}
                        className="p-2 text-gray-500 dark:text-gray-400 hover:text-foreground hover:bg-sidebar-hover rounded-lg transition-colors group relative"
                        title="New Chat"
                        suppressHydrationWarning
                    >
                        <MessageSquarePlus size={20} />
                    </button>

                    {/* Mobile Close Button */}
                    <button
                        onClick={onClose}
                        className="md:hidden text-gray-500 dark:text-gray-400 hover:text-foreground p-2 rounded-lg hover:bg-sidebar-hover transition-colors ml-1"
                    >
                        <X size={20} />
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className={cn("mb-4", isCollapsed ? "px-2" : "px-4")}>
                {!isCollapsed ? (
                    <div className="relative">
                        {isSearching ? (
                            <Sparkles size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-accent-primary animate-pulse" />
                        ) : (
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        )}
                        <input
                            type="text"
                            placeholder="Search chats & messages..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-glass-bg border border-glass-border rounded-xl py-2 pl-9 pr-3 text-sm text-foreground placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-accent-primary/50 transition-all"
                            suppressHydrationWarning
                        />
                    </div>
                ) : (
                    <div className="flex justify-center">
                        <button
                            onClick={() => setIsCollapsed(false)}
                            className="p-2 text-gray-500 dark:text-gray-400 hover:text-foreground hover:bg-sidebar-hover rounded-lg transition-colors cursor-pointer"
                            title="Search"
                        >
                            <Search size={20} />
                        </button>
                    </div>
                )}
            </div>

            {!isCollapsed && <KnowledgeManager />}

            <div className="flex-1 overflow-y-auto px-2 space-y-2 scrollbar-hide py-2">
                {/* Grouped History Items */}
                {!isCollapsed && (
                    filteredHistory.length > 0 ? (
                        Object.entries(conversationGroups).map(([groupName, groupItems]) => (
                            groupItems.length > 0 && (
                                <div key={groupName} className="mb-4">
                                    <h3 className="text-[10px] font-bold text-gray-500 px-4 mb-2 uppercase tracking-[0.2em]">
                                        {groupName}
                                    </h3>
                                    <div className="space-y-1">
                                        {groupItems.map((item) => (
                                            <ChatListItem
                                                key={item.id}
                                                item={item}
                                                activeId={activeId}
                                                isCollapsed={isCollapsed}
                                                onSelectChat={onSelectChat}
                                                onClose={onClose}
                                                handleRenameSubmit={handleRenameSubmit}
                                                editingId={editingId}
                                                editTitle={editTitle}
                                                setEditTitle={setEditTitle}
                                                setEditingId={setEditingId}
                                                activeMenuId={activeMenuId}
                                                setActiveMenuId={setActiveMenuId}
                                                handleAction={handleAction}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )
                        ))
                    ) : loading ? (
                        // Skeleton Loaders
                        Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className={cn(
                                "w-full p-3 rounded-xl flex items-center gap-3 animate-pulse bg-glass-bg/50 my-1 justify-start"
                            )}>
                                <div className="w-5 h-5 rounded-md bg-white/10 shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-3 bg-white/10 rounded w-full" />
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="px-4 py-12 flex flex-col items-center justify-center text-foreground/40">
                            <History size={32} className="mb-3 opacity-30 text-foreground" />
                            <span className="text-xs font-medium text-center text-foreground bg-foreground/5 px-3 py-1.5 rounded-full border border-foreground/10 shadow-lg">No conversations yet</span>
                        </div>
                    )
                )}
            </div>

            <SidebarFooter user={user} isCollapsed={isCollapsed} handleLogout={handleLogout} />
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <motion.aside
                initial={{ width: 260 }}
                animate={{ width: isCollapsed ? 60 : 260 }}
                transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                className={cn(
                    "hidden md:flex border-r border-glass-border flex-col z-20 overflow-hidden h-full shrink-0 relative group/sidebar transition-colors duration-300",
                    isCollapsed ? "bg-background" : "bg-sidebar-bg"
                )}
            >
                {SidebarContent}
            </motion.aside>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        />
                        {/* Drawer */}
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={{ left: 0.1, right: 0.8 }}
                            onDragEnd={(_, info) => {
                                if ((info.offset.x < -50 || info.velocity.x < -500) && onClose) {
                                    onClose();
                                }
                            }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="md:hidden fixed top-0 left-0 bottom-0 w-[280px] z-50 flex flex-col h-full bg-sidebar-bg border-r border-glass-border touch-none"
                        >
                            {/* Force expanded state on mobile */}
                            {SidebarContent}
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}


``

---

# File: components\Sidebar\SidebarFooter.tsx

``typescript
import React, { useState, useEffect } from 'react';
import { User, LogOut, Settings, Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

interface SidebarFooterProps {
    user: any;
    isCollapsed: boolean;
    handleLogout: () => void;
}

export default function SidebarFooter({ user, isCollapsed, handleLogout }: SidebarFooterProps) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <div className="p-4 border-t border-white/5 mt-auto bg-black/20">
            {user ? (
                <div className={cn(
                    "w-full flex items-center gap-3 p-2 rounded-lg text-sm text-gray-400",
                    isCollapsed ? "justify-center flex-col gap-4" : "justify-between"
                )}>
                    <div className={cn("flex items-center gap-3 overflow-hidden", isCollapsed && "justify-center")}>
                        <User size={20} className="text-accent-primary shrink-0" />
                        {!isCollapsed && (
                            <div className="flex flex-col truncate">
                                <span className="text-white text-xs truncate">{user.email}</span>
                                <span className="text-[10px] text-gray-500">Free Plan</span>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleLogout}
                        className="text-gray-500 hover:text-red-400 hover:scale-110 active:scale-95 transition-all p-1"
                        title="Sign Out"
                    >
                        <LogOut size={16} />
                    </button>
                </div>
            ) : (
                <a href="/login" className={cn(
                    "w-full text-left p-2 rounded-lg text-sm text-foreground opacity-70 hover:opacity-100 hover:bg-glass-shimmer transition-colors flex items-center gap-3",
                    isCollapsed && "justify-center"
                )}>
                    <Settings size={20} />
                    {!isCollapsed && <span>Login / Profile</span>}
                </a>
            )}

            {/* Theme Toggle */}
            <button
                onClick={toggleTheme}
                className={cn(
                    "w-full mt-2 text-left p-2 rounded-lg text-sm text-foreground opacity-70 hover:opacity-100 hover:bg-glass-shimmer transition-colors flex items-center gap-3",
                    isCollapsed && "justify-center"
                )}
            >
                {mounted && (theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />)}
                {!mounted && <div className="w-5 h-5 rounded-full bg-white/10 animate-pulse" />}
                {!isCollapsed && <span>{mounted ? (theme === 'dark' ? 'Light Mode' : 'Dark Mode') : 'Theme'}</span>}
            </button>
        </div>
    );
}

``

---

# File: hooks\use-shortcuts.ts

``typescript
'use client';

import { useEffect } from 'react';

interface ShortcutOptions {
    onNewChat?: () => void;
    onToggleSidebar?: () => void;
    onFocusInput?: () => void;
    onToggleTheme?: () => void;
    onStopGeneration?: () => void;
}

export function useShortcuts({ onNewChat, onToggleSidebar, onFocusInput, onToggleTheme, onStopGeneration }: ShortcutOptions) {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const isCmd = event.metaKey || event.ctrlKey;
            const isShift = event.shiftKey;

            // Ctrl/Cmd + K: New Chat
            if (isCmd && event.key.toLowerCase() === 'k') {
                event.preventDefault();
                onNewChat?.();
            }

            // Ctrl/Cmd + \: Toggle Sidebar (Common shortcut for sidebars)
            if (isCmd && event.key === '\\') {
                event.preventDefault();
                onToggleSidebar?.();
            }

            // Ctrl/Cmd + /: Toggle Help (Could be useful later)

            // Ctrl/Cmd + L: Focus Input (Search/Input)
            if (isCmd && event.key.toLowerCase() === 'l') {
                event.preventDefault();
                onFocusInput?.();
            }

            // Ctrl/Cmd + J: Toggle Theme
            if (isCmd && event.key.toLowerCase() === 'j') {
                event.preventDefault();
                onToggleTheme?.();
            }

            // Escape: Stop Generation
            if (event.key === 'Escape') {
                event.preventDefault();
                onStopGeneration?.();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onNewChat, onToggleSidebar, onFocusInput, onToggleTheme, onStopGeneration]);
}

``

---

# File: hooks\useChat.ts

``typescript
import { useState, useRef, useEffect, useCallback } from 'react';
import { chatStore } from '@/lib/chat-store';
import { FileAttachment } from '@/components/Chat/types';

export interface ChatMessage {
    id: string;
    role: 'user' | 'model';
    content: string;
}

interface UseChatProps {
    conversationId: string | null;
    onConversationCreated: (id: string) => void;
    modelId: string;
}

export function useChat({ conversationId, onConversationCreated, modelId }: UseChatProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [agentAction, setAgentAction] = useState<string | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    const handleStopGeneration = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
    }, []);

    // Load messages when conversationId changes
    useEffect(() => {
        const loadMessages = async () => {
            if (conversationId) {
                if (isGenerating) return;
                const dbMessages = await chatStore.getMessages(conversationId);
                setMessages(dbMessages.map(m => ({ id: m.id, role: m.role as 'user' | 'model', content: m.content })));
            } else {
                setMessages([]);
            }
        };
        loadMessages();
    }, [conversationId]);

    const generateAIResponse = useCallback(async (history: ChatMessage[], userInput: string, files: FileAttachment[] = [], useWebSearch: boolean = false) => {
        setIsGenerating(true);
        let currentConvoId = conversationId;

        if (!currentConvoId) {
            const shortTitle = userInput.slice(0, 30) + (userInput.length > 30 ? '...' : '');
            const newConvo = await chatStore.createConversation(shortTitle);
            if (newConvo) {
                currentConvoId = newConvo.id;
                await chatStore.addMessage(currentConvoId, 'user', userInput);
                onConversationCreated(newConvo.id);

                // Fire and forget smart title generation
                fetch('/api/generate-title', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: userInput, modelId })
                }).then(res => res.json()).then(data => {
                    if (data.title && currentConvoId) {
                        chatStore.renameConversation(currentConvoId, data.title).then(() => {
                            // This is handled by a refresh event loop in layout, but typically triggers an update implicitly next cycle
                        });
                    }
                }).catch(err => console.error("Failed to generate title:", err));
            }
        }

        if (userInput.trim().toLowerCase().startsWith('/image')) {
            try {
                const prompt = userInput.replace(/^\/image\s*/i, '').trim() || "random abstract art";
                let imageUrl = '';

                try {
                    const response = await fetch('/api/image', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ prompt })
                    });

                    if (!response.ok) {
                        const errText = await response.text();
                        throw new Error(`API Error (${response.status}): ${errText}`);
                    }

                    const data = await response.json();
                    imageUrl = data.imageUrl;
                } catch (apiError) {
                    console.error('Secure image generation failed, falling back to client-side:', apiError);
                    const encodedPrompt = encodeURIComponent(prompt.slice(0, 500));
                    const seed = Math.floor(Math.random() * 1000000);
                    const apiKey = process.env.NEXT_PUBLIC_POLLINATIONS_API_KEY || '';
                    const keyParam = apiKey ? `&key=${apiKey}` : '';
                    imageUrl = `https://gen.pollinations.ai/image/${encodedPrompt}?width=1024&height=1024&seed=${seed}&model=flux&nologo=true${keyParam}`;
                }

                if (!imageUrl) throw new Error('Failed to generate image URL');

                const aiChatMessageContent = `![Generated Image](${imageUrl})\n\n_Generated via direct command: "${prompt}"_`;
                const aiChatMessageId = crypto.randomUUID();
                setMessages(prev => [...prev, { id: aiChatMessageId, role: 'model', content: aiChatMessageContent }]);

                if (currentConvoId) {
                    chatStore.addMessage(currentConvoId, 'model', aiChatMessageContent);
                }
            } catch (err) {
                console.error("Image command failed", err);
                setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'model', content: 'Sorry, I encountered an error generating the image.' }]);
            } finally {
                setIsGenerating(false);
            }
            return;
        }

        let aiChatMessageId = '';
        let aiChatMessageContent = '';

        try {
            abortControllerRef.current = new AbortController();
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    history,
                    message: userInput,
                    layers: files,
                    persona: localStorage.getItem('nextgen_persona') || 'Standard AI',
                    modelId,
                    useWebSearch,
                    rulesEnabled: localStorage.getItem('nextgen_rules_enabled') !== 'false'
                }),
                signal: abortControllerRef.current.signal
            });

            if (!response.ok) {
                const errorText = await response.text();
                let errorData;
                try {
                    errorData = JSON.parse(errorText);
                } catch (e) {
                    throw new Error(`Server Error (${response.status}): ${response.statusText}`);
                }
                throw new Error(errorData.error || 'Network response was not ok');
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) throw new Error('No reader available');

            aiChatMessageId = crypto.randomUUID();
            setMessages(prev => [...prev, { id: aiChatMessageId, role: 'model', content: '' }]);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const textChunk = decoder.decode(value, { stream: true });

                // Process potential multiple lines or concatenated markers in a single buffer
                const lines = textChunk.split('\n');

                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i];

                    if (line.startsWith('__AGENT_ACTION__:')) {
                        const action = line.replace('__AGENT_ACTION__:', '');
                        setAgentAction(action.trim());
                    } else if (line.trim() || i < lines.length - 1) {
                        // It's a normal text message line (or an empty line between text)
                        // Note: we only clear agent action if we are actually getting content
                        if (line.trim()) setAgentAction(null);

                        // Re-add the newline if it wasn't the last empty split item
                        const contentToAppend = line + (i < lines.length - 1 ? '\n' : '');
                        aiChatMessageContent += contentToAppend;

                        setMessages(prev => prev.map(msg =>
                            msg.id === aiChatMessageId ? { ...msg, content: aiChatMessageContent } : msg
                        ));
                    }
                }
            }

            if (currentConvoId) {
                chatStore.addMessage(currentConvoId, 'model', aiChatMessageContent);
            }

        } catch (error: any) {
            if (error.name === 'AbortError') {
                if (currentConvoId && aiChatMessageContent) {
                    chatStore.addMessage(currentConvoId, 'model', aiChatMessageContent + '\n\n_[Stopped by User]_');
                }
                setMessages(prev => prev.map(msg =>
                    msg.id === aiChatMessageId ? { ...msg, content: aiChatMessageContent + '\n\n_[Stopped by User]_' } : msg
                ));
                return;
            }
            console.error('Error generating response:', error);
            setAgentAction(null);
            const errorChatMessage = error.message || 'Sorry, I encountered an error. Please check your connection or API key.';
            setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'model', content: `Error: ${errorChatMessage}` }]);
        } finally {
            setIsGenerating(false);
            setAgentAction(null);
            abortControllerRef.current = null;
        }
    }, [conversationId, modelId, onConversationCreated]);

    const handleSendMessage = useCallback(async (text: string, files: FileAttachment[], useWebSearch: boolean = false) => {
        const tempId = crypto.randomUUID();
        let messageContent = '';
        const imageFiles = files.filter(f => f.mimeType.startsWith('image/'));
        const otherFiles = files.filter(f => !f.mimeType.startsWith('image/'));

        if (imageFiles.length > 0) {
            imageFiles.forEach(file => {
                messageContent += `![Image](${file.preview})\n\n`;
            });
        }

        if (text.trim()) {
            messageContent += text.trim();
        }

        if (otherFiles.length > 0) {
            if (messageContent) messageContent += '\n\n';
            messageContent += `*Attached ${otherFiles.length} other file(s)*`;
        }

        const userChatMessage: ChatMessage = { id: tempId, role: 'user', content: messageContent };

        const currentHistory = [...messages];
        setMessages([...currentHistory, userChatMessage]);

        if (conversationId) {
            chatStore.addMessage(conversationId, 'user', userChatMessage.content);
        }

        if (otherFiles.length > 0) {
            setIsGenerating(true);
            try {
                for (const file of otherFiles) {
                    const uploadRes = await fetch('/api/upload', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            fileName: file.name,
                            mimeType: file.mimeType,
                            fileData: file.data,
                            conversationId: conversationId
                        })
                    });

                    if (!uploadRes.ok) throw new Error(`Failed to process ${file.name}`);
                }
            } catch (err: any) {
                setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'model', content: `âŒ Error uploading document: ${err.message}` }]);
                setIsGenerating(false);
                return;
            }
        }

        generateAIResponse(currentHistory, userChatMessage.content, imageFiles, useWebSearch);
    }, [messages, conversationId, generateAIResponse]);

    const handleEditMessage = useCallback(async (id: string, newContent: string) => {
        const messageIndex = messages.findIndex(m => m.id === id);
        if (messageIndex === -1) return;

        const messagesToDelete = messages.slice(messageIndex + 1).map(m => m.id);
        const truncatedHistory = messages.slice(0, messageIndex);
        const updatedChatMessage = { ...messages[messageIndex], content: newContent };
        const newChatMessages = [...truncatedHistory, updatedChatMessage];

        setMessages(newChatMessages);

        if (conversationId) {
            chatStore.updateMessage(id, newContent);
            if (messagesToDelete.length > 0) {
                chatStore.deleteMessages(messagesToDelete);
            }
        }

        generateAIResponse(truncatedHistory, newContent, []);
    }, [messages, conversationId, generateAIResponse]);

    const handleRegenerate = useCallback(async () => {
        if (messages.length < 2) return;

        let lastUserChatMessageIndex = -1;
        for (let i = messages.length - 1; i >= 0; i--) {
            if (messages[i].role === 'user') {
                lastUserChatMessageIndex = i;
                break;
            }
        }

        if (lastUserChatMessageIndex === -1) return;

        const messagesToDelete = messages.slice(lastUserChatMessageIndex + 1).map(m => m.id);
        const truncatedHistory = messages.slice(0, lastUserChatMessageIndex);
        const lastUserInput = messages[lastUserChatMessageIndex].content;

        if (conversationId && messagesToDelete.length > 0) {
            chatStore.deleteMessages(messagesToDelete);
        }

        setMessages(messages.slice(0, lastUserChatMessageIndex + 1));
        generateAIResponse(truncatedHistory, lastUserInput, []);
    }, [messages, conversationId, generateAIResponse]);

    return {
        messages,
        isGenerating,
        agentAction,
        handleSendMessage,
        handleEditMessage,
        handleRegenerate,
        handleStopGeneration
    };
}

``

---

# File: hooks\useSpeechRecognition.ts

``typescript
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { vibrate } from '@/lib/utils';

interface UseSpeechRecognitionProps {
    onResult: (result: string) => void;
    onSilence?: () => void;
}

export function useSpeechRecognition({ onResult, onSilence }: UseSpeechRecognitionProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [interimTranscript, setInterimTranscript] = useState('');
    const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (typeof window !== 'undefined' && (window as any).recognitionInstance) {
                (window as any).recognitionInstance.stop();
            }
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        };
    }, []);

    const stopRecording = () => {
        setIsRecording(false);
        setInterimTranscript('');
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        if (typeof window !== 'undefined' && (window as any).recognitionInstance) {
            (window as any).recognitionInstance.stop();
        }
    };

    const toggleRecording = async () => {
        if (isRecording) {
            stopRecording();
            return;
        }

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            toast.error("Speech recognition not supported in this browser.");
            return;
        }

        try {
            // Request permission once clearly before starting recognition
            // This satisfies the user-gesture requirement on many mobile browsers
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            // Immediately stop the stream as we only needed it for permission
            // The SpeechRecognition API will manage its own audio stream
            stream.getTracks().forEach(track => track.stop());
        } catch (err) {
            console.error("Microphone permission denied:", err);
            toast.error("Please allow microphone access to use this feature.");
            return;
        }

        const recognition = new SpeechRecognition();
        (window as any).recognitionInstance = recognition;
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            setIsRecording(true);
            setInterimTranscript('');
            vibrate(20);
        };

        recognition.onend = () => {
            setIsRecording(false);
            setInterimTranscript('');
        };

        recognition.onresult = (event: any) => {
            let finalTranscript = '';
            let interim = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interim += event.results[i][0].transcript;
                }
            }

            if (finalTranscript) {
                onResult(finalTranscript);
            }
            setInterimTranscript(interim);

            // Continuous Mode Silence Detection
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
            if (onSilence) {
                silenceTimerRef.current = setTimeout(() => {
                    onSilence();
                }, 2500); // Trigger send after 2.5s of silence
            }
        };

        recognition.onerror = (event: any) => {
            console.error("Speech recognition error", event.error);
            // On mobile, 'aborted' or 'not-allowed' are common
            if (event.error === 'not-allowed') {
                toast.error("Microphone access blocked.");
            } else if (event.error === 'no-speech') {
                // Ignore no-speech errors to prevent UI flickering on mobile
            } else {
                toast.error(`Error: ${event.error}`);
            }
            setIsRecording(false);
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        };

        try {
            recognition.start();
        } catch (e) {
            console.error("Failed to start recognition:", e);
        }
    };

    return {
        isRecording,
        interimTranscript,
        toggleRecording,
        stopRecording
    };
}

``

---

# File: lib\cache.ts

``typescript
export class Cache {
    private static store: Map<string, { value: any; expiry: number }> = new Map();

    static get(key: string): any | null {
        const item = this.store.get(key);
        if (!item) return null;
        if (Date.now() > item.expiry) {
            this.store.delete(key);
            return null;
        }
        return item.value;
    }

    static set(key: string, value: any, ttlSeconds: number = 60) {
        if (this.store.size > 100) {
            this.cleanup();
        }
        this.store.set(key, {
            value,
            expiry: Date.now() + ttlSeconds * 1000
        });
    }

    static cleanup() {
        // Simple garbage collection
        const now = Date.now();
        for (const [key, item] of this.store.entries()) {
            if (now > item.expiry) this.store.delete(key);
        }
    }
}

``

---

# File: lib\chat-store.ts

``typescript
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

export interface Conversation {
    id: string;
    user_id: string;
    title: string;
    created_at: string;
    is_pinned?: boolean;
    is_archived?: boolean;
}

export interface Message {
    id: string;
    conversation_id: string;
    role: 'user' | 'model';
    content: string;
    created_at: string;
}

// Guest Mode Helper
const isGuest = (id: string) => id.startsWith('guest-');

// In-Memory Storage for Guest Session
let guestConversations: Conversation[] = [];
const guestMessages: Record<string, Message[]> = {};

export const chatStore = {
    // Fetch all conversations
    async getConversations() {
        let user = null;
        try {
            const { data } = await supabase.auth.getUser();
            user = data?.user;
        } catch (e) {
            console.warn('Auth check failed in getConversations, defaulting to guest mode:', e);
        }

        try {
            // Guest Mode: Return in-memory conversations
            if (!user) {
                return guestConversations
                    .filter(c => !c.is_archived)
                    .sort((a, b) => {
                        // Sort by pinned (true first), then date (newest first)
                        if (a.is_pinned && !b.is_pinned) return -1;
                        if (!a.is_pinned && b.is_pinned) return 1;
                        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                    });
            }

            console.log('Fetching conversations safely...'); // Debug log
            const { data, error } = await supabase
                .from('conversations')
                .select('id, user_id, title, created_at') // Explicitly select columns to avoid "column does not exist" error
                .eq('user_id', user.id)
                .is('is_archived', false) // Enabled
                .order('is_pinned', { ascending: false }) // Enabled
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data as Conversation[];
        } catch (error) {
            console.error('Error fetching conversations:', JSON.stringify(error, null, 2));
            // Return empty array on error to prevent UI crashes
            return [];
        }
    },

    // Create a new conversation
    async createConversation(title: string) {
        let user = null;
        try {
            const { data } = await supabase.auth.getUser();
            user = data?.user;
        } catch (e) {
            console.warn('Auth check failed in createConversation, defaulting to guest:', e);
        }

        try {
            // Guest Mode: Create and store in memory
            if (!user) {
                const newConvo: Conversation = {
                    id: `guest-${Date.now()}`,
                    user_id: 'guest',
                    title: title,
                    created_at: new Date().toISOString(),
                    is_pinned: false,
                    is_archived: false
                };
                guestConversations.unshift(newConvo); // Add to beginning
                return newConvo;
            }

            const { data, error } = await supabase
                .from('conversations')
                .insert([{ user_id: user.id, title }])
                .select('id, user_id, title, created_at')
                .single();

            if (error) throw error;
            return data as Conversation;
        } catch (error) {
            console.error('Error creating conversation:', error);
            return null;
        }
    },

    // Fetch messages for a specific conversation
    async getMessages(conversationId: string) {
        // Guest Mode: Retrieve from memory
        if (isGuest(conversationId)) {
            return guestMessages[conversationId] || [];
        }

        try {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .eq('conversation_id', conversationId)
                .order('created_at', { ascending: true });

            if (error) throw error;
            return data as Message[];
        } catch (error) {
            console.error('Error fetching messages:', error);
            return [];
        }
    },

    // Add a message to a conversation
    async addMessage(conversationId: string, role: 'user' | 'model', content: string) {
        // Guest Mode: Store in memory
        if (isGuest(conversationId)) {
            const newMsg: Message = {
                id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                conversation_id: conversationId,
                role,
                content,
                created_at: new Date().toISOString()
            };

            if (!guestMessages[conversationId]) {
                guestMessages[conversationId] = [];
            }
            guestMessages[conversationId].push(newMsg);

            return newMsg;
        }

        try {
            const { data, error } = await supabase
                .from('messages')
                .insert([{ conversation_id: conversationId, role, content }])
                .select()
                .single();

            if (error) throw error;
            return data as Message;
        } catch (error) {
            console.error('Error adding message:', error);
            return null;
        }
    },

    // Create conversation AND add first message (helper)
    async startNewChat(title: string, firstMessage: string) {
        const convo = await this.createConversation(title);
        if (convo) {
            await this.addMessage(convo.id, 'user', firstMessage);
        }
        return convo;
    },

    async deleteMessages(messageIds: string[]) {
        if (!messageIds || messageIds.length === 0) return true;
        let isGuestMode = messageIds.some(id => isGuest(id) || id.startsWith('msg-'));
        if (isGuestMode) {
            for (const convoId in guestMessages) {
                guestMessages[convoId] = guestMessages[convoId].filter(m => !messageIds.includes(m.id));
            }
            return true;
        }

        try {
            const { error } = await supabase.from('messages').delete().in('id', messageIds);
            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error deleting messages:', error);
            return false;
        }
    },

    async updateMessage(messageId: string, newContent: string) {
        if (isGuest(messageId) || messageId.startsWith('msg-')) {
            for (const convoId in guestMessages) {
                const msg = guestMessages[convoId].find(m => m.id === messageId);
                if (msg) msg.content = newContent;
            }
            return true;
        }

        try {
            const { error } = await supabase.from('messages').update({ content: newContent }).eq('id', messageId);
            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error updating message:', error);
            return false;
        }
    },

    // --- Enhanced Management Features ---

    async deleteConversation(id: string) {
        if (isGuest(id)) {
            guestConversations = guestConversations.filter(c => c.id !== id);
            delete guestMessages[id];
            return true;
        }
        try {
            const { error } = await supabase.from('conversations').delete().eq('id', id);
            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error deleting conversation:', error);
            return false;
        }
    },

    async renameConversation(id: string, newTitle: string) {
        if (isGuest(id)) {
            const convo = guestConversations.find(c => c.id === id);
            if (convo) convo.title = newTitle;
            return true;
        }
        try {
            const { error } = await supabase.from('conversations').update({ title: newTitle }).eq('id', id);
            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error renaming conversation:', error);
            return false;
        }
    },

    async togglePin(id: string, isPinned: boolean) {
        if (isGuest(id)) {
            const convo = guestConversations.find(c => c.id === id);
            if (convo) convo.is_pinned = isPinned;
            return true;
        }
        try {
            // Note: Requires 'is_pinned' column in Supabase 'conversations' table
            const { error } = await supabase.from('conversations').update({ is_pinned: isPinned }).eq('id', id);
            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error pinning conversation:', error);
            return false;
        }
    },

    async toggleArchive(id: string, isArchived: boolean) {
        if (isGuest(id)) {
            const convo = guestConversations.find(c => c.id === id);
            if (convo) convo.is_archived = isArchived;
            return true;
        }
        try {
            // Note: Requires 'is_archived' column in Supabase
            const { error } = await supabase.from('conversations').update({ is_archived: isArchived }).eq('id', id);
            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error archiving conversation:', error);
            return false;
        }
    },

    async searchConversations(query: string): Promise<string[]> {
        if (!query.trim()) return [];
        try {
            const { data, error } = await supabase
                .from('messages')
                .select('conversation_id')
                .ilike('content', `%${query}%`);

            if (error) throw error;
            return [...new Set(data.map(m => m.conversation_id))] as string[];
        } catch (error) {
            console.error('Error searching messages:', error);
            return [];
        }
    }
};

``

---

# File: lib\faculty-rules.ts

``typescript
import { Rule } from './rules-data';

export const FACULTY_RULES: Rule[] = [
    // --- CSE ---
    {
        keywords: ['cse faculty', 'cse department faculty', 'computer science faculty'],
        response: "ðŸ“š **Computer Science & Engineering (CSE) Faculty Members**:\n\n" +
            "1. [Dr. L. Kanya Kumari](send:Dr. L. Kanya Kumari)\n" +
            "2. [Dr. K. Sireesha](send:Dr. K. Sireesha)\n" +
            "3. [Mr. M. Samuel Sandeep](send:Mr. M. Samuel Sandeep)\n" +
            "4. [Dr. K. Venkateswara Rao](send:Dr. K. Venkateswara Rao)\n" +
            "5. [Mr. V V R Manoj](send:Mr. V V R Manoj)\n" +
            "6. [Mrs. Y Karuna Manjusha](send:Mrs. Y Karuna Manjusha)\n" +
            "7. [Mrs. Ch Pavani](send:Mrs. Ch Pavani)\n" +
            "8. [Mrs K Neeharika](send:Mrs K Neeharika)\n" +
            "9. [Mrs P Nancy Anurag](send:Mrs P Nancy Anurag)\n" +
            "10. [Mr K Satish](send:Mr K Satish)\n" +
            "11. [Mrs K Rajeswari](send:Mrs K Rajeswari)\n" +
            "12. [Mr K Kishore Kumar](send:Mr K Kishore Kumar)\n" +
            "13. [Mrs K Sravanthi](send:Mrs K Sravanthi)\n" +
            "14. [Mrs A Mary Lavanya](send:Mrs A Mary Lavanya)\n" +
            "15. [Mrs N V L Manaswini](send:Mrs N V L Manaswini)\n" +
            "16. [Mrs B Alekhya](send:Mrs B Alekhya)\n" +
            "17. [Mrs M Naga Usha](send:Mrs M Naga Usha)\n" +
            "18. [Mrs K Pushpavalli](send:Mrs K Pushpavalli)\n" +
            "19. [Ms A Iswarya Gold](send:Ms A Iswarya Gold)\n" +
            "20. [Mrs V Rama Lakshmi](send:Mrs V Rama Lakshmi)\n" +
            "21. [Dr Ch Meher Babu](send:Dr Ch Meher Babu)\n" +
            "22. [Mrs Y B Pramodini](send:Mrs Y B Pramodini)\n" +
            "23. [Mr B N V Basaveswara Rao](send:Mr B N V Basaveswara Rao)\n" +
            "24. [Mrs M Havila](send:Mrs M Havila)\n" +
            "25. [Mr N Naga Vijaya Varma](send:Mr N Naga Vijaya Varma)\n" +
            "26. [Dr Y Prakasa Rao](send:Dr Y Prakasa Rao)\n" +
            "27. [Mrs N Rohini Krishna Sai](send:Mrs N Rohini Krishna Sai)\n" +
            "28. [Dr M Sumender Roy](send:Dr M Sumender Roy)\n\n" +
            "Click on any name to view their full profile! âœ¨"
    },
    { keywords: ['kanya kumari', 'cse hod', 'hod of cse'], response: "ðŸŽ“ **Dr. L. Kanya Kumari** is the Associate Professor & HOD of Computer Science & Engineering. Qualification: Ph.D.\n\n![Dr. L. Kanya Kumari](https://aliet.ac.in/storage/blocks/01K8D7KSJP7WKG90BWDEF4Q9EW.jpg)" },
    { keywords: ['sireesha', 'cse faculty'], response: "ðŸ‘¤ **Dr. K. Sireesha** is an Associate Professor in the CSE department. Qualification: Ph.D." },
    { keywords: ['samuel sandeep', 'cse faculty'], response: "ðŸ‘¤ **Mr. M. Samuel Sandeep** is an Associate Professor in the CSE department. Qualification: M.Tech" },
    { keywords: ['venkateswara rao', 'cse faculty'], response: "ðŸ‘¤ **Dr. K. Venkateswara Rao** is an Assistant Professor in the CSE department. Qualification: Ph.D." },
    { keywords: ['manoj', 'cse faculty'], response: "ðŸ‘¤ **Mr. V V R Manoj** is an Assistant Professor in the CSE department. Qualification: M.Tech" },
    { keywords: ['karuna manjusha', 'cse faculty'], response: "ðŸ‘¤ **Mrs. Y Karuna Manjusha** is an Assistant Professor in the CSE department. Qualification: M.Tech" },
    { keywords: ['pavani', 'cse faculty'], response: "ðŸ‘¤ **Mrs. Ch Pavani** is an Assistant Professor in the CSE department. Qualification: M.Tech" },
    { keywords: ['neeharika', 'cse faculty'], response: "ðŸ‘¤ **Mrs K Neeharika** is an Assistant Professor in the CSE department. Qualification: M.Tech" },
    { keywords: ['nancy anurag', 'cse faculty'], response: "ðŸ‘¤ **Mrs P Nancy Anurag** is an Assistant Professor in the CSE department. Qualification: M.Tech" },
    { keywords: ['satish', 'cse faculty'], response: "ðŸ‘¤ **Mr K Satish** is an Assistant Professor in the CSE department. Qualification: M.Tech" },
    { keywords: ['rajeswari', 'cse faculty'], response: "ðŸ‘¤ **Mrs K Rajeswari** is an Assistant Professor in the CSE department. Qualification: M.Tech" },
    { keywords: ['kishore kumar', 'cse faculty'], response: "ðŸ‘¤ **Mr K Kishore Kumar** is an Assistant Professor in the CSE department. Qualification: M.Tech" },
    { keywords: ['sravanthi', 'cse faculty'], response: "ðŸ‘¤ **Mrs K Sravanthi** is an Assistant Professor in the CSE department. Qualification: M.Tech" },
    { keywords: ['mary lavanya', 'cse faculty'], response: "ðŸ‘¤ **Mrs A Mary Lavanya** is an Assistant Professor in the CSE department. Qualification: M.Tech" },
    { keywords: ['manaswini', 'cse faculty'], response: "ðŸ‘¤ **Mrs N V L Manaswini** is an Assistant Professor in the CSE department. Qualification: M.Tech" },
    { keywords: ['alekhya', 'cse faculty'], response: "ðŸ‘¤ **Mrs B Alekhya** is an Assistant Professor in the CSE department. Qualification: M.Tech" },
    { keywords: ['naga usha', 'cse faculty'], response: "ðŸ‘¤ **Mrs M Naga Usha** is an Assistant Professor in the CSE department. Qualification: M.Tech" },
    { keywords: ['pushpavalli', 'cse faculty'], response: "ðŸ‘¤ **Mrs K Pushpavalli** is an Assistant Professor in the CSE department. Qualification: M.Tech" },
    { keywords: ['iswarya gold', 'cse faculty'], response: "ðŸ‘¤ **Ms A Iswarya Gold** is an Assistant Professor in the CSE department. Qualification: M.Tech" },
    { keywords: ['rama lakshmi', 'cse faculty'], response: "ðŸ‘¤ **Mrs V Rama Lakshmi** is an Assistant Professor in the CSE department. Qualification: M.Tech" },
    { keywords: ['meher babu', 'cse faculty'], response: "ðŸ‘¤ **Dr Ch Meher Babu** is an Assistant Professor in the CSE department. Qualification: Ph.D." },
    { keywords: ['pramodini', 'cse faculty'], response: "ðŸ‘¤ **Mrs Y B Pramodini** is an Assistant Professor in the CSE department. Qualification: M.S" },
    { keywords: ['basaveswara rao', 'cse faculty'], response: "ðŸ‘¤ **Mr B N V Basaveswara Rao** is an Assistant Professor in the CSE department. Qualification: M.Tech" },
    { keywords: ['havila', 'cse faculty'], response: "ðŸ‘¤ **Mrs M Havila** is an Assistant Professor in the CSE department. Qualification: M.Tech" },
    { keywords: ['vijaya varma', 'cse faculty'], response: "ðŸ‘¤ **Mr N Naga Vijaya Varma** is an Assistant Professor in the CSE department. Qualification: M.Tech" },
    { keywords: ['prakasa rao', 'cse faculty'], response: "ðŸ‘¤ **Dr Y Prakasa Rao** is an Assistant Professor in the CSE department. Qualification: Ph.D." },
    { keywords: ['rohini krishna sai', 'cse faculty'], response: "ðŸ‘¤ **Mrs N Rohini Krishna Sai** is an Assistant Professor in the CSE department. Qualification: M.Tech" },
    { keywords: ['sumender roy', 'cse faculty'], response: "ðŸ‘¤ **Dr M Sumender Roy** is an Associate Professor in the CSE department. Qualification: Ph.D." },
    {
        keywords: ['it faculty', 'it department faculty', 'information technology faculty'],
        response: "ðŸ“š **Information Technology (IT) Faculty Members**:\n\n" +
            "1. [Mr. V. Vidya Sagar](send:Mr. V. Vidya Sagar)\n" +
            "2. [Mrs. M. Kaladevi](send:Mrs. M. Kaladevi)\n" +
            "3. [Mr. T. Kiran](send:Mr. T. Kiran)\n" +
            "4. [Mrs. M. Suneela](send:Mrs. M. Suneela)\n" +
            "5. [Mrs. M. Kanthi Rekha](send:Mrs. M. Kanthi Rekha)\n" +
            "6. [Ms. G. Sudha Rani](send:Ms. G. Sudha Rani)\n" +
            "7. [Mr. K. Yaswanth](send:Mr. K. Yaswanth)\n" +
            "8. [Dr. M. Chinna Rao](send:Dr. M. Chinna Rao)\n" +
            "9. [Dr. P. Sudheer](send:Dr. P. Sudheer)\n" +
            "10. [Mrs. K. Sravanthi](send:Mrs. K. Sravanthi)\n\n" +
            "Click on any name to view their full profile! âœ¨"
    },
    { keywords: ['vidya sagar', 'it hod', 'hod of it'], response: "ðŸŽ“ **Mr. V. Vidya Sagar** is the Associate Professor & HOD of Information Technology. Qualification: M.Tech\n\n![Mr. V. Vidya Sagar](https://aliet.ac.in/storage/2/01K8J0WTGMM67DG79R015TEXF7.jpg)" },
    { keywords: ['kaladevi', 'it faculty'], response: "ðŸ‘¤ **Mrs. M. Kaladevi** is an Assistant Professor in the IT department. Qualification: M.Tech\n\n![Mrs. M. Kaladevi](https://aliet.ac.in/storage/336/01K99FWTWW1BEZVH0QEYD5Z77S.jpg)" },
    { keywords: ['t. kiran', 'it faculty'], response: "ðŸ‘¤ **Mr. T. Kiran** is an Assistant Professor in the IT department. Qualification: M.Tech\n\n![Mr. T. Kiran](https://aliet.ac.in/storage/323/01K94TP2WAPNW7N7BG9DCD71BK.jpg)" },
    { keywords: ['suneela', 'it faculty'], response: "ðŸ‘¤ **Mrs. M. Suneela** is an Assistant Professor in the IT department. Qualification: M.Tech\n\n![Mrs. M. Suneela](https://aliet.ac.in/storage/337/01K99FYVKKSBPCBW3CPQCVJYHZ.jpg)" },
    { keywords: ['kanthi rekha', 'it faculty'], response: "ðŸ‘¤ **Mrs. M. Kanthi Rekha** is an Assistant Professor in the IT department. Qualification: M.Tech\n\n![Mrs. M. Kanthi Rekha](https://aliet.ac.in/storage/338/01K99FZFZW2T55VXMD9GBJBP7G.jpg)" },
    { keywords: ['sudha rani', 'it faculty'], response: "ðŸ‘¤ **Ms. G. Sudha Rani** is an Assistant Professor in the IT department. Qualification: M.Tech\n\n![Ms. G. Sudha Rani](https://aliet.ac.in/storage/324/01K94TVYM74NMAGWKHFXHJ43D6.jpg)" },
    { keywords: ['yaswanth', 'it faculty'], response: "ðŸ‘¤ **Mr. K. Yaswanth** is an Assistant Professor in the IT department. Qualification: M.Tech\n\n![Mr. K. Yaswanth](https://aliet.ac.in/storage/325/01K94V06BG4G7F0RARR5GWG4V0.jpg)" },
    { keywords: ['chinna rao', 'it faculty'], response: "ðŸ‘¤ **Dr. M. Chinna Rao** is an Associate Professor in the IT department. Qualification: Ph.D." },
    { keywords: ['sudheer', 'it faculty'], response: "ðŸ‘¤ **Dr. P. Sudheer** is an Assistant Professor in the IT department. Qualification: Ph.D.\n\n![Dr. P. Sudheer](https://aliet.ac.in/storage/326/01K94V42X9T1463G2P0JCEN0F0.jpg)" },
    { keywords: ['sravanthi', 'it faculty'], response: "ðŸ‘¤ **Mrs. K. Sravanthi** is an Assistant Professor in the IT department. Qualification: M.Tech" },

    // --- ECE ---
    {
        keywords: ['ece faculty', 'ece department faculty', 'electronics faculty'],
        response: "ðŸ“š **Electronics & Communication Engineering (ECE) Faculty Members**:\n\n" +
            "1. [Dr. K. Prasanthi Jasmine](send:Dr. K. Prasanthi Jasmine)\n" +
            "2. [Mr. Mullapudi Rama Krishna](send:Mr. Mullapudi Rama Krishna)\n" +
            "3. [Dr. Lakshmi Narayana Thalluri](send:Dr. Lakshmi Narayana Thalluri)\n" +
            "4. [Dr. S. Mallikharjuna Rao](send:Dr. S. Mallikharjuna Rao)\n" +
            "5. [Dr. K. Mariya Priyadarshani](send:Dr. K. Mariya Priyadarshani)\n" +
            "6. [Mrs. B. Santhi Kiran](send:Mrs. B. Santhi Kiran)\n" +
            "7. [Mr. P. Bose Babu](send:Mr. P. Bose Babu)\n" +
            "8. [Mr. G. Roopa Krishna Chandra](send:Mr. G. Roopa Krishna Chandra)\n" +
            "9. [Mr. Gorapudi Ravi](send:Mr. Gorapudi Ravi)\n" +
            "10. [Mr. Y. Pavan Kumar](send:Mr. Y. Pavan Kumar)\n" +
            "11. [Mr. Kanakala Appala Raju](send:Mr. Kanakala Appala Raju)\n" +
            "12. [Mr. Gayala Vijay Kumar](send:Mr. Gayala Vijay Kumar)\n" +
            "13. [Mr. Merugamalli Rama Krishna](send:Mr. Merugamalli Rama Krishna)\n" +
            "14. [Mr. Kosuru Srinivasa Rao](send:Mr. Kosuru Srinivasa Rao)\n" +
            "15. [Mr. Abdul Azeem](send:Mr. Abdul Azeem)\n" +
            "16. [Mr. MD. Baig Mohammad](send:Mr. MD. Baig Mohammad)\n" +
            "17. [Mr. M. Ravi Kumar](send:Mr. M. Ravi Kumar)\n" +
            "18. [Mrs. T. Manogna](send:Mrs. T. Manogna)\n" +
            "19. [Mr. N. Bujji Babu](send:Mr. N. Bujji Babu)\n\n" +
            "Click on any name to view their full profile! âœ¨"
    },
    { keywords: ['jasmine', 'ece faculty'], response: "ðŸ‘¤ **Dr. K. Prasanthi Jasmine** is a Professor in the ECE department. Qualification: Ph.D.\n\n![Dr. K. Prasanthi Jasmine](https://aliet.ac.in/storage/471/01KADH1XVR4QESD8MJZWAWHWTF.png)" },
    { keywords: ['mullapudi rama krishna', 'ece faculty'], response: "ðŸ‘¤ **Mr. Mullapudi Rama Krishna** is an Associate Professor in the ECE department. Qualification: M.Tech\n\n![Mr. Mullapudi Rama Krishna](https://aliet.ac.in/storage/529/01KATRGRM8KKCGK40K896WMAB7.jpg)" },
    { keywords: ['thalluri', 'ece hod', 'hod of ece'], response: "ðŸŽ“ **Dr. Lakshmi Narayana Thalluri** is the Associate Professor & HOD of ECE. Qualification: Ph.D.\n\n![Dr. Lakshmi Narayana Thalluri](https://aliet.ac.in/storage/732/01KC497DZQDDRF80BS88QJKP7X.jpg)" },
    { keywords: ['mallikharjuna rao', 'ece faculty'], response: "ðŸ‘¤ **Dr. S. Mallikharjuna Rao** is an Associate Professor in the ECE department. Qualification: Ph.D.\n\n![Dr. S. Mallikharjuna Rao](https://aliet.ac.in/storage/523/01KANJ9PWJM98A2ATN9QJKHV6E.jpg)" },
    { keywords: ['mariya priyadarshini', 'ece faculty'], response: "ðŸ‘¤ **Dr. K. Mariya Priyadarshani** is an Assistant Professor in the ECE department. Qualification: Ph.D.\n\n![Dr. K. Mariya Priyadarshini](https://aliet.ac.in/storage/517/01KANF1WFX15064KJVKBJAH0EJ.png)" },
    { keywords: ['santhi kiran', 'ece faculty'], response: "ðŸ‘¤ **Mrs. B. Santhi Kiran** is an Associate Professor in the ECE department. Qualification: M.Tech\n\n![Mrs. B. Santhi Kiran](https://aliet.ac.in/storage/518/01KANFARNXD8RT8CGDGYMJCVJQ.jpg)" },
    { keywords: ['bose babu', 'ece faculty'], response: "ðŸ‘¤ **Mr. P. Bose Babu** is an Assistant Professor in the ECE department. Qualification: M.Tech\n\n![Mr. P. Bose Babu](https://aliet.ac.in/storage/527/01KAT832V3DW7Y641ET87WBAJQ.jpg)" },
    { keywords: ['roopa krishna chandra', 'ece faculty'], response: "ðŸ‘¤ **Mr. G. Roopa Krishna Chandra** is an Assistant Professor in the ECE department. Qualification: M.Tech\n\n![Mr. G. Roopa Krishna Chandra](https://aliet.ac.in/storage/526/01KAT7W4HY4RTMC6A22MCATZ0W.jpg)" },
    { keywords: ['ravi', 'gorapudi ravi', 'ece faculty'], response: "ðŸ‘¤ **Mr. Gorapudi Ravi** is an Assistant Professor in the ECE department. Qualification: M.Tech\n\n![Mr. Gorapudi Ravi](https://aliet.ac.in/storage/524/01KANJGQKDWACSSX002JCJV6Y3.jpg)" },
    { keywords: ['pavan kumar', 'ece faculty'], response: "ðŸ‘¤ **Mr. Y. Pavan Kumar** is an Assistant Professor in the ECE department. Qualification: M.Tech" },
    { keywords: ['appala raju', 'ece faculty'], response: "ðŸ‘¤ **Mr. Kanakala Appala Raju** is an Assistant Professor in the ECE department. Qualification: M.Tech" },
    { keywords: ['vijay kumar', 'gayala vijay kumar', 'ece faculty'], response: "ðŸ‘¤ **Mr. Gayala Vijay Kumar** is an Assistant Professor in the ECE department. Qualification: M.Tech\n\n![Mr. Gayala Vijay Kumar](https://aliet.ac.in/storage/521/01KANHSDW3STYXSZPJJME8XDWK.jpg)" },
    { keywords: ['merugamalli rama krishna', 'ece faculty'], response: "ðŸ‘¤ **Mr. Merugamalli Rama Krishna** is an Assistant Professor in the ECE department. Qualification: M.Tech\n\n![Mr. Merugamalli Rama Krishna](https://aliet.ac.in/storage/519/01KANFP0NTKQSJFJCDJ17JTDCT.jpg)" },
    { keywords: ['kosuru srinivasa rao', 'ece faculty'], response: "ðŸ‘¤ **Mr. Kosuru Srinivasa Rao** is an Assistant Professor in the ECE department. Qualification: M.Tech\n\n![Mr. Kosuru Srinivasa Rao](https://aliet.ac.in/storage/520/01KANFVC3BFMF43NB2KAK48PM0.jpg)" },
    { keywords: ['abdul azeem', 'ece faculty'], response: "ðŸ‘¤ **Mr. Abdul Azeem** is an Assistant Professor in the ECE department. Qualification: M.Tech" },
    { keywords: ['baig mohammad', 'ece faculty'], response: "ðŸ‘¤ **Mr. MD. Baig Mohammad** is an Assistant Professor in the ECE department. Qualification: M.Tech\n\n![Mr. MD. Baig Mohammad](https://aliet.ac.in/storage/528/01KATR9EDNSHPH7Q2Y21FKHQAP.jpg)" },
    { keywords: ['ravi kumar', 'ece faculty'], response: "ðŸ‘¤ **Mr. M. Ravi Kumar** is an Assistant Professor in the ECE department. Qualification: M.Tech\n\n![Mr. M. Ravi Kumar](https://aliet.ac.in/storage/525/01KANJVFRH8WBFKEPKJ9XM5SYD.jpg)" },
    { keywords: ['manogna', 'ece faculty'], response: "ðŸ‘¤ **Mrs. T. Manogna** is an Assistant Professor in the ECE department. Qualification: M.Tech\n\n![Mrs. T. Manogna](https://aliet.ac.in/storage/516/01KANEKAR96MF9ATETK428PE7S.jpg)" },
    { keywords: ['bujji babu', 'ece faculty'], response: "ðŸ‘¤ **Mr. N. Bujji Babu** is an Assistant Professor in the ECE department. Qualification: M.Tech" },

    // --- CSE AI & ML ---
    {
        keywords: ['ai ml faculty', 'cse ai ml faculty', 'artificial intelligence faculty'],
        response: "ðŸ“š **CSE (AI & ML) Faculty Members**:\n\n" +
            "1. [Dr. K. Siva Rama Krishna](send:Dr. K. Siva Rama Krishna)\n" +
            "2. [Mr. Y. C. Ashok Kumar](send:Mr. Y. C. Ashok Kumar)\n" +
            "3. [Mrs. P. Nikhitha](send:Mrs. P. Nikhitha)\n" +
            "4. [Mr. B. Rajashekar Reddy](send:Mr. B. Rajashekar Reddy)\n" +
            "5. [Ms. K. Reena](send:Ms. K. Reena)\n" +
            "6. [Ms. M. Mounika Aradhana](send:Ms. M. Mounika Aradhana)\n" +
            "7. [Mrs. V. Munni](send:Mrs. V. Munni)\n" +
            "8. [Mr. MD. BAIG MOHAMMAD](send:Mr. MD. BAIG MOHAMMAD)\n" +
            "9. [Dr. M. CHINNA Rao](send:Dr. M. CHINNA Rao)\n" +
            "10. [Ms. M. BEULAH RANI](send:Ms. M. BEULAH RANI)\n" +
            "11. [Mrs. B. Swathi](send:Mrs. B. Swathi)\n" +
            "12. [Mr. P. Jagadish](send:Mr. P. Jagadish)\n" +
            "13. [Mr. A. Naga Srinivasa Rao](send:Mr. A. Naga Srinivasa Rao)\n" +
            "14. [Ms. S. Prabhavathi](send:Ms. S. Prabhavathi)\n" +
            "15. [Mrs. D. Archana](send:Mrs. D. Archana)\n" +
            "16. [Mr. S. Gopal](send:Mr. S. Gopal)\n" +
            "17. [Mr. M. Winson](send:Mr. M. Winson)\n\n" +
            "Click on any name to view their full profile! âœ¨"
    },
    { keywords: ['siva rama krishna', 'ai ml faculty'], response: "ðŸ‘¤ **Dr. K. Siva Rama Krishna** is an Associate Professor in CSE (AI & ML). Qualification: Ph.D.\n\n![Dr. K. Siva Rama Krishna](https://aliet.ac.in/storage/120/01K8WVMA7V90D4T9SA49ZF2EQE.png)" },
    { keywords: ['ashok kumar', 'ai ml faculty'], response: "ðŸ‘¤ **Mr. Y. C. Ashok Kumar** is an Associate Professor in CSE (AI & ML). Qualification: M.Tech\n\n![Mr. Y. C. Ashok Kumar](https://aliet.ac.in/storage/126/01K8WVQGNQ9PNCKCNF4128TSF3.png)" },
    { keywords: ['nikhitha', 'ai ml faculty'], response: "ðŸ‘¤ **Mrs. P. Nikhitha** is an Assistant Professor in CSE (AI & ML). Qualification: MS\n\n![Mrs. P. Nikhitha](https://aliet.ac.in/storage/131/01K8WVR5CQ45TFQMQD0BJWK8MT.png)" },
    { keywords: ['rajashekar reddy', 'ai ml faculty'], response: "ðŸ‘¤ **Mr. B Rajashekar Reddy** is an Assistant Professor in CSE (AI & ML). Qualification: M.Tech\n\n![Mr. B Rajashekar Reddy](https://aliet.ac.in/storage/132/01K8WVSXYA1GW3PCYNZPXNGVQA.png)" },
    { keywords: ['reena', 'ai ml faculty'], response: "ðŸ‘¤ **Ms. K. Reena** is an Assistant Professor in CSE (AI & ML). Qualification: M.Tech\n\n![Ms. K. Reena](https://aliet.ac.in/storage/133/01K8WVTGGQPVCCTSNV8Z9FARZ1.png)" },
    { keywords: ['mounika aradhana', 'ai ml faculty'], response: "ðŸ‘¤ **Ms. M. Mounika Aradhana** is an Assistant Professor in CSE (AI & ML). Qualification: M.Tech\n\n![Ms. M. Mounika Aradhana](https://aliet.ac.in/storage/134/01K8WVVA075HPXWSQMF8SK16XW.png)" },
    { keywords: ['munni', 'ai ml faculty'], response: "ðŸ‘¤ **Mrs. V. Munni** is an Assistant Professor in CSE (AI & ML). Qualification: M.Tech\n\n![Mrs. V. Munni](https://aliet.ac.in/storage/109/01K8WVGW6Y0A9HTJYKTZAWMWK9.jpg)" },
    { keywords: ['baig mohammad', 'ai ml faculty'], response: "ðŸ‘¤ **Mr. MD. BAIG MOHAMMAD** is an Assistant Professor in CSE (AI & ML). Qualification: M.Tech" },
    { keywords: ['chinna rao', 'ai ml faculty'], response: "ðŸ‘¤ **Dr. M. CHINNA RAO** is an Associate Professor in CSE (AI & ML). Qualification: Ph.D.\n\n![Dr. M. CHINNA RAO](https://aliet.ac.in/storage/135/01K8WVW3BMMN382E1DN6118YMV.png)" },
    { keywords: ['beulah rani', 'ai ml faculty'], response: "ðŸ‘¤ **Ms. M. BEULAH RANI** is an Assistant Professor in CSE (AI & ML). Qualification: M.Tech\n\n![Ms. M. BEULAH RANI](https://aliet.ac.in/storage/163/01K8WWZTEPRQ27CEK04B076H2C.jpg)" },
    { keywords: ['swathi', 'ai ml faculty'], response: "ðŸ‘¤ **Mrs. B. Swathi** is an Assistant Professor in CSE (AI & ML). Qualification: M.Tech\n\n![Mrs. B. Swathi](https://aliet.ac.in/storage/136/01K8WVWZVYD23V3JNJKBGD5KCK.png)" },
    { keywords: ['jagadish', 'ai ml faculty'], response: "ðŸ‘¤ **Mr. P. Jagadish** is an Assistant Professor in CSE (AI & ML). Qualification: M.Tech\n\n![Mr. P. Jagadish](https://aliet.ac.in/storage/137/01K8WVXMW66QD5CDB90C6YJRJ7.png)" },
    { keywords: ['naga srinivasa rao', 'ai ml faculty'], response: "ðŸ‘¤ **Mr. A. Naga Srinivasa Rao** is an Assistant Professor in CSE (AI & ML). Qualification: M.Tech\n\n![Mr. A. Naga Srinivasa Rao](https://aliet.ac.in/storage/138/01K8WVYMKJHZ48WTQ4Y3D6X7R5.png)" },
    { keywords: ['prabhavathi', 'ai ml faculty'], response: "ðŸ‘¤ **Ms. S. Prabhavathi** is an Assistant Professor in CSE (AI & ML). Qualification: M.Tech\n\n![Ms. S. Prabhavathi](https://aliet.ac.in/storage/143/01K8WVZ65T0ZJ7QVNYYAP3ENW4.png)" },
    { keywords: ['archana', 'ai ml faculty'], response: "ðŸ‘¤ **Mrs. D. Archana** is an Assistant Professor in CSE (AI & ML). Qualification: M.Tech\n\n![Mrs. D. Archana](https://aliet.ac.in/storage/144/01K8WVZQY14FH14VVG8QGT23TX.png)" },
    { keywords: ['gopal', 'ai ml faculty'], response: "ðŸ‘¤ **Mr. S. Gopal** is an Assistant Professor in CSE (AI & ML). Qualification: M.Tech\n\n![Mr. S. Gopal](https://aliet.ac.in/storage/145/01K8WW08XZ7PRCPSZ0HQ5VQF0R.png)" },
    { keywords: ['winson', 'ai ml faculty'], response: "ðŸ‘¤ **Mr. M. Winson** is an Assistant Professor in CSE (AI & ML). Qualification: M.Tech\n\n![Mr. M. Winson](https://aliet.ac.in/storage/146/01K8WW0Y594E60JHDXA05PEN2J.png)" },

    // --- Mechanical ---
    {
        keywords: ['mechanical faculty', 'mechanical department faculty'],
        response: "ðŸ“š **Mechanical Engineering Faculty Members**:\n\n" +
            "1. [Dr. O. Mahesh](send:Dr. O. Mahesh)\n" +
            "2. [Dr. M. Geeta Rani](send:Dr. M. Geeta Rani)\n" +
            "3. [Dr. B. Sudheer Kumar](send:Dr. B. Sudheer Kumar)\n" +
            "4. [Mr. M. Sudhakar](send:Mr. M. Sudhakar)\n" +
            "5. [Mr. Ch. Ranga Rao](send:Mr. Ch. Ranga Rao)\n" +
            "6. [Mrs. B. Susmitha](send:Mrs. B. Susmitha)\n" +
            "7. [Mr. M. Srinivasa Reddy](send:Mr. M. Srinivasa Reddy)\n" +
            "8. [Mr. M. Teja Swarup](send:Mr. M. Teja Swarup)\n" +
            "9. [Dr. G. G. Srinivasu](send:Dr. G. G. Srinivasu)\n" +
            "10. [Mr. E. Durgesh](send:Mr. E. Durgesh)\n" +
            "11. [Dr. T. Subba Reddy](send:Dr. T. Subba Reddy)\n" +
            "12. [Mr. K. Uday Kiran](send:Mr. K. Uday Kiran)\n\n" +
            "Click on any name to view their full profile! âœ¨"
    },
    { keywords: ['mahesh', 'mechanical faculty', 'principal'], response: "ðŸŽ“ **Dr. O. Mahesh** is a Professor in Mechanical Engineering and also the **Principal** of ALIET. Qualification: Ph.D." },
    { keywords: ['geeta rani', 'mechanical faculty', 'hod of mechanical'], response: "ðŸŽ“ **Dr. M. Geeta Rani** is an Associate Professor and HOD in Mechanical Engineering. Qualification: Ph.D.\n\n![Dr. M. Geeta Rani](https://aliet.ac.in/storage/blocks/01K8ZF53KJKDJFN9HA6V63SDAS.PNG)" },
    { keywords: ['sudheer kumar', 'mechanical faculty'], response: "ðŸ‘¤ **Dr. B. Sudheer Kumar** is an Associate Professor in Mechanical Engineering. Qualification: Ph.D." },
    { keywords: ['m. sudhakar', 'mechanical faculty'], response: "ðŸ‘¤ **Mr. M. Sudhakar** is an Associate Professor in the Mechanical department. Qualification: M.Tech" },
    { keywords: ['ranga rao', 'mechanical faculty'], response: "ðŸ‘¤ **Mr. Ch. Ranga Rao** is an Associate Professor in the Mechanical department. Qualification: M.Tech" },
    { keywords: ['susmitha', 'mechanical faculty'], response: "ðŸ‘¤ **Mrs. B. Susmitha** is an Assistant Professor in the Mechanical department. Qualification: M.Tech" },
    { keywords: ['srinivasa reddy', 'mechanical faculty'], response: "ðŸ‘¤ **Mr. M. Srinivasa Reddy** is an Assistant Professor in the Mechanical department. Qualification: M.Tech" },
    { keywords: ['teja swarup', 'mechanical faculty'], response: "ðŸ‘¤ **Mr. M. Teja Swarup** is an Assistant Professor in the Mechanical department. Qualification: M.Tech" },
    { keywords: ['srinivasu', 'mechanical faculty'], response: "ðŸ‘¤ **Dr. G. G. Srinivasu** is an Assistant Professor in the Mechanical department. Qualification: Ph.D." },
    { keywords: ['durgesh', 'mechanical faculty'], response: "ðŸ‘¤ **Mr. E. Durgesh** is an Assistant Professor in the Mechanical department. Qualification: M.Tech" },
    { keywords: ['subba reddy', 'mechanical faculty'], response: "ðŸ‘¤ **Dr. T. Subba Reddy** is an Assistant Professor in the Mechanical department. Qualification: Ph.D.\n\n![Dr. T. Subba Reddy](https://aliet.ac.in/storage/8/01K8W79709NQTGPYBFYNE1CZ5W.jpg)" },
    { keywords: ['uday kiran', 'mechanical faculty'], response: "ðŸ‘¤ **Mr. K. Uday Kiran** is a Faculty Member in the Mechanical department. Qualification: M.Tech" },

    // --- Civil ---
    {
        keywords: ['civil faculty', 'civil department faculty'],
        response: "ðŸ“š **Civil Engineering Faculty Members**:\n\n" +
            "1. [Mrs. A. Tejaswi](send:Mrs. A. Tejaswi)\n" +
            "2. [Mr. Nagaraju Chanumolu](send:Mr. Nagaraju Chanumolu)\n" +
            "3. [Mr. N. Abhilash](send:Mr. N. Abhilash)\n" +
            "4. [Mrs. V. Swathi Padmaja](send:Mrs. V. Swathi Padmaja)\n" +
            "5. [Mr. V. Suryateja](send:Mr. V. Suryateja)\n" +
            "6. [Mr. K. Kiran Kumar](send:Mr. K. Kiran Kumar)\n" +
            "7. [Mr. K. Mallikarjuna Rao](send:Mr. K. Mallikarjuna Rao)\n" +
            "8. [Ms. G. Mahitha](send:Ms. G. Mahitha)\n\n" +
            "Click on any name to view their full profile! âœ¨"
    },
    { keywords: ['tejaswi', 'civil faculty'], response: "ðŸ‘¤ **Mrs. A. Tejaswi** is an Assistant Professor in Civil Engineering. Qualification: M.Tech" },
    { keywords: ['nagaraju', 'civil hod', 'hod of civil'], response: "ðŸŽ“ **Mr. Nagaraju Chanumolu** is the Associate Professor & HOD of Civil Engineering. Qualification: M.Tech\n\n![Mr. Nagaraju Chanumolu](https://aliet.ac.in/storage/blocks/01K99GGNWGA944CTW4WE18YFW9.jpg)" },
    { keywords: ['abhilash', 'civil faculty'], response: "ðŸ‘¤ **Mr. N. Abhilash** is an Assistant Professor in Civil Engineering. Qualification: M.Tech" },
    { keywords: ['swathi padmaja', 'civil faculty'], response: "ðŸ‘¤ **Mrs. V. Swathi Padmaja** is an Assistant Professor in Civil Engineering. Qualification: M.Tech" },
    { keywords: ['suryateja', 'civil faculty'], response: "ðŸ‘¤ **Mr. V. Suryateja** is an Assistant Professor in Civil Engineering. Qualification: M.Tech" },
    { keywords: ['kiran kumar', 'civil faculty'], response: "ðŸ‘¤ **Mr. K. Kiran Kumar** is an Assistant Professor in Civil Engineering. Qualification: M.Tech" },
    { keywords: ['mallikarjuna rao', 'civil faculty'], response: "ðŸ‘¤ **Mr. K. Mallikarjuna Rao** is an Assistant Professor in Civil Engineering. Qualification: M.Tech" },
    { keywords: ['mahitha', 'civil faculty'], response: "ðŸ‘¤ **Ms. G. Mahitha** is an Assistant Professor in Civil Engineering. Qualification: M.Tech" },

    // --- EEE ---
    {
        keywords: ['eee faculty', 'eee department faculty', 'electrical faculty'],
        response: "ðŸ“š **Electrical & Electronics Engineering (EEE) Faculty Members**:\n\n" +
            "1. [Dr. G. Naveen Kumar](send:Dr. G. Naveen Kumar)\n" +
            "2. [Dr. M. Ajay Kumar](send:Dr. M. Ajay Kumar)\n" +
            "3. [Dr. V. Anantha Lakshmi](send:Dr. V. Anantha Lakshmi)\n" +
            "4. [Dr. G. Gantaiah Swamy](send:Dr. G. Gantaiah Swamy)\n" +
            "5. [Mr. L. Karunakar](send:Mr. L. Karunakar)\n" +
            "6. [Mr. T. Krishna Mohan](send:Mr. T. Krishna Mohan)\n" +
            "7. [Mr. M. Rama Krishna](send:Mr. M. Rama Krishna)\n" +
            "8. [Mr. V. Brahmeswara Rao](send:Mr. V. Brahmeswara Rao)\n" +
            "9. [Ms. B. Sruthi](send:Ms. B. Sruthi)\n" +
            "10. [Ms. A. Chandhni Srilakshmi](send:Ms. A. Chandhni Srilakshmi)\n\n" +
            "Click on any name to view their full profile! âœ¨"
    },
    { keywords: ['naveen kumar', 'eee hod', 'hod of eee'], response: "ðŸŽ“ **Dr. G. Naveen Kumar** is the Professor & HOD of Electrical & Electronics Engineering. Qualification: Ph.D.\n\n![Dr. G. Naveen Kumar](https://aliet.ac.in/storage/177/01K8Z0B5EYQQPY7Q89P3KG4X90.jpg)" },
    { keywords: ['ajay kumar', 'eee faculty'], response: "ðŸ‘¤ **Dr. M. Ajay Kumar** is an Associate Professor in EEE. Qualification: Ph.D.\n\n![Dr. M. Ajay Kumar](https://aliet.ac.in/storage/178/01K8Z30ZXATGDKZSEWNQ06X3WB.jpg)" },
    { keywords: ['anantha lakshmi', 'eee faculty'], response: "ðŸ‘¤ **Dr. V. Anantha Lakshmi** is an Assistant Professor in EEE. Qualification: Ph.D.\n\n![Dr. V. Anantha Lakshmi](https://aliet.ac.in/storage/360/01K9CB95GXHER537GW0P0HWDVQ.jpg)" },
    { keywords: ['gantaiah swamy', 'eee faculty'], response: "ðŸ‘¤ **Dr. G. Gantaiah Swamy** is an Assistant Professor in EEE. Qualification: Ph.D.\n\n![Dr. G. Gantaiah Swamy](https://aliet.ac.in/storage/359/01K9CB74RHG2JCZXBM0PZBZKXC.jpg)" },
    { keywords: ['karunakar', 'eee faculty'], response: "ðŸ‘¤ **Mr. L. Karunakar** is an Assistant Professor in EEE. Qualification: M.Tech\n\n![Mr. L. Karunakar](https://aliet.ac.in/storage/356/01K9C7JCZVAM83FM5DVWT4FWJY.jpg)" },
    { keywords: ['krishna mohan', 'eee faculty'], response: "ðŸ‘¤ **Mr. T. Krishna Mohan** is an Assistant Professor in EEE. Qualification: M.Tech\n\n![Mr. T. Krishna Mohan](https://aliet.ac.in/storage/358/01K9C7KQWMVP5E8DSH6WX67DBH.jpg)" },
    { keywords: ['rama krishna', 'eee faculty'], response: "ðŸ‘¤ **Mr. M. Rama Krishna** is an Assistant Professor in EEE. Qualification: M.Tech\n\n![Mr. M. Rama Krishna](https://aliet.ac.in/storage/352/01K9C52JQA1SKR9WKMYF23Z7HR.jpg)" },
    { keywords: ['brahmeswara rao', 'eee faculty'], response: "ðŸ‘¤ **Mr. V. Brahmeswara Rao** is an Assistant Professor in EEE. Qualification: M.Tech" },
    { keywords: ['sruthi', 'eee faculty'], response: "ðŸ‘¤ **Ms. B. Sruthi** is an Assistant Professor in EEE. Qualification: M.Tech\n\n![Ms. B. Sruthi](https://aliet.ac.in/storage/357/01K9C7K3S0Z822BXE4ZVPST4N3.jpg)" },
    { keywords: ['chandhni srilakshmi', 'eee faculty'], response: "ðŸ‘¤ **Ms. A. Chandhni Srilakshmi** is an Assistant Professor in EEE. Qualification: M.Tech\n\n![Ms. A. Chandhni Srilakshmi](https://aliet.ac.in/storage/353/01K9C53SRW9HFGFV10X1QZ6BX4.jpg)" },

    // --- MBA ---
    {
        keywords: ['mba faculty', 'mba department faculty'],
        response: "ðŸ“š **Master of Business Administration (MBA) Faculty Members**:\n\n" +
            "1. [Dr. M. Vijay Kumar](send:Dr. M. Vijay Kumar)\n" +
            "2. [Sk. Razia Begum](send:Sk. Razia Begum)\n" +
            "3. [Dr. G. Lalitha Madhavi](send:Dr. G. Lalitha Madhavi)\n" +
            "4. [Dr. K. Sattibabu](send:Dr. K. Sattibabu)\n" +
            "5. [Dr. B. Shanti](send:Dr. B. Shanti)\n" +
            "6. [Dr. M. Indira](send:Dr. M. Indira)\n\n" +
            "Click on any name to view their full profile! âœ¨"
    },
    { keywords: ['vijay kumar', 'mba hod', 'hod of mba'], response: "ðŸŽ“ **Dr. M. Vijay Kumar** is the Professor & HOD of MBA. Qualification: Ph.D.\n\n![Dr. M. Vijay Kumar](https://aliet.ac.in/storage/345/01K99PZB38NSA9EXHHRNNH4FGH.jpg)" },
    { keywords: ['razia begum', 'mba faculty'], response: "ðŸ‘¤ **Sk. Razia Begum** is an Assistant Professor in MBA. Qualification: MBA, M.Com\n\n![Sk. Razia Begum](https://aliet.ac.in/storage/343/01K99PY7BSR2Y9C0ZCN0SAZF95.jpg)" },
    { keywords: ['lalitha madhavi', 'mba faculty'], response: "ðŸ‘¤ **Dr. G. Lalitha Madhavi** is an Assistant Professor in MBA. Qualification: Ph.D.\n\n![Dr. G. Lalitha Madhavi](https://aliet.ac.in/storage/344/01K99PYMYDRRKN1JMVZT66BGNE.jpg)" },
    { keywords: ['sattibabu', 'mba faculty'], response: "ðŸ‘¤ **Dr. K. Sattibabu** is an Associate Professor in MBA. Qualification: Ph.D.\n\n![Dr. K. Sattibabu](https://aliet.ac.in/storage/533/01KAX8YYXKN6EJE3EDQ46TH6ND.jpg)" },
    { keywords: ['shanti', 'mba faculty'], response: "ðŸ‘¤ **Dr. B. Shanti** is an Assistant Professor in MBA. Qualification: Ph.D.\n\n![Dr. B. Shanti](https://aliet.ac.in/storage/361/01K9CE9E4RF96WGT573SHZSH3N.jpg)" },
    { keywords: ['indira', 'mba faculty'], response: "ðŸ‘¤ **Dr. M. Indira** is an Assistant Professor in MBA. Qualification: Ph.D.\n\n![Dr. M. Indira](https://aliet.ac.in/storage/347/01K99QVP5EM564WS1ES5ASJXGP.jpg)" },

    // --- S&H ---
    {
        keywords: ['s&h faculty', 's&h department faculty', 'science and humanities faculty'],
        response: "ðŸ“š **Science & Humanities (S&H) Faculty Members**:\n\n" +
            "1. [Dr. Y. Sudhakar](send:Dr. Y. Sudhakar)\n" +
            "2. [Ms. S. P. V. N. D. Sumalatha](send:Ms. S. P. V. N. D. Sumalatha)\n" +
            "3. [Dr. V. V. Prabhakar Rao](send:Dr. V. V. Prabhakar Rao)\n" +
            "4. [Dr. P. Sudha Rani](send:Dr. P. Sudha Rani)\n" +
            "5. [Dr. N. DyvaKrupa](send:Dr. N. DyvaKrupa)\n" +
            "6. [Mr. Y. Rajesh](send:Mr. Y. Rajesh)\n" +
            "7. [Mr. B. Ravi Shankar](send:Mr. B. Ravi Shankar)\n" +
            "8. [Mr. P. Sugandha Kumar](send:Mr. P. Sugandha Kumar)\n" +
            "9. [Ms. B. Sarath Kumari](send:Ms. B. Sarath Kumari)\n" +
            "10. [Mrs. K. Swathi Kiran](send:Mrs. K. Swathi Kiran)\n" +
            "11. [Dr. Sr. Candy D'Cunha](send:Dr. Sr. Candy D'Cunha)\n" +
            "12. [Dr. Ch. Vijaya Lakshmi](send:Dr. Ch. Vijaya Lakshmi)\n" +
            "13. [Mrs. E. Kalavathi](send:Mrs. E. Kalavathi)\n" +
            "14. [Mrs. M. Archana](send:Mrs. M. Archana)\n" +
            "15. [Ms. K. Rajya Lakshmi](send:Ms. K. Rajya Lakshmi)\n" +
            "16. [Dr. T. Kalpana](send:Dr. T. Kalpana)\n" +
            "17. [Mrs. S. Saritha](send:Mrs. S. Saritha)\n" +
            "18. [Mrs. B. Sailaja](send:Mrs. B. Sailaja)\n" +
            "19. [Mr. A. Kalyan Kumar](send:Mr. A. Kalyan Kumar)\n" +
            "20. [Mr. T. Sujith](send:Mr. T. Sujith)\n" +
            "21. [Ms. K. Leela Prasanna](send:Ms. K. Leela Prasanna)\n" +
            "22. [Ms. K. Vasantha Lakshmi](send:Ms. K. Vasantha Lakshmi)\n" +
            "23. [Ms. B. Tripura Sri Satvika](send:Ms. B. Tripura Sri Satvika)\n" +
            "24. [Ms. Parimala Jyothi](send:Ms. Parimala Jyothi)\n" +
            "25. [Mrs. M. Vijaya Lakshmi](send:Mrs. M. Vijaya Lakshmi)\n\n" +
            "Click on any name to view their full profile! âœ¨"
    },
    { keywords: ['sudhakar', 's&h hod', 'hod of s&h'], response: "ðŸŽ“ **Dr. Y. Sudhakar** is the Assistant Professor & HOD of Science & Humanities. Qualification: Ph.D.\n\n![Dr. Y. Sudhakar](https://aliet.ac.in/storage/429/01K9VKA818X3JHJR84B2P10TBV.jpg)" },
    { keywords: ['sumalatha', 's&h faculty'], response: "ðŸ‘¤ **Ms. S. P. V. N. D. Sumalatha** is an Assistant Professor in S&H. Qualification: M.Sc" },
    { keywords: ['prabhakar rao', 's&h faculty'], response: "ðŸ‘¤ **Dr. V. V. Prabhakar Rao** is an Assistant Professor in S&H. Qualification: Ph.D.\n\n![Dr. V. V. Prabhakar Rao](https://aliet.ac.in/storage/368/01K9S3F12XFDMBXWHES8CAJK1S.jpg)" },
    { keywords: ['sudha rani', 's&h faculty'], response: "ðŸ‘¤ **Dr. P. Sudha Rani** is an Assistant Professor in S&H. Qualification: Ph.D.\n\n![Dr. P. Sudha Rani](https://aliet.ac.in/storage/339/01K99J536EP7QSWQAB14173FAR.jpg)" },
    { keywords: ['dyvakrupa', 's&h faculty'], response: "ðŸ‘¤ **Dr. N. DyvaKrupa** is an Assistant Professor in S&H. Qualification: Ph.D.\n\n![Dr. N. DyvaKrupa](https://aliet.ac.in/storage/370/01K9S3TBAR0Y37H61GTGS747TJ.jpg)" },
    { keywords: ['rajesh', 'physical director'], response: "ðŸ‘¤ **Mr. Y. Rajesh** is the Physical Director in S&H. Qualification: M.P.Ed" },
    { keywords: ['ravi shankar', 's&h faculty'], response: "ðŸ‘¤ **Mr. B. Ravi Shankar** is an Assistant Professor in S&H. Qualification: M.Sc" },
    { keywords: ['sugandha kumar', 's&h faculty'], response: "ðŸ‘¤ **Mr. P. Sugandha Kumar** is an Assistant Professor in S&H. Qualification: M.Sc\n\n![Mr. P. Sugandha Kumar](https://aliet.ac.in/storage/367/01K9S3CSETCHNSSB7PBTGVT170.jpg)" },
    { keywords: ['sarath kumari', 's&h faculty'], response: "ðŸ‘¤ **Ms. B. Sarath Kumari** is an Assistant Professor in S&H. Qualification: M.Sc\n\n![Ms. B. Sarath Kumari](https://aliet.ac.in/storage/428/01K9VJX0T8V1DECZCE18V6S9G9.jpg)" },
    { keywords: ['swathi kiran', 's&h faculty'], response: "ðŸ‘¤ **Mrs. K. Swathi Kiran** is an Assistant Professor in S&H. Qualification: M.Sc\n\n![Mrs. K. Swathi Kiran](https://aliet.ac.in/storage/427/01K9VJW8MTTD4X6K35PGR02BZP.jpg)" },
    { keywords: ['candy dcunha', 's&h faculty'], response: "ðŸ‘¤ **Dr. Sr. Candy D'Cunha** is an Associate Professor in S&H. Qualification: M.A, M.Phil, Ph.D(DLitt)\n\n![Dr. Sr. Candy D'Cunha](https://aliet.ac.in/storage/369/01K9S3K5KC379SEJ647SHZHZ6T.jpg)" },
    { keywords: ['vijaya lakshmi', 's&h faculty'], response: "ðŸ‘¤ **Dr. Ch. Vijaya Lakshmi** is an Assistant Professor in S&H. Qualification: Ph.D.\n\n![Dr. Ch. Vijaya Lakshmi](https://aliet.ac.in/storage/340/01K99JYHHY9M3J2CVX5A142BT1.jpg)" },
    { keywords: ['kalavathi', 's&h faculty'], response: "ðŸ‘¤ **Mrs. E. Kalavathi** is an Assistant Professor in S&H. Qualification: M.Sc\n\n![Mrs. E. Kalavathi](https://aliet.ac.in/storage/366/01K9S3B4ZCR6Y4AP8DRVX0FBMC.jpg)" },
    { keywords: ['archana', 's&h faculty'], response: "ðŸ‘¤ **Mrs. M. Archana** is an Assistant Professor in S&H. Qualification: M.Sc" },
    { keywords: ['rajya lakshmi', 's&h faculty'], response: "ðŸ‘¤ **Ms. K. Rajya Lakshmi** is an Assistant Professor in S&H. Qualification: M.Sc\n\n![Ms. K. Rajya Lakshmi](https://aliet.ac.in/storage/371/01K9S3WMHD1GE1XHCHZT9KW42A.jpg)" },
    { keywords: ['kalpana', 's&h faculty'], response: "ðŸ‘¤ **Dr. T. Kalpana** is an Assistant Professor in S&H. Qualification: Ph.D.\n\n![Dr. T. Kalpana](https://aliet.ac.in/storage/437/01K9VM8S5ZGWJV48YTMMYM4BE6.jpg)" },
    { keywords: ['saritha', 's&h faculty'], response: "ðŸ‘¤ **Mrs. S. Saritha** is an Assistant Professor in S&H. Qualification: M.Sc\n\n![Mrs. S. Saritha](https://aliet.ac.in/storage/372/01K9S436KKFKHBE8HVJ9BZ53XR.jpg)" },
    { keywords: ['sailaja', 's&h faculty'], response: "ðŸ‘¤ **Mrs. B. Sailaja** is an Assistant Professor in S&H. Qualification: M.Sc" },
    { keywords: ['kalyan kumar', 's&h faculty'], response: "ðŸ‘¤ **Mr. A. Kalyan Kumar** is an Assistant Professor in S&H. Qualification: M.Sc\n\n![Mr. A. Kalyan Kumar](https://aliet.ac.in/storage/430/01K9VKBT4F6BTA8VWF6FYNXB16.jpg)" },
    { keywords: ['sujith', 's&h faculty'], response: "ðŸ‘¤ **Mr. T. Sujith** is an Assistant Professor in S&H. Qualification: M.Sc\n\n![Mr. T. Sujith](https://aliet.ac.in/storage/373/01K9S460AT78JPR33YHFFEEP2Z.jpg)" },
    { keywords: ['leela prasanna', 's&h faculty'], response: "ðŸ‘¤ **Ms. K. Leela Prasanna** is an Assistant Professor in S&H. Qualification: M.Sc\n\n![Ms. K. Leela Prasanna](https://aliet.ac.in/storage/341/01K99KVQ7R0W0C5R8M8GSZ86JP.jpg)" },
    { keywords: ['vasantha lakshmi', 's&h faculty'], response: "ðŸ‘¤ **Ms. K. Vasantha Lakshmi** is an Assistant Professor in S&H. Qualification: M.Sc\n\n![Ms. K. Vasantha Lakshmi](https://aliet.ac.in/storage/342/01K99M5THK6WQC5Y2DM75JC1WT.jpg)" },
    { keywords: ['tripura sri satvika', 's&h faculty'], response: "ðŸ‘¤ **Ms. B. Tripura Sri Satvika** is an Assistant Professor in S&H. Qualification: M.Sc\n\n![Ms. B. Tripura Sri Satvika](https://aliet.ac.in/storage/376/01K9S4JYC25WVP74WV3KMHXZC3.jpg)" },
    { keywords: ['parimala jyothi', 's&h faculty'], response: "ðŸ‘¤ **Ms. Parimala Jyothi** is an Assistant Professor in S&H. Qualification: M.Sc\n\n![Ms. Parimala Jyothi](https://aliet.ac.in/storage/374/01K9S47GV6JPVVBY69T2B02MRX.jpg)" },
    { keywords: ['vijaya lakshmi m', 's&h faculty'], response: "ðŸ‘¤ **Mrs. M. Vijaya Lakshmi** is an Assistant Professor in S&H. Qualification: M.Sc\n\n![Mrs. M. Vijaya Lakshmi](https://aliet.ac.in/storage/375/01K9S4AX5T6MAQSBKJFES66KQE.jpg)" },
    // --- CSE Data Science ---
    {
        keywords: ['CSD faculty', 'cse ds faculty', 'cse data science faculty'],
        response: "ðŸ“š **CSE (Data Science) Faculty Members**:\n\n" +
            "1. [Dr. K. Siva Rama Krishna](send:Dr. K. Siva Rama Krishna)\n" +
            "2. [Mr. Y. C. Ashok Kumar](send:Mr. Y. C. Ashok Kumar)\n" +
            "3. [Mrs. P. Nikhitha](send:Mrs. P. Nikhitha)\n" +
            "4. [Mr. B. Rajashekar Reddy](send:Mr. B. Rajashekar Reddy)\n" +
            "5. [Ms. K. Reena](send:Ms. K. Reena)\n" +
            "6. [Ms. M. Mounika Aradhana](send:Ms. M. Mounika Aradhana)\n" +
            "7. [Mrs. V. Munni](send:Mrs. V. Munni)\n" +
            "8. [Mr. MD. Baig Mohammad](send:Mr. MD. Baig Mohammad)\n" +
            "9. [Dr. M. Chinna Rao](send:Dr. M. Chinna Rao)\n" +
            "10. [Ms. M. Beulah Rani](send:Ms. M. Beulah Rani)\n" +
            "11. [Mrs. B. Swathi](send:Mrs. B. Swathi)\n" +
            "12. [Mr. P. Jagadish](send:Mr. P. Jagadish)\n" +
            "13. [Mr. A. Naga Srinivasa Rao](send:Mr. A. Naga Srinivasa Rao)\n" +
            "14. [Ms. S. Prabhavathi](send:Ms. S. Prabhavathi)\n" +
            "15. [Mrs. D. Archana](send:Mrs. D. Archana)\n" +
            "16. [Mr. S. Gopal](send:Mr. S. Gopal)\n" +
            "17. [Mr. M. Winson](send:Mr. M. Winson)\n\n" +
            "Click on any name to view their full profile! âœ¨"
    },
    { keywords: ['siva rama krishna', 'cse ds faculty'], response: "ðŸ‘¤ **Dr. K. Siva Rama Krishna** is an Associate Professor in CSE (Data Science). Qualification: B.Tech, M.Tech, Ph.D. (PDF)\n\n![Dr. K. Siva Rama Krishna](https://aliet.ac.in/storage/147/01K8WW3RXYJZXFASJPPSCTV4HS.png)" },
    { keywords: ['ashok kumar', 'cse ds faculty'], response: "ðŸ‘¤ **Mr. Y. C. Ashok Kumar** is an Associate Professor in CSE (Data Science). Qualification: M.Tech, (Ph.D)\n\n![Mr. Y. C. Ashok Kumar](https://aliet.ac.in/storage/148/01K8WW48Y2CME0DJMHXSDH0E24.png)" },
    { keywords: ['nikhitha', 'cse ds faculty'], response: "ðŸ‘¤ **Mrs. P. Nikhitha** is an Assistant Professor in CSE (Data Science). Qualification: MS\n\n![Mrs. P. Nikhitha](https://aliet.ac.in/storage/149/01K8WW4PHZBZZN6FJ001R2N6N5.png)" },
    { keywords: ['rajashekar reddy', 'cse ds faculty'], response: "ðŸ‘¤ **Mr. B. Rajashekar Reddy** is an Assistant Professor in CSE (Data Science). Qualification: M.Tech\n\n![Mr. B. Rajashekar Reddy](https://aliet.ac.in/storage/150/01K8WW540Q74V8FQ5P5FZMB6Z3.png)" },
    { keywords: ['reena', 'cse ds faculty'], response: "ðŸ‘¤ **Ms. K. Reena** is an Assistant Professor in CSE (Data Science). Qualification: M.Tech\n\n![Ms. K. Reena](https://aliet.ac.in/storage/151/01K8WW5M3QCW0103ZZ6YVASNZ1.png)" },
    { keywords: ['mounika aradhana', 'cse ds faculty'], response: "ðŸ‘¤ **Ms. M. Mounika Aradhana** is an Assistant Professor in CSE (Data Science). Qualification: M.Tech\n\n![Ms. M. Mounika Aradhana](https://aliet.ac.in/storage/152/01K8WW617H1HB6E50H9H6581M0.png)" },
    { keywords: ['munni', 'cse ds faculty'], response: "ðŸ‘¤ **Mrs. V. Munni** is an Assistant Professor in CSE (Data Science). Qualification: M.Tech\n\n![Mrs. V. Munni](https://aliet.ac.in/storage/153/01K8WW74WFEP2SM0P3DW4MF467.jpg)" },
    { keywords: ['baig mohammad', 'cse ds faculty'], response: "ðŸ‘¤ **Mr. MD. Baig Mohammad** is an Assistant Professor in CSE (Data Science). Qualification: M.Tech" },
    { keywords: ['chinna rao', 'cse ds faculty'], response: "ðŸ‘¤ **Dr. M. Chinna Rao** is an Associate Professor in CSE (Data Science). Qualification: Ph.D.\n\n![Dr. M. Chinna Rao](https://aliet.ac.in/storage/154/01K8WW7YAQ3GMC39SPF0MJ95RT.png)" },
    { keywords: ['beulah rani', 'cse ds faculty'], response: "ðŸ‘¤ **Ms. M. Beulah Rani** is an Assistant Professor in CSE (Data Science). Qualification: M.Tech\n\n![Ms. M. Beulah Rani](https://aliet.ac.in/storage/164/01K8WX1RDZASAHK2NAK4BDT1WP.jpg)" },
    { keywords: ['swathi', 'cse ds faculty'], response: "ðŸ‘¤ **Mrs. B. Swathi** is an Assistant Professor in CSE (Data Science). Qualification: M.Tech\n\n![Mrs. B. Swathi](https://aliet.ac.in/storage/155/01K8WW8NQPCP4GVG7MV5V5K3Y9.png)" },
    { keywords: ['jagadish', 'cse ds faculty'], response: "ðŸ‘¤ **Mr. P. Jagadish** is an Assistant Professor in CSE (Data Science). Qualification: M.Tech\n\n![Mr. P. Jagadish](https://aliet.ac.in/storage/156/01K8WW98H9YTRQ2VD9HWNF7GRQ.png)" },
    { keywords: ['naga srinivasa rao', 'cse ds faculty'], response: "ðŸ‘¤ **Mr. A. Naga Srinivasa Rao** is an Assistant Professor in CSE (Data Science). Qualification: M.Tech\n\n![Mr. A. Naga Srinivasa Rao](https://aliet.ac.in/storage/158/01K8WW9NBG6Y84QY6QH2X8RCTT.png)" },
    { keywords: ['prabhavathi', 'cse ds faculty'], response: "ðŸ‘¤ **Ms. S. Prabhavathi** is an Assistant Professor in CSE (Data Science). Qualification: M.Tech\n\n![Ms. S. Prabhavathi](https://aliet.ac.in/storage/159/01K8WWA4WXN7R1MTWWZ7YDFNKP.png)" },
    { keywords: ['archana', 'cse ds faculty'], response: "ðŸ‘¤ **Mrs. D. Archana** is an Assistant Professor in CSE (Data Science). Qualification: M.Tech\n\n![Mrs. D. Archana](https://aliet.ac.in/storage/160/01K8WWAN1PTQBYJAVX17GZP2WD.png)" },
    { keywords: ['gopal', 'cse ds faculty'], response: "ðŸ‘¤ **Mr. S. Gopal** is an Assistant Professor in CSE (Data Science). Qualification: M.Tech\n\n![Mr. S. Gopal](https://aliet.ac.in/storage/161/01K8WWB538M97H2GNXEXGFE4YT.png)" },
    { keywords: ['winson', 'cse ds faculty'], response: "ðŸ‘¤ **Mr. M. Winson** is an Assistant Professor in CSE (Data Science). Qualification: M.Tech\n\n![Mr. M. Winson](https://aliet.ac.in/storage/162/01K8WWBN9DS8T0MJ3D80MSK2GX.png)" },

    // --- Administration ---
    { keywords: ['director', 'secretary', 'joji reddy'], response: "ðŸŽ“ **Rev. Fr. Dr. B. Joji Reddy S.J** is the Secretary & Director of ALIET. Qualification: Ph.D.\n\n![Rev. Fr. Dr. B. Joji Reddy S.J](https://aliet.ac.in/storage/blocks/01K8D7DZ0AZSD7TWV75WK07MM0.jpg)" },
    { keywords: ['principal', 'controller of examinations', 'mahesh'], response: "ðŸŽ“ **Dr. O. Mahesh** is the Principal of ALIET and the Controller of Examinations. Qualification: Ph.D.\n\n![Dr. O. Mahesh](https://aliet.ac.in/storage/blocks/items/01K9C5SX3NDX2A2KERMB1SX07Z.jpg)" },

    // --- Exam Cell ---
    {
        keywords: ['exam cell', 'examination branch', 'exam cell members'],
        response: "ðŸ“š **ALIET Examination Cell Members**:\n\n" +
            "1. [Dr. O. Mahesh](send:Dr. O. Mahesh)\n" +
            "2. [Rev. Fr. Dr. S. Emmanuel SJ](send:Rev. Fr. Dr. S. Emmanuel SJ)\n" +
            "3. [Mr. Y. C. Ashok Kumar](send:Mr. Y. C. Ashok Kumar)\n" +
            "4. [Mr. ABDUL AZEEM](send:Mr. ABDUL AZEEM)\n\n" +
            "Click on any name to view their role and profile! âœ¨"
    },
    { keywords: ['emmanuel', 'director of examinations'], response: "ðŸ‘¤ **Rev. Fr. Dr. S. Emmanuel SJ** is the Director of Examinations at ALIET. Qualification: Ph.D.\n\n![Rev. Fr. Dr. S. Emmanuel SJ](https://aliet.ac.in/storage/blocks/items/01K9C53DYWPZA8MP46JN4PEF5C.jpg)" },
    { keywords: ['ashok kumar', 'exam cell'], response: "ðŸ‘¤ **Mr. Y. C. Ashok Kumar** is the JNTUK Examination In-charge and Associate Professor in CSE AI&ML. Qualification: M.Tech, (Ph.D)\n\n![Mr. Y. C. Ashok Kumar](https://aliet.ac.in/storage/blocks/items/01K9C599XDES2V40SRR97KD0D3.jpg)" },
    { keywords: ['abdul azeem', 'exam cell'], response: "ðŸ‘¤ **Mr. ABDUL AZEEM** is the Autonomous Examination In-charge and Assistant Professor in ECE. Qualification: M.Tech\n\n![Mr. ABDUL AZEEM](https://aliet.ac.in/storage/blocks/items/01K9C5NTDCD78XKVSMKN7R2C8V.jpg)" },
];
``

---

# File: lib\gemini.ts

``typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the API
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("Missing GEMINI_API_KEY in environment variables");
}

export const genAI = new GoogleGenerativeAI(apiKey || '');

// Default fallback model
export const model = genAI.getGenerativeModel(
    { model: 'gemini-2.5-flash' },
    { apiVersion: 'v1beta' }
);

// Dynamic builder based on requested ID
export const getDynamicModel = (modelId: string) => {
    // Standardize model IDs if necessary
    let id = modelId || 'gemini-2.5-flash';
    
    // If it's a Groq model or doesn't look like Gemini, fallback to flash for Gemini SDK
    if (!id.toLowerCase().includes('gemini') && !id.toLowerCase().includes('text-embedding')) {
        id = 'gemini-2.5-flash';
    }

    if (id === 'gemini-1.5-flash-latest' || id === 'gemini-1.5-flash') id = 'gemini-2.5-flash';
    if (id === 'gemini-1.5-pro-latest' || id === 'gemini-1.5-pro') id = 'gemini-2.5-pro';
    
    return genAI.getGenerativeModel(
        {
            model: id,
            generationConfig: {
                maxOutputTokens: 2048,
                temperature: 0.7,
            }
        },
        { apiVersion: 'v1beta' } // Use v1beta for broader model support including previews
    );
};

export const visionModel = genAI.getGenerativeModel(
    { model: 'gemini-2.5-flash' },
    { apiVersion: 'v1beta' }
);

export const embeddingModel = genAI.getGenerativeModel(
    { model: 'gemini-embedding-001' },
    { apiVersion: 'v1beta' }
);

``

---

# File: lib\groq.ts

``typescript
/**
 * Groq API Utility
 * 
 * Provides high-speed access to Llama 3, Mixtral, and other open-source models via Groq.
 */

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export async function callGroq(messages: any[], modelId: string = 'llama-3.3-70b-versatile') {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
        throw new Error("Missing GROQ_API_KEY. Please add it to your environment variables.");
    }

    // Standardize model IDs for Groq
    let groqModel = modelId;
    if (modelId === 'llama3-70b') groqModel = 'llama-3.3-70b-versatile';
    if (modelId === 'mixtral-8x7b') groqModel = 'mixtral-8x7b-32768';
    if (modelId === 'llama-3-8b') groqModel = 'llama3-8b-8192';

    const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: groqModel,
            messages: messages,
            temperature: 0.7,
            max_tokens: 1024,
            stream: false, // We'll handle streaming differently if needed, but for now flat for simplicity
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`Groq API Error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "";
}

``

---

# File: lib\ollama.ts

``typescript
/**
 * Ollama API Utility
 * 
 * Connects to a local Ollama instance (localhost:11434) for private, zero-cost AI inference.
 */

export async function callOllama(messages: any[], modelId: string = 'llama3') {
    // Strip prefix
    const llmName = modelId.replace('ollama-', '');

    try {
        const response = await fetch('http://localhost:11434/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: llmName,
                messages: messages,
                stream: false,
            }),
        });

        if (!response.ok) {
            throw new Error(`Ollama API Error: Make sure Ollama is running (` + response.statusText + `)`);
        }

        const data = await response.json();
        return data.message?.content || "";
    } catch (e: any) {
        throw new Error(`Failed to connect to local Ollama. Ensure the app is running: ` + e.message);
    }
}

``

---

# File: lib\rules-data.ts

``typescript
import { FACULTY_RULES } from './faculty-rules';

export interface Rule {
    keywords: string[];
    response: string;
}

export const RULES: Rule[] = [
    {
        keywords: ['hi', 'hii', 'hello', 'hey', 'greetings', 'yo', 'hi there'],
        response: "Hello! I'm NextGen AI. How can I assist you today? ðŸš€"
    },
    {
        keywords: ['who are you', 'your name', 'what are you', 'tell me about yourself'],
        response: "I am NextGen AI, a powerful chatbot designed to assist you with reasoning, coding, search, and image generation. ðŸ¤–"
    },
    {
        keywords: ['how are you', 'how s it going', 'how are things'],
        response: "I'm doing great and ready to help! What's on your mind? âœ¨"
    },
    {
        keywords: ['bye', 'goodbye', 'see ya', 'take care'],
        response: "Goodbye! Have a productive day! ðŸ‘‹"
    },
    {
        keywords: ['help', 'commands', 'what can you do', 'menu'],
        response: "I can help you with:\n- ðŸ§  **Complex Reasoning**: Using Pro models.\n- ðŸ’» **Coding**: Writing and debugging scripts.\n- ðŸ” **Web Search**: Real-time information access.\n- ðŸŽ¨ **Image Generation**: Just use the `/image` command!\n- ðŸ“ **File Analysis**: Upload PDFs or text files.\n- ðŸŽ“ **College Info**: I've indexed the ALIET website for you! Just ask about the college, faculty, or admissions."
    },
    {
        keywords: ['contact', 'address', 'phone', 'email', 'location', 'where is the college'],
        response: "ðŸ“ **Address**: ITI Road, ALC Campus, Polytechnic Post Office, Vijayawada - 520 008, Andhra Pradesh, India.\n\nðŸ“ž **Phone**: 0866-2498978 (Office), 0866-2476161 (Director)\n\nðŸ“§ **Email**: alietbza@gmail.com, info@aliet.ac.in"
    },
    {
        keywords: ['vision', 'mission', 'goal', 'objective'],
        response: "ðŸŒŸ **Vision**: Integral formation based on academic excellence, spiritual growth, and value-based leadership.\n\nðŸŽ¯ **Mission**: Providing rigorous academic foundation, equipping students with global skills, and moulding them as compassionate global citizens."
    },
    {
        keywords: ['principal', 'who is the principal', 'mahesh'],
        response: "ðŸŽ“ **Principal**: Dr. O. Mahesh\n\nHe lead ALIET with a focus on 'Academic Excellence with Integral Formation'. Under his leadership, the college achieved NAAC A+ (3.33 CGPA) and NBA accreditation. ðŸ†\n\n![Dr. O. Mahesh](https://aliet.ac.in/storage/blocks/01KA7ZR9JFP4NTFJJ9WY63HNQ0.jpg)"
    },
    {
        keywords: ['departments', 'courses', 'branches', 'list of depts'],
        response: "ðŸ“š **Departments at ALIET**:\n1. Civil Engineering\n2. Computer Science & Engineering\n3. CSE (AI & ML)\n4. CSE (Data Science)\n5. Electrical & Electronics Engineering\n6. Electronics & Communication Engineering\n7. Information Technology\n8. Mechanical Engineering\n9. MBA\n10. Science & Humanities"
    },
    {
        keywords: ['admission', 'apply', 'join', 'seat'],
        response: "ðŸ“ For **Admissions**, you can contact the College Office at **0866-2498978**. The process is overseen by the Director and Principal to ensure academic merit and quality intake. ðŸ¤"
    },
    ...FACULTY_RULES
];

``

---

# File: lib\rules.ts

``typescript
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
    if (aiIntents.some(intent => cleanMessage.includes(intent))) {
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
                    return `ðŸŒ¤ï¸ **Current Weather**:\n${weatherText.trim()}\n\n_Fetched instantly via Rules Engine_`;
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
            return `Today's date is **${now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}**. ðŸ“…`;
        }
        if (words.has('time')) {
            return `The current time is **${now.toLocaleTimeString()}**. ðŸ•’`;
        }
    }

    if (cleanMessage === 'date' || cleanMessage === 'time') {
        return cleanMessage === 'date'
            ? `Today's date is **${now.toLocaleDateString()}**. ðŸ“…`
            : `The current time is **${now.toLocaleTimeString()}**. ðŸ•’`;
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

``

---

# File: lib\utils.ts

``typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getFriendlyErrorMessage(error: any): string {
    const msg = error?.message || String(error);

    if (msg.includes('503')) {
        return "I'm receiving a lot of messages right now. Please give me a moment to catch up!";
    } else if (msg.includes('429')) {
        return "Whoa, that's fast! Let me finish my thought first.";
    } else if (msg.includes('API Key') || msg.includes('403') || msg.includes('unregistered callers')) {
        return "I'm having trouble connecting to my creative engine. Please try again later.";
    } else if (msg.includes('500')) {
        return "Oops, something went wrong on my end. Let's try that again.";
    } else if (msg.includes('Failed to fetch') || msg.includes('Network request failed')) {
        return "I can't seem to reach the internet. Please check your connection.";
    }


    return 'Something went wrong. Please try again later.';
}

export function vibrate(pattern: number | number[] = 10) {
    if (typeof window !== 'undefined' && navigator.vibrate) {
        try {
            navigator.vibrate(pattern);
        } catch (e) {
            // Ignore vibration errors
        }
    }
}

``

---

# File: lib\vector-store.ts

``typescript

import { createAdminClient } from './supabase/admin';
import { embeddingModel } from './gemini';

export interface Document {
    id?: number;
    user_id?: string;
    content: string;
    metadata: Record<string, any>;
    similarity?: number;
}

/**
 * Generates an embedding for the given text using Gemini's text-embedding-004 model.
 * Includes exponential backoff to handle rate limits (429).
 */
export async function embedText(text: string, retries = 3, delay = 1000): Promise<number[]> {
    try {
        const result = await embeddingModel.embedContent({
            content: { role: 'user', parts: [{ text }] },
            taskType: 'RETRIEVAL_DOCUMENT' as any,
            outputDimensionality: 768
        } as any);
        const embedding = result.embedding;
        return embedding.values;
    } catch (error: any) {
        // If rate limited and we have retries left
        if (error?.status === 429 && retries > 0) {
            console.warn(`[VectorStore] Rate limited. Retrying in ${delay}ms... (${retries} retries left)`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return embedText(text, retries - 1, delay * 2);
        }
        
        console.error("Error generating embedding:", error);
        throw error;
    }
}

/**
 * Adds a document to the vector store.
 * Generates an embedding for the content and stores it in the 'documents' table.
 */
export async function addDocument(content: string, metadata: Record<string, any> = {}, userId?: string): Promise<Document | null> {
    try {
        const supabase = createAdminClient();
        const embedding = await embedText(content);

        const { data, error } = await supabase
            .from('documents')
            .insert({
                content,
                metadata,
                embedding,
                user_id: userId
            })
            .select()
            .single();

        if (error) {
            console.error("Error inserting document:", error);
            throw error;
        }

        return data;
    } catch (error) {
        console.error("Failed to add document:", error);
        return null;
    }
}

/**
 * Searches for documents similar to the query string.
 * Uses the 'match_documents' RPC function in Supabase.
 */
export async function searchDocuments(
    query: string, 
    matchCount: number = 5, 
    threshold: number = 0.5,
    conversationId?: string, 
    userId?: string
): Promise<Document[]> {
    try {
        const supabase = createAdminClient();
        const queryEmbedding = await embedText(query);

        const { data: documents, error } = await supabase.rpc('match_documents', {
            query_embedding: queryEmbedding,
            match_threshold: threshold,
            match_count: matchCount,
            filter_conversation_id: conversationId || null,
            filter_user_id: userId || null
        });

        if (error) {
            console.error("Error searching documents:", error);
            throw new Error(`Supabase Search Error: ${error.message}`);
        }

        return documents || [];
    } catch (error: any) {
        console.error("Failed to search documents:", error);
        throw error; // Re-throw to be caught by the tool execution
    }
}

``

---

# File: lib\website-crawler.ts

``typescript

import * as cheerio from 'cheerio';
import axios from 'axios';
import { addDocument } from './vector-store';

interface CrawlOptions {
    maxDepth?: number;
    maxPages?: number;
    urlFilter?: (url: string) => boolean;
}

interface CrawlerSection {
    title: string;
    paragraphs: string[];
    images: { url: string; alt: string }[];
}

export class WebsiteCrawler {
    private visitedUrls = new Set<string>();
    private queue: { url: string; depth: number }[] = [];
    private baseDomain: string = '';

    constructor(private options: CrawlOptions = {}) {}

    async crawl(startUrl: string) {
        this.baseDomain = new URL(startUrl).hostname;
        this.queue.push({ url: startUrl, depth: 0 });

        const maxPages = this.options.maxPages || 500;
        const maxDepth = this.options.maxDepth || 5;

        console.log(`Starting crawl of ${startUrl} (Max Pages: ${maxPages}, Max Depth: ${maxDepth})`);

        while (this.queue.length > 0 && this.visitedUrls.size < maxPages) {
            const { url, depth } = this.queue.shift()!;

            if (this.visitedUrls.has(url) || depth > maxDepth) continue;

            this.visitedUrls.add(url);
            console.log(`[${this.visitedUrls.size}/${maxPages}] Crawling: ${url} at depth ${depth}`);

            try {
                const { sections, links } = await this.processPage(url);
                
                for (const section of sections) {
                    if (section.content.length > 100) {
                        await addDocument(section.content, { 
                            url, 
                            source: 'website_crawl', 
                            crawled_at: new Date().toISOString(),
                            images: section.images
                        });
                        // Throttling: Wait 1 second between documents to avoid 429 errors
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                }
                
                console.log(`  -> Added ${sections.length} sections to vector store`);

                // Add new links to queue with prioritization
                for (const link of links) {
                    if (this.shouldCrawl(link)) {
                        // Prioritize department/faculty/hod links by adding them to the front of the queue
                        const lowerLink = link.toLowerCase();
                        const isPriorityLink = /department|faculty|hod|staff|academics|administration/.test(lowerLink);
                        
                        if (isPriorityLink) {
                            this.queue.unshift({ url: link, depth: depth + 1 });
                        } else {
                            this.queue.push({ url: link, depth: depth + 1 });
                        }
                    }
                }
            } catch (error: any) {
                console.error(`  -> Failed to crawl ${url}:`, error.message);
            }
        }

        console.log(`Crawl complete. Total pages indexed: ${this.visitedUrls.size}`);
    }

    public async processPage(url: string) {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            },
            timeout: 15000,
        });

        const html = response.data;
        const $ = cheerio.load(html);
        const pageTitle = $('title').text().replace(/\s+/g, ' ').trim() || 'ALIET';
        const links: string[] = [];

        // Extract Links
        $('a[href]').each((_, el) => {
            const href = $(el).attr('href');
            if (href) {
                try {
                    const absoluteUrl = new URL(href, url).href.split('#')[0];
                    links.push(absoluteUrl);
                } catch (e) {}
            }
        });

        // Remove noise once for the whole page
        $('script, style, nav, footer, iframe, ads, noscript, .sidebar, .menu, .modal, .header, .footer, .nav-container, .breadcrumbs').remove();

        const sections: { content: string; images: { url: string; alt: string }[] }[] = [];
        const seenContent = new Set<string>();

        // 1. Hidden Modal Extraction (Keep this as it's specialized for faculty lists)
        $('button[onclick*="openFacultyModal"]').each((_, el) => {
            const onclick = $(el).attr('onclick') || '';
            const match = onclick.match(/openFacultyModal\((.*)\)/);
            if (match && match[1]) {
                try {
                    const rawData = match[1].trim();
                    const name = (rawData.match(/name:\s*['"](.*?)['"]/) || [])[1] || '';
                    const designation = (rawData.match(/designation:\s*['"](.*?)['"]/) || [])[1] || '';
                    const qualification = (rawData.match(/qualification:\s*['"](.*?)['"]/) || [])[1] || '';
                    const bio = (rawData.match(/bio:\s*['"](.*?)['"]/) || [])[1] || '';
                    const avatar = (rawData.match(/avatar:\s*['"](.*?)['"]/) || [])[1] || '';

                    if (name || bio) {
                        const modalContent = `[${pageTitle}] Faculty Profile: ${name}\nDesignation: ${designation}\nQualification: ${qualification}\nBio: ${bio}`;
                        const images: { url: string; alt: string }[] = [];
                        
                        if (avatar && avatar.length > 5) {
                            try {
                                const absoluteAvatarUrl = new URL(avatar, url).href;
                                images.push({ url: absoluteAvatarUrl, alt: `${name} Profile Photo` });
                            } catch (e) {}
                        }

                        if (!seenContent.has(modalContent)) {
                            sections.push({ content: modalContent, images });
                            seenContent.add(modalContent);
                        }
                    }
                } catch (e) {}
            }
        });

        // 2. Semantic Selection based on Headers (Proximity Chunking)
        const $main = $('main').length > 0 ? $('main') : $('#content').length > 0 ? $('#content') : $('.content').length > 0 ? $('.content') : $('body');
        
        let currentSection: CrawlerSection | null = null;
        const elements = $main.find('h1, h2, h3, h4, h5, h6, p, img, li, .faculty-member, .card').toArray();

        for (const el of elements) {
            const $el = $(el);
            const tagName = el.tagName.toLowerCase();

            if (/^h[1-6]$/.test(tagName)) {
                const headerText = $el.text().replace(/\s+/g, ' ').trim();
                const isPersonnelHeader = /hod|head of department|principal|director|secretary|chairman|dean|professor|faculty/i.test(headerText);

                // New header starts a new section
                if (currentSection && currentSection.paragraphs.length > 0) {
                    const content = `[${pageTitle}] ${currentSection.title}\n${currentSection.paragraphs.join(' ')}`.trim();
                    if (content.length > 50 && !seenContent.has(content)) {
                        sections.push({ content, images: currentSection.images });
                        seenContent.add(content);
                    }
                }
                currentSection = {
                    title: headerText,
                    paragraphs: [],
                    images: []
                };
                
                if (isPersonnelHeader && headerText.length < 100) {
                    currentSection.paragraphs.push(`Role/Focus: ${headerText}`);
                }
            } else if (tagName === 'p' || tagName === 'li') {
                const text = $el.text().replace(/\s+/g, ' ').trim();
                if (text.length > 20) {
                    if (!currentSection) {
                        currentSection = { title: '', paragraphs: [], images: [] };
                    }
                    currentSection.paragraphs.push(text);
                }
            } else if (tagName === 'img') {
                const src = $el.attr('src');
                const alt = ($el.attr('alt') || $el.attr('title') || '').trim();
                
                if (src && this.isValidImage(src, alt)) {
                    try {
                        const absoluteImgUrl = new URL(src, url).href;
                        if (currentSection) {
                            currentSection.images.push({ url: absoluteImgUrl, alt: alt || 'Relevant Image' });
                        }
                    } catch (e) {}
                }
            } else if ($el.hasClass('faculty-member') || $el.hasClass('card')) {
                const text = $el.text().replace(/\s+/g, ' ').trim();
                const content = `[${pageTitle}] ${text}`;
                if (text.length > 100 && !seenContent.has(content)) {
                    const images = this.extractImagesFromElement($, $el, url);
                    sections.push({ content, images });
                    seenContent.add(content);
                }
            }
        }

        // Push final section
        if (currentSection && currentSection.paragraphs.length > 0) {
            const content = `[${pageTitle}] ${currentSection.title}\n${currentSection.paragraphs.join(' ')}`.trim();
            if (content.length > 50 && !seenContent.has(content)) {
                sections.push({ content, images: currentSection.images });
                seenContent.add(content);
            }
        }

        // 3. Fallback: If still nothing, handle as one block
        if (sections.length === 0) {
            const rawContent = $main.text().replace(/\s+/g, ' ').trim();
            if (rawContent.length > 50) {
                const content = `[${pageTitle}] ${rawContent}`;
                const images = this.extractImagesFromElement($, $main, url);
                sections.push({ content, images });
            }
        }

        // 4. Special Table Extraction for Faculty
        $('table').each((_, table) => {
            const $table = $(table);
            const headers: string[] = [];
            $table.find('th').each((_, th) => { headers.push($(th).text().trim().toLowerCase()); });
            
            if (headers.includes('name') || headers.includes('faculty') || headers.includes('designation')) {
                $table.find('tr').each((_, tr) => {
                    const $tr = $(tr);
                    const cells = $tr.find('td').toArray();
                    if (cells.length >= 2) {
                        const rowData = cells.map(c => $(c).text().trim()).join(' | ');
                        const content = `[${pageTitle}] Faculty Entry: ${rowData}`;
                        const images = this.extractImagesFromElement($, $tr, url);
                        if (!seenContent.has(content)) {
                            sections.push({ content, images });
                            seenContent.add(content);
                        }
                    }
                });
            }
        });

        return { sections, links };
    }

    private isValidImage(src: string, alt: string): boolean {
        if (!src || src.length > 500) return false;
        const lowerSrc = src.toLowerCase();
        const lowerAlt = alt.toLowerCase();
        const noise = ['logo', 'favicon', 'icon', 'banner', 'header', 'footer', 'bg', 'spacer', 'arrow', 'social'];
        const isNoise = noise.some(n => lowerSrc.includes(n) || lowerAlt.includes(n));
        const priority = ['principal', 'director', 'hod', 'faculty', 'member', 'secretary', 'chairman', 'dean'];
        const isPriority = priority.some(p => lowerAlt.includes(p));
        if (isNoise && !isPriority) return false;
        const isSlider = lowerSrc.includes('/storage/slides/') || lowerSrc.includes('/storage/banners/') || lowerSrc.includes('slider');
        if (isSlider && !isPriority) return false;
        return true;
    }

    public extractImagesFromElement($: cheerio.CheerioAPI, $el: cheerio.Cheerio<any>, baseUrl: string) {
        const images: { url: string; alt: string }[] = [];
        $el.find('img[src]').each((_, img) => {
            const src = $(img).attr('src');
            const alt = ($(img).attr('alt') || $(img).attr('title') || '').trim();
            if (src && this.isValidImage(src, alt)) {
                try {
                    const absoluteImgUrl = new URL(src, baseUrl).href;
                    images.push({ url: absoluteImgUrl, alt: alt || 'Relevant Image' });
                } catch (e) {}
            }
        });
        return images.slice(0, 10);
    }

    public shouldCrawl(url: string): boolean {
        try {
            const parsedUrl = new URL(url);
            if (parsedUrl.hostname !== this.baseDomain) return false;
            const ext = url.split('.').pop()?.toLowerCase();
            const blacklistedExts = ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'zip', 'gz', 'mp4', 'mp3'];
            if (ext && blacklistedExts.includes(ext)) return false;
            return !this.visitedUrls.has(url);
        } catch (e) {
            return false;
        }
    }
}

``

---

# File: lib\agent\registry.ts

``typescript
import { z } from 'zod';
import * as cheerio from 'cheerio';
import * as vectorStore from '../vector-store';
import { createAdminClient } from '../supabase/admin';
import { FACULTY_RULES } from '../faculty-rules';
import Fuse from 'fuse.js';

export interface Tool {
    name: string;
    description: string;
    parameters: z.ZodObject<any>;
    execute: (args: any, context?: { userId?: string }) => Promise<any>;
}

export const toolRegistry: Record<string, Tool> = {};

export function registerTool(tool: Tool) {
    toolRegistry[tool.name] = tool;
}

// --- Standard Tools ---

// 1. Calculator (Demo for computation)
registerTool({
    name: 'calculate',
    description: 'Perform a mathematical calculation. Use this for precise math.',
    parameters: z.object({
        expression: z.string().describe('The mathematical expression to evaluate, e.g., "2 * 45 + 10"'),
    }),
    execute: async ({ expression }) => {
        // Safety: In a real app, use a safer math parser like mathjs. 
        // For this demo, we'll keep it simple but restricted.
        try {
            // Basic sanitization
            if (/[^0-9+\-*/(). ]/.test(expression)) {
                return "Error: Invalid characters in expression.";
            }

            const result = eval(expression);
            return { result };
        } catch (e) {
            return { error: 'Failed to evaluate expression' };
        }
    },
});

// 2. Generate Image
registerTool({
    name: 'generate_image',
    description: 'Generate an image based on a text prompt.',
    parameters: z.object({
        prompt: z.string().describe('The detailed visual description of the image to generate'),
    }),
    execute: async ({ prompt }) => {
        // Enhance prompt for realism
        const enhancedPrompt = `${prompt}, photorealistic, 4k, highly detailed, cinematic lighting, hd, raw photo`;
        const encodedPrompt = encodeURIComponent(enhancedPrompt);
        const seed = Math.floor(Math.random() * 1000000);
        const apiKey = 'sk_mEWxPjZizTEUPa1FsEFasSWkowb0Yzlt';
        const keyParam = `&key=${apiKey}`;
        // Use flux-realism model for better results
        const imageUrl = `https://gen.pollinations.ai/image/${encodedPrompt}?width=1024&height=1024&seed=${seed}&model=flux-realism&nologo=true${keyParam}`;
        console.log("Generated Image URL:", imageUrl);
        return { imageUrl, info: "Image generated successfully. Embed this URL in markdown." };
    },
});

// 3. Web Search (Wikipedia implementation)
registerTool({
    name: 'web_search',
    description: 'Search Wikipedia for reliable information. Use this to find news, facts, and general info.',
    parameters: z.object({
        query: z.string().describe('The search query'),
    }),
    execute: async ({ query }) => {
        try {
            const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&utf8=&format=json&origin=*`;
            const response = await fetch(searchUrl);

            if (!response.ok) {
                return { error: `Search failed with status ${response.status}` };
            }

            const data = await response.json();
            const results = data.query?.search?.map((r: any) => ({
                title: r.title,
                url: `https://en.wikipedia.org/wiki/${encodeURIComponent(r.title.replace(/ /g, '_'))}`,
                snippet: r.snippet.replace(/<\/?[^>]+(>|$)/g, "") // Strip HTML
            })) || [];

            return { results: results.length > 0 ? results.slice(0, 5) : "No results found." };
        } catch (error: any) {
            console.error("Web search error:", error);
            return { error: "Failed to perform web search." };
        }
    },
});

// --- NEW TOOLS ---

// 4. Web Page Scraper
registerTool({
    name: 'read_page',
    description: 'Fetch and read the text content of a specific web page URL. Use this when the user provides a link and asks for a summary or specific info from it.',
    parameters: z.object({
        url: z.string().url().describe('The full URL of the web page to read'),
    }),
    execute: async ({ url }) => {
        try {
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                },
            });

            if (!response.ok) {
                return { error: `Failed to fetch page: ${response.status} ${response.statusText}` };
            }

            const html = await response.text();
            const $ = cheerio.load(html);

            // Remove noise
            $('script, style, nav, footer, iframe, ads').remove();

            // Extract main content
            const title = $('title').text().trim();
            const content = $('body').text().replace(/\s+/g, ' ').trim().substring(0, 10000); // Limit to 10k chars

            return { title, content, info: "Content extracted. Summary is recommended." };
        } catch (error: any) {
            console.error("Scraper error:", error);
            return { error: "Failed to scrape the page. It might be blocked or require JS." };
        }
    },
});

// 5. Weather Tool
registerTool({
    name: 'get_weather',
    description: 'Get real-time weather information for a specific location.',
    parameters: z.object({
        location: z.string().describe('The name of the city/location, e.g., "London" or "San Francisco"'),
    }),
    execute: async ({ location }) => {
        try {
            // Using wttr.in for a simple, non-API-key required weather source
            const weatherUrl = `https://wttr.in/${encodeURIComponent(location)}?format=j1`;
            const response = await fetch(weatherUrl);

            if (!response.ok) {
                return { error: "Weather service unavailable." };
            }

            const data = await response.json();
            const current = data.current_condition[0];
            const nearestArea = data.nearest_area[0];

            return {
                location: `${nearestArea.areaName[0].value}, ${nearestArea.country[0].value}`,
                temp_C: current.temp_C,
                condition: current.weatherDesc[0].value,
                humidity: current.humidity,
                wind_speed: current.windspeedKmph,
            };
        } catch (error) {
            console.error("Weather error:", error);
            return { error: "Failed to fetch weather data for this location." };
        }
    },
});

// 6. Search Images (Wikimedia Commons implementation)
registerTool({
    name: 'search_images',
    description: 'Search for existing images on the web. Use this when the user asks to "find" or "search for" photos/images rather than generating them.',
    parameters: z.object({
        query: z.string().describe('The image search query'),
    }),
    execute: async ({ query }, context) => {
        try {
            const imageUrls: string[] = [];
            const lowerQuery = query.toLowerCase();
            const isCollegeQuery = /aliet|loyola|principal|director|mahesh|joji|college|department/i.test(lowerQuery);

            // 1. Search Internal Knowledge base first if related to college
            if (isCollegeQuery) {
                try {
                    // Lower threshold (0.3) for images to be more forgiving with specific queries
                    const docs = await vectorStore.searchDocuments(query, 5, 0.3, undefined, context?.userId);
                    for (const doc of docs) {
                        if (doc.metadata?.images && Array.isArray(doc.metadata.images)) {
                            doc.metadata.images.forEach((img: any) => {
                                if (img.url && !imageUrls.includes(img.url)) {
                                    imageUrls.push(img.url);
                                }
                            });
                        }
                    }
                } catch (e) {
                    console.error("Internal image search error:", e);
                }
            }

            // 2. Search Wikimedia Commons for general images (ONLY if NOT a college query)
            if (!isCollegeQuery) {
                try {
                    const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent('filetype:bitmap ' + query)}&gsrnamespace=6&gsrlimit=5&prop=imageinfo&iiprop=url&format=json&origin=*`;
                    const response = await fetch(searchUrl);
                    if (response.ok) {
                        const data = await response.json();
                        const pages = data.query?.pages;
                        if (pages) {
                            for (const id in pages) {
                                if (pages[id].imageinfo?.[0]?.url) {
                                    const url = pages[id].imageinfo[0].url;
                                    if (!imageUrls.includes(url)) imageUrls.push(url);
                                }
                            }
                        }
                    }
                } catch (e) {
                    console.error("Wikimedia search error:", e);
                }
            }

            return { images: imageUrls.length > 0 ? imageUrls.slice(0, 10) : "No images found." };
        } catch (error: any) {
            console.error("Image search error:", error);
            return { error: "Failed to search images." };
        }
    },
});

// 6.5 Search Faculty (Structured Database)
registerTool({
    name: 'search_faculty',
    description: 'Search for structured information about ALIET faculty, HODs, and staff. Returns names, designations, qualifications, and profile photos. Use this specifically when asking "Who is...", "List faculty for...", or "HOD of...".',
    parameters: z.object({
        query: z.string().describe('The person name or department to search for (e.g., "CSE" or "Dr. Mahesh")'),
    }),
    execute: async ({ query }) => {
        try {
            const supabase = createAdminClient();
            
            // 1. Try Structured Database (Supabase)
            const { data, error } = await supabase
                .from('faculty')
                .select('*')
                .or(`name.ilike.%${query}%,department.ilike.%${query}%,designation.ilike.%${query}%`)
                .order('is_hod', { ascending: false })
                .limit(10);

            if (!error && data && data.length > 0) {
                const results = data.map((f: any) => {
                    let info = `### ${f.name} (${f.designation})\n`;
                    info += `- Department: ${f.department}\n`;
                    if (f.qualification) info += `- Qualification: ${f.qualification}\n`;
                    if (f.image_url) info += `![${f.name} Profile Photo](${f.image_url})`;
                    return info;
                }).join('\n\n---\n\n');

                return { result: `[FOUND IN STRUCTURED DATABASE]\n\n${results}` };
            }

            // 2. Fallback to Static Rules (Hardcoded) if Database returns nothing or errors
            console.log(`[SearchFaculty] No results in database for "${query}", falling back to static rules...`);
            
            const fuse = new Fuse(FACULTY_RULES, {
                keys: ['keywords'],
                threshold: 0.4,
            });

            const staticResults = fuse.search(query);
            if (staticResults.length > 0) {
                const formatted = staticResults.slice(0, 3).map(r => {
                    return `[FOUND IN STATIC RULES: ${r.item.keywords.join(', ')}]\n${r.item.response}`;
                }).join('\n\n---\n\n');

                return { result: formatted };
            }

            return { result: "No faculty records found in either database or static records. Try search_knowledge for general info." };
        } catch (error: any) {
            console.error("Faculty search error:", error);
            return { error: "Failed to search faculty database." };
        }
    },
});

// 6.7 Search Faculty Static (Hardcoded Rules) - DEPRECATED: Consistently integrated into search_faculty
/*
registerTool({
    name: 'search_faculty_static',
...
});
*/

// 9. Web Search (DuckDuckGo implementation)
registerTool({
    name: 'duckduckgo_search',
    description: 'Search the web using DuckDuckGo for general real-time information, news, and facts.',
    parameters: z.object({
        query: z.string().describe('The search query'),
    }),
    execute: async ({ query }) => {
        try {
            const searchUrl = "https://html.duckduckgo.com/html/";
            const body = new URLSearchParams();
            body.append('q', query);

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

            const response = await fetch(searchUrl, {
                method: 'POST',
                body: body,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (!response.ok) {
                return { error: `Search failed with status ${response.status}` };
            }

            const html = await response.text();
            const $ = cheerio.load(html);
            const results: any[] = [];

            // HTML DuckDuckGo structure parsing
            const links = $('.result__a');
            links.each((i, element) => {
                if (results.length >= 5) return;

                const title = $(element).text().trim();
                const url = $(element).attr('href');
                const snippet = $(element).closest('.result').find('.result__snippet').text().trim();

                if (title && url && snippet) {
                    results.push({ title, url, snippet });
                }
            });

            return { results: results.length > 0 ? results : "No results found." };
        } catch (error: any) {
            console.error("DuckDuckGo search error:", error);
            return { error: "Failed to perform DuckDuckGo search." };
        }
    },
});

// 7. Search Knowledge (RAG)
registerTool({
    name: 'search_knowledge',
    description: 'Search the internal knowledge base for general information about ALIET. For specific questions about PEOPLE, HODs, or STAFF, use `search_faculty` first for better accuracy.',
    parameters: z.object({
        query: z.string().describe('The search query for the knowledge base'),
    }),
    execute: async ({ query }, context) => {
        try {
            let expandedQuery = query;
            if (query.toLowerCase().includes('hod')) {
                expandedQuery += ' Head of Department';
            }
            
            // using top-level import
            // Lower threshold (0.3) for more flexible matching
            const documents = await vectorStore.searchDocuments(expandedQuery, 5, 0.3, undefined, context?.userId);
            if (documents.length === 0) {
                return { result: "No relevant documents found in the knowledge base." };
            }
            // Format results for the LLM
            const result = documents.map((doc: any) => {
                const truncatedContent = doc.content.substring(0, 3000);
                let docText = `### [ID: ${doc.id}] SOURCE: ${doc.metadata?.url || 'Internal'}\n${truncatedContent}`;
                
                if (doc.metadata?.images && Array.isArray(doc.metadata.images)) {
                    // Score images based on query keywords
                    const queryWords = query.toLowerCase().split(/\s+/);
                    const scoredImages = doc.metadata.images.map((img: any) => {
                        const alt = (img.alt || '').toLowerCase();
                        const url = (img.url || '').toLowerCase();
                        let score = 0;
                        
                        queryWords.forEach((word: string) => {
                            if (word.length > 3 && (alt.includes(word) || url.includes(word))) score += 3;
                        });
                        
                        if (alt.includes('profile') || alt.includes('photo') || alt.includes('faculty')) score += 2;
                        
                        // Noise check: slides/banners often cause "Failed to load" or are irrelevant
                        const isNoise = alt.includes('slide') || alt.includes('banner') || alt.includes('event') || alt.includes('workshop') || url.includes('/slides/') || url.includes('/banners/');
                        
                        // If it's noise and doesn't have a strong query match, heavily penalize it
                        if (isNoise && score < 3) score -= 10;
                        
                        return { ...img, score };
                    }).filter((img: any) => img.score > -5)
                    .sort((a: any, b: any) => b.score - a.score);

                    // Only pass top 5 images to save tokens, prioritized by relevance
                    const imageList = scoredImages.slice(0, 5).map((img: any) => {
                        const relevance = img.score >= 3 ? " [High Relevance]" : "";
                        return `![${img.alt}${relevance}](${img.url})`;
                    }).join('\n');
                    
                    if (imageList) {
                        docText += `\n\n--- IMAGES FOR THIS SECTION ---\n${imageList}\n------------------------------`;
                    }
                }
                return docText;
            }).join('\n\n---\n\n');
            return { result };
        } catch (error: any) {
            console.error("Knowledge search error:", error);
            return { result: `Error accessing knowledge base: ${error.message || String(error)}. Please check administrative logs or environment configuration.` };
        }
    },
});

// 8. Learn Knowledge (Add to RAG)
registerTool({
    name: 'learn_knowledge',
    description: 'Add new information to the knowledge base. Use this when the user explicitly teaches you something or asks you to remember something.',
    parameters: z.object({
        content: z.string().describe('The content to store in the knowledge base'),
        topic: z.string().optional().describe('Optional topic or category metadata'),
    }),
    execute: async ({ content, topic }, context) => {
        try {
            // using top-level import
            const metadata = topic ? { topic } : {};
            const doc = await vectorStore.addDocument(content, metadata, context?.userId);
            if (doc) {
                return { result: `Successfully added information to knowledge base (ID: ${doc.id}).` };
            }
            return { error: "Failed to add information." };
        } catch (error: any) {
            console.error("Learn knowledge error:", error);
            return { error: "Failed to add to knowledge base." };
        }
    },
});

export function getToolDefinitions() {
    return Object.values(toolRegistry).map(tool => ({
        name: tool.name,
        description: tool.description,
        // parameters would be converted to JSON Schema here for the LLM
        // Simplified for this architecture step
        parameters: tool.parameters,
    }));
}

``

---

# File: lib\agent\workflow-engine.ts

``typescript
import { toolRegistry } from './registry';
import { getDynamicModel } from '@/lib/gemini';
import { checkRules } from '@/lib/rules';
import { callGroq } from '@/lib/groq';
import { callOllama } from '@/lib/ollama';

interface AgentResponse {
    type: 'text' | 'tool_call' | 'error';
    content?: string;
    toolName?: string;
    toolArgs?: any;
}

export async function runAgentWorkflow(history: any[], message: string, images: any[] = [], persona?: string, modelId?: string, userId?: string, useWebSearch?: boolean, rulesEnabled: boolean = true) {
    // 0. Tier-1 Rules Engine (Instant Response)
    // Only apply for simple text messages without images and if rules are enabled
    if (images.length === 0 && rulesEnabled) {
        const ruleMatch = await checkRules(message);
        if (ruleMatch) {
            return { type: 'text', content: ruleMatch };
        }
    }

    // 1. Prepare Context & Route
    const isGroq = modelId?.startsWith('llama') || modelId?.startsWith('mixtral');
    const isOllama = modelId?.startsWith('ollama');
    const now = new Date();
    const dateTimeContext = `Current Date and Time: ${now.toLocaleString()} (${Intl.DateTimeFormat().resolvedOptions().timeZone})\n`;

    if (isGroq || isOllama) {
        // Groq / Ollama Path with Tool Support
        // Optimized: Reduced context and more concise instructions to stay under rate limits (TPM)
        const systemPrompt = `
You are NextGen AI, a helpful and accurate assistant for ALIET (Andhra Loyola Institute of Engineering & Technology).

${dateTimeContext}

If you need to use a tool, respond ONLY with a JSON object: { "tool": "name", "args": { ... } }

Tools:
${Object.values(toolRegistry).map(t => `- ${t.name}: ${t.description.substring(0, 200)}`).join('\n')}

Rules:
1. **Direct Answers**: Provide direct, factual answers based on search results. Do NOT just provide links if the information is present in the text results.
2. **Handle Missing Info**: If search_knowledge returns nothing or isn't relevant, state that you couldn't find the specific info on the college site and use your general knowledge if appropriate, but be honest about the gap.
3. **Images**: If you see images in search results metadata, include them as Markdown: \`![alt](url)\`.
4. **Formatting**: Always use structured Markdown (titles, lists) and emojis to make answers friendly.
5. **No Hallucination**: Stick to the provided search data for ALIET-specific facts.
6. **Faculty Search**: If asked about faculty, HODs, or staff members, use \`search_faculty\`. It will automatically check both the live database and hardcoded records.

${useWebSearch ? "\nUSER REQUESTED WEB SEARCH. Use `web_search` if internal knowledge is insufficient.\n" : ""}
${persona ? `\nPersona: ${persona}` : ''}
`;

        // Prune history for Groq to avoid rate limits (TPM 12000)
        const formatMessages = history.slice(-4).map(msg => ({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content
        }));

        formatMessages.unshift({ role: 'system', content: systemPrompt });
        formatMessages.push({ role: 'user', content: message });

        try {
            let responseText = "";
            if (isOllama) {
                responseText = await callOllama(formatMessages, modelId!);
            } else {
                responseText = await callGroq(formatMessages, modelId);
            }

            // Parse for tool calls
            const firstBrace = responseText.indexOf('{');
            const lastBrace = responseText.lastIndexOf('}');

            if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
                try {
                    const potentialJsonStr = responseText.substring(firstBrace, lastBrace + 1);
                    const parsed = JSON.parse(potentialJsonStr);

                    if (parsed.tool && typeof parsed.tool === 'string' && toolRegistry[parsed.tool]) {
                        return {
                            type: 'tool_call',
                            toolName: parsed.tool,
                            toolArgs: parsed.args || {}
                        };
                    }
                } catch (e) {
                    // Not valid JSON, fall through to text
                }
            }

            return { type: 'text', content: responseText };
        } catch (error: any) {
            console.error('[OpenSource Workflow Error]:', error);
            return { type: 'text', content: `Error from Model Provider: ${error.message}` };
        }
    }

    // --- Gemini Path (Existing) ---
    // High-Performance Context Pruning
    let recentHistory = history.slice(-14).map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
    }));

    // Gemini API Requirement: First message must be from 'user'
    while (recentHistory.length > 0 && recentHistory[0].role === 'model') {
        recentHistory.shift();
    }

    // Gemini API Requirement: Roles must alternate
    const cleanHistory: any[] = [];
    for (const msg of recentHistory) {
        if (cleanHistory.length === 0 || cleanHistory[cleanHistory.length - 1].role !== msg.role) {
            cleanHistory.push(msg);
        } else {
            cleanHistory[cleanHistory.length - 1].parts[0].text += `\n\n${msg.parts[0].text}`;
        }
    }
    recentHistory = cleanHistory;

    // Convert images to Gemini format
    const imageParts = images.map(img => ({
        inlineData: {
            data: img.data,
            mimeType: img.mimeType
        }
    }));

    const dynamicModel = getDynamicModel(modelId || 'gemini-1.5-flash');
    const chat = dynamicModel.startChat({
        history: recentHistory,
        generationConfig: {
            maxOutputTokens: 1000,
        },
    });

    // 2. Initial Prompt with Tool Instructions
    const toolsPrompt = `
You are an advanced AI assistant with access to tools. 

${dateTimeContext}

If you need to use a tool, you MUST respond ONLY with a JSON object. Do not include any other text BEFORE or AFTER the JSON.
Format: { "tool": "tool_name", "args": { ... } }

Available Tools:
${Object.values(toolRegistry).map(t => `- ${t.name}: ${t.description}`).join('\n')}

- If no tool is needed, respond with a direct text answer.
- If search_knowledge returns nothing, use your general knowledge but mention the search was empty.
- Always use Markdown lists (\`- \` or \`1. \`) for structured info.
- Use emojis naturally to make your generated responses more attractive and readable!
- If asked about faculty, HODs, or staff members, use \`search_faculty\`. It handles both database and static record lookups automatically.

${useWebSearch ? "\nCRITICAL: USER EXPLICITLY REQUESTED WEB SEARCH. You MUST use the `duckduckgo_search` or `web_search` or `read_page` tool to gather real-time data before providing your final answer.\n" : ""}
${persona ? `\n--- PERSONA ---\n${persona}\n---------------` : ''}
`;

    // 3. Send Message
    const messageParts = [
        { text: toolsPrompt + "\nUser: " + message },
        ...imageParts
    ];

    const result = await chat.sendMessage(messageParts);
    const responseText = result.response.text();

    // 4. Robust JSON Parsing
    try {
        const firstBrace = responseText.indexOf('{');
        const lastBrace = responseText.lastIndexOf('}');

        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
            const potentialJsonStr = responseText.substring(firstBrace, lastBrace + 1);
            const parsed = JSON.parse(potentialJsonStr);

            if (parsed.tool && typeof parsed.tool === 'string') {
                if (toolRegistry[parsed.tool]) {
                    return {
                        type: 'tool_call',
                        toolName: parsed.tool,
                        toolArgs: parsed.args || {}
                    };
                }
            }
        }
    } catch (e) {
        console.warn(`[Agent] Failed to parse potential tool call: ${e}`);
    }

    return { type: 'text', content: responseText };
}

export async function executeToolCall(toolName: string, args: any, userId?: string) {
    const tool = toolRegistry[toolName];
    if (!tool) throw new Error(`Tool ${toolName} not found`);

    console.log(`[Agent] Executing ${toolName} with`, args, "for user", userId);
    return await tool.execute(args, { userId });
}

``

---

# File: lib\supabase\admin.ts

``typescript

import { createClient } from '@supabase/supabase-js';

// Create a Supabase client with the SERVICE_ROLE key for admin privileges
// This bypasses RLS policies and should be used server-side only.
export const createAdminClient = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    if (!supabaseUrl || !supabaseServiceKey) {
        throw new Error('Missing Supabase URL or Service Role Key');
    }

    return createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
};

``

---

# File: lib\supabase\client.ts

``typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}

``

---

# File: lib\supabase\middleware.ts

``typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    )
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
    // creating a new Response object with NextResponse.next() make sure to:
    // 1. Pass the request in it, like so:
    //    const myNewResponse = NextResponse.next({ request })
    // 2. Copy over the cookies, like so:
    //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
    // 3. Change the myNewResponse object to fit your needs, but avoid changing
    //    the cookies!
    // 4. Finally:
    //    return myNewResponse
    // If this is not done, you may be causing the browser and server to go out
    // of sync and terminate the user's session prematurely!

    await supabase.auth.getUser()

    return response
}

``

---

# File: lib\supabase\server.ts

``typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

``

---

# File: lib\__tests__\chat-store.test.ts

``typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { chatStore } from '../chat-store';
import { createClient } from '../supabase/client';

// Mock Supabase Client
vi.mock('../supabase/client', () => ({
    createClient: vi.fn(() => ({
        auth: {
            getUser: vi.fn(),
            onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
            signOut: vi.fn(),
        },
        from: vi.fn(),
    })),
}));

describe('chatStore', () => {
    let supabaseMock: any;

    beforeEach(() => {
        supabaseMock = createClient();
        vi.clearAllMocks();
    });

    describe('Guest Mode', () => {
        it('should create a guest conversation if no user is logged in', async () => {
            // Mock no user
            supabaseMock.auth.getUser.mockResolvedValue({ data: { user: null } });

            const convo = await chatStore.createConversation('Test Chat');
            expect(convo).not.toBeNull();
            expect(convo?.id).toContain('guest-');
            expect(convo?.title).toBe('Test Chat');
        });

        it('should add messages to guest conversation', async () => {
            // Setup guest convo
            supabaseMock.auth.getUser.mockResolvedValue({ data: { user: null } });
            const convo = await chatStore.createConversation('Guest Chat');

            const msg = await chatStore.addMessage(convo!.id, 'user', 'Hello');
            expect(msg).not.toBeNull();
            expect(msg?.content).toBe('Hello');

            const messages = await chatStore.getMessages(convo!.id);
            expect(messages).toHaveLength(1);
            expect(messages[0].content).toBe('Hello');
        });
    });

    describe('Authenticated Mode', () => {
        const mockUser = { id: 'user-123' };

        it('should fetch conversations from Supabase', async () => {
            // Mock logged in user
            supabaseMock.auth.getUser.mockResolvedValue({ data: { user: mockUser } });

            // Mock DB response
            const mockData = [{ id: '1', title: 'Chat 1' }];

            const queryBuilder: any = {
                select: vi.fn().mockReturnThis(),
                eq: vi.fn().mockReturnThis(),
                is: vi.fn().mockReturnThis(),
                order: vi.fn().mockReturnThis(),
                then: (resolve: any) => resolve({ data: mockData, error: null }),
            };

            // Fix: we need to ensure the chain calls return the builder *synchronously* 
            // but the final await triggers .then()

            supabaseMock.from.mockReturnValue(queryBuilder);

            await chatStore.getConversations();

            expect(supabaseMock.from).toHaveBeenCalledWith('conversations');
            expect(queryBuilder.select).toHaveBeenCalled();
            expect(queryBuilder.eq).toHaveBeenCalledWith('user_id', mockUser.id);
        });
    });
});

``

---

# File: lib\__tests__\utils.test.ts

``typescript
import { describe, it, expect } from 'vitest';
import { cn } from '../utils';

describe('utils', () => {
    describe('cn', () => {
        it('should merge class names correctly', () => {
            expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white');
        });

        it('should handle conditional class names', () => {
            const condition = true;
            expect(cn('bg-red-500', condition && 'text-white')).toBe('bg-red-500 text-white');
            expect(cn('bg-red-500', !condition && 'text-white')).toBe('bg-red-500');
        });

        it('should merge tailwind classes using tailwind-merge', () => {
            expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
            expect(cn('p-4', 'p-2')).toBe('p-2');
        });
    });
});

``

---

# File: lib\__tests__\workflow-engine.test.ts

``typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { runAgentWorkflow } from '../workflow-engine';

// Mock Gemini
const mockSendMessage = vi.fn();
vi.mock('@/lib/gemini', () => ({
    model: {
        startChat: vi.fn(() => ({
            sendMessage: mockSendMessage,
        })),
    },
}));

describe('runAgentWorkflow', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return text response when no tool is called', async () => {
        mockSendMessage.mockResolvedValue({
            response: {
                text: () => 'Hello, world!',
            },
        });

        const result = await runAgentWorkflow([], 'Hi');

        expect(result.type).toBe('text');
        expect(result.content).toBe('Hello, world!');
    });

    it('should detect tool calls in JSON format', async () => {
        const toolCall = JSON.stringify({
            tool: 'calculate',
            args: { expression: '2 + 2' }
        });

        mockSendMessage.mockResolvedValue({
            response: {
                text: () => toolCall,
            },
        });

        const result = await runAgentWorkflow([], 'Calculate 2+2');

        expect(result.type).toBe('tool_call');
        expect(result.toolName).toBe('calculate');
        expect(result.toolArgs).toEqual({ expression: '2 + 2' });
    });

    it('should handle invalid JSON as plain text', async () => {
        const invalidJson = '{ tool: "broken" '; // Missing closing brace
        mockSendMessage.mockResolvedValue({
            response: {
                text: () => invalidJson,
            },
        });

        const result = await runAgentWorkflow([], 'Broken JSON');

        expect(result.type).toBe('text');
        expect(result.content).toBe(invalidJson);
    });
});

``

---

# File: supabase\schema.sql

``sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE
-- Create a table for public profiles that syncs with auth.users
create table public.profiles (
  id uuid REFERENCES auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Policies
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( (select auth.uid()) = id );

create policy "Users can update own profile."
  on profiles for update
  using ( (select auth.uid()) = id );

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

-- Trigger to automatically create profile on signup
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. CHATS TABLE
create table public.chats (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.chats enable row level security;

-- Policies
create policy "Users can view their own chats."
  on chats for select
  using ( (select auth.uid()) = user_id );

create policy "Users can create their own chats."
  on chats for insert
  with check ( (select auth.uid()) = user_id );

create policy "Users can update their own chats."
  on chats for update
  using ( (select auth.uid()) = user_id );

create policy "Users can delete their own chats."
  on chats for delete
  using ( (select auth.uid()) = user_id );


-- 3. MESSAGES TABLE
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  chat_id uuid references public.chats(id) on delete cascade not null,
  role text not null check (role in ('user', 'model', 'assistant', 'system')),
  content text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.messages enable row level security;

-- Policies
create policy "Users can view messages in their chats."
  on messages for select
  using (
    exists (
      select 1 from chats
      where chats.id = messages.chat_id
      and chats.user_id = (select auth.uid())
    )
  );

create policy "Users can insert messages in their chats."
  on messages for insert
  with check (
    exists (
      select 1 from chats
      where chats.id = messages.chat_id
      and chats.user_id = (select auth.uid())
    )
  );

-- Indexes for performance
create index messages_chat_id_idx on messages(chat_id);
create index chats_user_id_idx on chats(user_id);

``

---

# File: supabase\migrations\20240207_setup_pgvector.sql

``sql
-- Enable the pgvector extension to work with embedding vectors
create extension if not exists vector;

-- Create a table to store your documents
create table documents (
  id bigserial primary key,
  user_id uuid references auth.users(id) default auth.uid(),
  content text, -- corresponds to Document.pageContent
  metadata jsonb, -- corresponds to Document.metadata
  embedding vector(768) -- 768 is the dimension size for Gemini text-embedding-004
);

-- Enable RLS
alter table documents enable row level security;

-- Policies
create policy "Users can view their own documents"
  on documents for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own documents"
  on documents for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own documents"
  on documents for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own documents"
  on documents for delete
  using ( auth.uid() = user_id );

-- Create a function to search for documents
create or replace function public.match_documents (
  query_embedding vector(768),
  match_threshold float,
  match_count int,
  filter_conversation_id text default null,
  filter_user_id uuid default null
)
returns table (
  id bigint,
  content text,
  metadata jsonb,
  similarity float
)
language plpgsql
set search_path = public, pg_temp
as $$
begin
  return query
  select
    d.id,
    d.content,
    d.metadata,
    1 - (d.embedding <=> query_embedding) as similarity
  from public.documents as d
  where (1 - (d.embedding <=> query_embedding) > match_threshold)
    and (filter_conversation_id is null or (d.metadata->>'conversationId') = filter_conversation_id)
    and (filter_user_id is null or d.user_id = filter_user_id)
  order by d.embedding <=> query_embedding
  limit match_count;
end;
$$;

``

---

# File: supabase\migrations\20240315_create_faculty_table.sql

``sql
-- Migration to create structured faculty and department tables
-- This ensures high-accuracy retrieval for personnel-related queries.

create table if not exists public.faculty (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  designation text,
  department text not null,
  qualification text,
  image_url text,
  is_hod boolean default false,
  profile_url text,
  meta_data jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(name, department) -- Prevent duplicates within the same department
);

-- Enable RLS
alter table public.faculty enable row level security;

-- Policies for public viewing
create policy "Faculty data is viewable by everyone."
  on public.faculty for select
  using ( true );

-- Only service role/admin can insert/update (scraping happens on server)
create policy "Only admins can modify faculty data."
  on public.faculty for all
  using ( (select auth.role()) = 'service_role' );

-- Indexes for fast lookup
create index if not exists faculty_name_idx on public.faculty(name);
create index if not exists faculty_department_idx on public.faculty(department);
create index if not exists faculty_is_hod_idx on public.faculty(is_hod);

``

---


---


---

# Project Report Snippets

# ðŸ“„ Internship Report: Core Code Snippets

This file contains the final, high-quality code implementation for your **NextGen AI Chatbot** internship project, organized for inclusion in your report.

---

## 1. ðŸ“¦ Import Statements
These represent the essential tech stack: **React (Frontend)**, **Next.js (Framework)**, and **AI SDKs (Brain)**.

```typescript
// Core Framework & Animations
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Space_Grotesk } from 'next/font/google';

// AI & Database Services
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';
import { WebsiteCrawler } from '@/lib/website-crawler';
import { searchDocuments, embedText } from '@/lib/vector-store';

// Accessibility & UI Components
import { MessageSquare, Terminal, Globe, Download, X } from 'lucide-react';
import { cn } from '@/lib/utils';
```

---

## 2. ðŸ§  Retrieval-Augmented Generation (RAG) Architecture
The NextGen AI Chatbot uses a modern **RAG** pipeline. This allows the AI to "read" your custom data (like college rules or websites) and answer questions based on that specific knowledge.

### Core RAG Pipeline (End-to-End)
```typescript
/**
 * RAG Implementation: Vector Search & Knowledge Retrieval
 * Path: lib/agent/registry.ts & lib/vector-store.ts
 */

// 1. THE SEARCH TOOL (Used by the AI Agent)
registerTool({
    name: 'search_knowledge',
    description: 'Search the internal knowledge base for specific information.',
    parameters: z.object({
        query: z.string().describe('The search query'),
    }),
    execute: async ({ query }, context) => {
        // Step A: Perform Semantic Search using Vector Embeddings
        const documents = await vectorStore.searchDocuments(query, 5, 0.3);
        
        if (documents.length === 0) {
            return { result: "No relevant documents found." };
        }

        // Step B: Format retrieved context for the LLM
        return { 
            result: documents.map(doc => `[SOURCE: ${doc.metadata?.url}]\n${doc.content}`).join('\n\n') 
        };
    },
});

// 2. THE VECTOR ENGINE (Embedding Generation)
export async function embedText(text: string): Promise<number[]> {
    // Uses BAAI/bge-base-en-v1.5 (Hugging Face) for state-of-the-art retrieval
    const response = await fetch("https://router.huggingface.co/hf-inference/models/BAAI/bge-base-en-v1.5", {
        headers: { "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}` },
        method: "POST",
        body: JSON.stringify({ inputs: text }),
    });
    return await response.json();
}
```

---

## 3. ðŸ—£ï¸ Natural Language Processing (NLP)
This handles the **Generation** phase of the RAG pipeline.

```typescript
/**
 * Generation Strategy: Context-Aware Chat
 */
export const handleAIChat = async (userPrompt: string, knowledgeContext: string) => {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    // The "Augmented" part of RAG: We inject retrieved knowledge into the prompt
    const prompt = `
        You are a helpful assistant. Use the following context to answer the user.
        CONTEXT: ${knowledgeContext}
        USER QUESTION: ${userPrompt}
    `;
    
    const result = await model.generateContent(prompt);
    return result.response.text();
};
```

---
*Created for: SmartInternz Internship Report (2025-2026)*

