# 📄 Internship Report: Core Code Snippets

This file contains the final, high-quality code implementation for your **NextGen AI Chatbot** internship project, organized for inclusion in your report.

---

## 1. 📦 Import Statements
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

## 2. 🧠 Retrieval-Augmented Generation (RAG) Architecture
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

## 3. 🗣️ Natural Language Processing (NLP)
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
