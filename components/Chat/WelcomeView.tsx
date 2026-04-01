'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
    TrendingUp, Image, Bug, BookOpen, 
    Sparkles, ArrowRight, Zap, Code2, PenTool
} from 'lucide-react';

const CAPABILITIES = [
    { icon: TrendingUp, label: 'Data Analysis', desc: 'Insights & trends' },
    { icon: Image, label: 'Image Generation', desc: 'Visual creation' },
    { icon: Code2, label: 'Code Assistant', desc: 'Debug & write' },
    { icon: PenTool, label: 'Creative Writing', desc: 'Stories & content' },
];

const FEATURES = [
    'Advanced reasoning & analysis',
    'Multi-modal understanding',
    'Code generation & debugging',
    'Creative content creation',
];

interface WelcomeViewProps {
    onSendMessage: (text: string, files: any[]) => void;
}

export default function WelcomeView({ onSendMessage }: WelcomeViewProps) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center relative z-0 min-h-screen">
            {/* Mesh Gradient Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[130%] w-[600px] h-[200px] rounded-[60%_40%_40%_60%_/_50%_50%_50%_50%] blur-[120px] animate-pulse" 
                    style={{ background: 'var(--accent-primary)', opacity: 0.75, animationDuration: '3s', animationDelay: '0.5s' }} 
                />
            </div>

            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="text-center max-w-2xl mx-auto"
            >
                {/* Accent Badge */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
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
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.5 }}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4"
                    style={{ color: 'var(--foreground)' }}
                >
                    NextGen AI
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
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
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.5 }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full max-w-3xl px-4 sm:px-0 mb-10"
            >
                {CAPABILITIES.map((cap, i) => (
                    <motion.button
                        key={cap.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + (i * 0.08), duration: 0.4 }}
                        whileHover={{ y: -4, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onSendMessage(`Help me with ${cap.label.toLowerCase()}: `, [])}
                        className="group relative flex flex-col items-center gap-3 p-4 sm:p-5 md:p-6 rounded-2xl transition-all duration-300"
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
                            className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                            style={{ 
                                backgroundColor: 'var(--sidebar-hover)',
                                border: '1px solid var(--sidebar-border)'
                            }}
                        >
                            <cap.icon 
                                className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300" 
                                style={{ color: 'var(--accent-primary)' }}
                            />
                        </div>

                        {/* Label */}
                        <div className="text-center">
                            <p className="text-sm font-semibold mb-0.5 transition-colors duration-300" style={{ color: 'var(--foreground)' }}>
                                {cap.label}
                            </p>
                            <p className="text-[11px] transition-colors duration-300" style={{ color: 'var(--foreground)', opacity: 0.5 }}>
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

            {/* Features List */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="flex flex-wrap justify-center gap-2 sm:gap-3 max-w-xl px-4"
            >
                {FEATURES.map((feature, i) => (
                    <motion.div
                        key={feature}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.7 + (i * 0.06), duration: 0.3 }}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                        style={{ 
                            backgroundColor: 'var(--sidebar-hover)',
                            border: '1px solid var(--sidebar-border)'
                        }}
                    >
                        <Sparkles className="w-3 h-3" style={{ color: 'var(--accent-primary)' }} />
                        <span className="text-xs font-medium" style={{ color: 'var(--foreground)', opacity: 0.7 }}>
                            {feature}
                        </span>
                    </motion.div>
                ))}
            </motion.div>

            {/* Decorative Line */}
            <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="mt-10 w-24 h-px"
                style={{ 
                    background: 'linear-gradient(90deg, transparent, var(--glass-border), transparent)'
                }}
            />
        </div>
    );
}
