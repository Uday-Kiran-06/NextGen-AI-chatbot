import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                "accent-primary": "var(--accent-primary)",
                "accent-secondary": "var(--accent-secondary)",
                "glass-bg": "var(--glass-bg)",
                "glass-border": "var(--glass-border)",
            },
            animation: {
                "aurora": "aurora 60s linear infinite",
                "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
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
            },
        },
    },
    plugins: [],
};
export default config;
