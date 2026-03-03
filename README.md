# ✨ NextGen AI Chatbot

A beautifully designed, high-performance AI chat interface built with Next.js. NextGen AI transforms standard LLM interactions into a powerful, agentic workspace featuring live code execution, real-time web browsing, continuous voice conversations, and seamless Supabase integration.

<img width="1919" height="869" alt="image" src="https://github.com/user-attachments/assets/386ccb37-b173-4584-8b8b-7039739ce1d7" />


## 🚀 Key Features

### Core Experience
*   🎨 **Stunning UI/UX**: Premium aesthetic featuring glassmorphism, responsive design, and fluid transitions powered by **Framer Motion**.
*   🔐 **Secure Authentication**: Built-in Google OAuth login seamlessly linked to **Supabase**.
*   💾 **Persistent History**: All conversations and messages are securely stored in a Postgres database. Messages dynamically branch when edited or regenerated.
*   🌗 **Theming**: Flawless Dark and Light mode support with automatic system preference detection.

### 🧠 Advanced AI Capabilities
*   **Multi-Model Support**: Chat with Google's **Gemini 2.5 Flash / Pro**, **Groq** (Llama 3 / Mixtral), or switch to **Local AI (Ollama)** for 100% private, zero-cost inference right on your desktop.
*   🌐 **Agentic Web Search**: A dedicated toggle forces the AI to actively use built-in tools (like DuckDuckGo) to research real-time information across the web before answering.
*   🎭 **Custom Personas**: Go beyond standard prompts. Create, edit, and save your own detailed "System Instructions" via a custom modal to perfectly tailor the AI's behavior.

### 💻 Developer & Power-User Tools
*   **Live Code Sandbox**: Don't just read code—**run it**. The built-in Artifact Viewer spins up an isolated browser-based sandbox to execute pure **JavaScript**, or client-side **Python** (via Pyodide), displaying real-time console outputs directly in your chat.
*   **Smart Syntax Highlighting**: Fully styled markdown parsing with GitHub Flavored Markdown (tables, task lists) and intelligent code blocks that automatically collapse if they exceed 20 lines.
*   **Global Chat Search**: Instantly find old code snippets or past conversations with a lightning-fast substring search querying the actual content of every message in your Supabase database.

### 🎙️ Accessibility & UX Elevators
*   **Continuous Voice Mode**: Hands-free interactions! Engage the microphone, speak naturally, and the app will detect a 2.5-second silence to automatically send your message.
*   **AI-Powered Titles**: Conversations are automatically summarized into punchy, 3-4 word titles in the background using Gemini Flash.
*   **Keyboard Shortcuts**: Press `Esc` to instantly stop AI generation, or use `Cmd/Ctrl + Enter` for quick sends.
*   **PWA Ready**: Install the chatbot directly to your iOS or Android home screen as a standalone Progressive Web App.

---

## 🛠️ Tech Stack

*   **Framework**: [Next.js](https://nextjs.org/) (App Router)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Animations**: [Framer Motion](https://www.framer.com/motion/)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL)
*   **AI SDKs**: `@google/generative-ai`, Groq REST API, custom Ollama handler
*   **Utilities**: `react-markdown`, `react-syntax-highlighter`, `pyodide`

---

## ⚙️ Local Development Setup

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

## 📝 License
This project is open-source and available under the [MIT License](LICENSE).
