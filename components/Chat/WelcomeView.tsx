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
