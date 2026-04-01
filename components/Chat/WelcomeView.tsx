'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Image, Code2, PenTool, ArrowRight, Zap } from 'lucide-react';

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
        <div className="flex-1 flex flex-col items-center justify-center w-full h-full relative overflow-hidden">
            {/* Mesh Gradient Background - Radial glow matching reference */}
            <div 
                className="absolute inset-0 pointer-events-none -z-10"
                style={{
                    background: 'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(124, 58, 237, 0.4) 0%, rgba(124, 58, 237, 0.15) 40%, transparent 70%)'
                }}
            />

            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 30 }}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="text-center w-full px-6 md:px-12 relative z-10"
            >
                {/* Accent Badge */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: mounted ? 1 : 0, scale: mounted ? 1 : 0.9 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
                    style={{ 
                        backgroundColor: 'var(--glass-bg)',
                        border: '1px solid var(--glass-border)',
                        backdropFilter: 'blur(8px)'
                    }}
                >
                    <Zap className="w-3.5 h-3.5" style={{ color: 'var(--accent-primary)' }} />
                    <span className="text-xs font-medium" style={{ color: 'var(--foreground)', opacity: 0.7 }}>
                        Powered by Advanced AI
                    </span>
                </motion.div>

                {/* Main Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
                    transition={{ delay: 0.15, duration: 0.5 }}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4"
                    style={{ color: 'var(--foreground)' }}
                >
                    NextGen AI
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 15 }}
                    transition={{ delay: 0.25, duration: 0.5 }}
                    className="text-base sm:text-lg md:text-xl max-w-md mx-auto mb-8"
                    style={{ color: 'var(--foreground)', opacity: 0.6 }}
                >
                    Your intelligent assistant for analysis, creativity, and development
                </motion.p>
            </motion.div>

            {/* Capabilities Grid */}
            <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 25 }}
                transition={{ delay: 0.35, duration: 0.5 }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl px-6 sm:px-8 mb-10 relative z-10"
            >
                {CAPABILITIES.map((cap, i) => (
                    <motion.button
                        key={cap.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
                        transition={{ delay: 0.4 + (i * 0.08), duration: 0.4 }}
                        whileHover={{ y: -4, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onSendMessage(`Help me with ${cap.label.toLowerCase()}: `, [])}
                        className="group relative flex flex-col items-center gap-4 p-5 sm:p-6 rounded-2xl transition-all duration-300"
                        style={{ 
                            backgroundColor: 'var(--glass-bg)',
                            border: '1px solid var(--glass-border)',
                            backdropFilter: 'blur(12px)'
                        }}
                    >
                        {/* Hover Glow Effect */}
                        <div 
                            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
                            style={{
                                background: 'radial-gradient(circle at center, var(--accent-glow) 0%, transparent 70%)'
                            }}
                        />

                        {/* Icon Container */}
                        <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                            style={{ 
                                backgroundColor: 'var(--sidebar-hover)',
                                border: '1px solid var(--sidebar-border)'
                            }}
                        >
                            <cap.icon 
                                className="w-6 h-6 transition-transform duration-300" 
                                style={{ color: 'var(--accent-primary)' }}
                            />
                        </div>

                        {/* Label */}
                        <div className="text-center">
                            <p className="text-[13px] sm:text-sm font-semibold tracking-tight mb-1.5" style={{ color: 'var(--foreground)' }}>
                                {cap.label}
                            </p>
                            <p className="text-[11px] sm:text-xs" style={{ color: 'var(--foreground)', opacity: 0.55 }}>
                                {cap.desc}
                            </p>
                        </div>

                        {/* Arrow indicator */}
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-1 group-hover:translate-x-0">
                            <ArrowRight className="w-3.5 h-3.5" style={{ color: 'var(--accent-primary)' }} />
                        </div>
                    </motion.button>
                ))}
            </motion.div>

            {/* Decorative Line */}
            <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: mounted ? 1 : 0, scaleX: mounted ? 1 : 0 }}
                transition={{ delay: 0.8, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="w-24 h-px relative z-10"
                style={{ 
                    background: 'linear-gradient(90deg, transparent, var(--glass-border), transparent)'
                }}
            />
        </div>
    );
}
