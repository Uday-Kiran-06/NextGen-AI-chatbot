'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Image, Code2, PenTool, Zap } from 'lucide-react';

const CAPABILITIES = [
    { icon: TrendingUp, label: 'Data Analysis', desc: 'Insights & trends' },
    { icon: Image, label: 'Image Generation', desc: 'Visual creation' },
    { icon: Code2, label: 'Code Assistant', desc: 'Debug & write' },
    { icon: PenTool, label: 'Creative Writing', desc: 'Stories & content' },
];

interface WelcomeViewProps {
    onSendMessage: (text: string, files: any[]) => void;
}

export default function WelcomeView({ onSendMessage }: WelcomeViewProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="flex-1 flex flex-col items-center justify-start pt-12 md:pt-16 w-full h-full relative overflow-hidden px-5">
            {/* Mesh Gradient Background */}
            <div 
                className="absolute inset-0 pointer-events-none -z-10 animate-pulse"
                style={{
                    background: 'radial-gradient(ellipse 70% 65% at 50% 30%, rgba(124, 58, 237, 0.45) 0%, rgba(124, 58, 237, 0.15) 40%, transparent 80%)',
                    animationDuration: '3s'
                }}
            />

            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="text-center w-full relative z-10 mb-6"
            >
                {/* Accent Badge */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: mounted ? 1 : 0, scale: mounted ? 1 : 0.9 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
                    style={{ 
                        backgroundColor: 'var(--glass-bg)',
                        border: '1px solid var(--glass-border)'
                    }}
                >
                    <Zap className="w-3.5 h-3.5" style={{ color: 'var(--accent-primary-light)' }} />
                    <span className="text-xs font-medium" style={{ color: 'var(--foreground)', opacity: 'var(--text-secondary)' }}>
                        Powered by Advanced AI
                    </span>
                </motion.div>

                {/* Main Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 15 }}
                    transition={{ delay: 0.15, duration: 0.4 }}
                    className="text-4xl sm:text-5xl font-bold tracking-tight mb-4"
                    style={{ color: 'var(--foreground)' }}
                >
                    NextGen AI
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 10 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="text-sm sm:text-base max-w-xs mx-auto leading-relaxed"
                    style={{ color: 'var(--foreground)', opacity: 'var(--text-secondary)' }}
                >
                    Your intelligent assistant for analysis, creativity, and development
                </motion.p>
            </motion.div>

            {/* Capabilities Grid */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-3 w-full max-w-4xl relative z-10"
            >
                {CAPABILITIES.map((cap, i) => (
                    <motion.button
                        key={cap.label}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 15 }}
                        transition={{ delay: 0.35 + (i * 0.06), duration: 0.35 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => onSendMessage(`Help me with ${cap.label.toLowerCase()}: `, [])}
                        className="flex flex-col items-center gap-2.5 md:gap-3 p-4 md:p-5 rounded-2xl transition-all duration-200"
                        style={{ 
                            backgroundColor: 'var(--card-bg)',
                            border: '1px solid var(--card-border)',
                            backdropFilter: `blur(var(--card-blur))`
                        }}
                    >
                        {/* Icon Container */}
                        <div 
                            className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center"
                            style={{ 
                                backgroundColor: 'var(--glass-bg)',
                                border: '1px solid var(--glass-border)'
                            }}
                        >
                            <cap.icon 
                                className="w-4 h-4 md:w-5 md:h-5" 
                                style={{ color: 'var(--accent-primary-light)' }}
                            />
                        </div>

                        {/* Label */}
                        <div className="text-center">
                            <p className="text-xs md:text-sm font-semibold mb-0.5" style={{ color: 'var(--foreground)' }}>
                                {cap.label}
                            </p>
                            <p className="text-[10px] md:text-xs" style={{ color: 'var(--foreground)', opacity: 'var(--text-tertiary)' }}>
                                {cap.desc}
                            </p>
                        </div>
                    </motion.button>
                ))}
            </motion.div>
        </div>
    );
}
