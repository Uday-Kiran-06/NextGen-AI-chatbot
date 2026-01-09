import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--md-sys-color-background)",
                foreground: "var(--md-sys-color-on-background)",
                
                // MD3 System Colors
                surface: "var(--md-sys-color-surface)",
                "surface-container-low": "var(--md-sys-color-surface-container-low)",
                "surface-container": "var(--md-sys-color-surface-container)",
                "surface-container-high": "var(--md-sys-color-surface-container-high)",
                
                primary: "var(--md-sys-color-primary)",
                "on-primary": "var(--md-sys-color-on-primary)",
                "primary-container": "var(--md-sys-color-primary-container)",
                "on-primary-container": "var(--md-sys-color-on-primary-container)",
                
                secondary: "var(--md-sys-color-secondary)",
                "on-secondary": "var(--md-sys-color-on-secondary)",
                "secondary-container": "var(--md-sys-color-secondary-container)",
                "on-secondary-container": "var(--md-sys-color-on-secondary-container)",
                
                tertiary: "var(--md-sys-color-tertiary)",
                
                // Legacy Aliases
                "accent-primary": "var(--md-sys-color-primary)",
                "accent-secondary": "var(--md-sys-color-secondary)",
            },
            borderRadius: {
                // Material Shapes
                'xs': '4px',
                'sm': '8px',
                'md': '12px',
                'lg': '16px',
                'xl': '24px', // Standard Card
                '2xl': '28px', // Large Card
                '3xl': '32px',
            },
            animation: {
                "fade-in": "fadeIn 0.5s var(--motion-easing-emphasized) forwards",
                "slide-up": "slideUp 0.5s var(--motion-easing-emphasized) forwards",
            },
            transitionTimingFunction: {
                'standard': 'var(--motion-easing-standard)',
                'emphasized': 'var(--motion-easing-emphasized)',
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0", transform: "translateY(10px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                slideUp: {
                    "0%": { transform: "translateY(20px)", opacity: "0" },
                    "100%": { transform: "translateY(0)", opacity: "1" },
                }
            },
        },
    },
    plugins: [],
};
export default config;
