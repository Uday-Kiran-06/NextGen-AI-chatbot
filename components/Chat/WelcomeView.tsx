import React from 'react';
import { motion } from 'framer-motion';
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
    return (
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 min-h-[50vh]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative"
            >
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-accent-primary to-accent-secondary blur-2xl opacity-20 animate-pulse-slow" />
                <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-foreground via-foreground to-foreground/50 relative z-10">
                    NextGen AI
                </h1>
                <p className="text-gray-500 mt-4 text-lg max-w-md mx-auto">
                    Your advanced assistant for analysis, creativity, and development.
                </p>
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
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -8, transition: { duration: 0.2 } }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ delay: 0.4 + (i * 0.1), duration: 0.5 }}
                        onClick={() => onSendMessage(item.prompt, [])}
                        className="flex flex-col items-center gap-3 p-4 rounded-2xl glass-panel border-glass-border hover:bg-glass-shimmer transition-all duration-300 group hover:shadow-2xl hover:border-accent-primary/50"
                    >
                        <div className={`p-3 rounded-xl bg-glass-bg ${item.color} group-hover:bg-glass-shimmer transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                            <item.icon size={20} />
                        </div>
                        <span className="text-xs font-bold text-foreground/70 group-hover:text-foreground transition-all duration-300">{item.label}</span>
                    </motion.button>
                ))}
            </motion.div>
        </div>
    );
}
