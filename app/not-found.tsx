'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { House } from '@phosphor-icons/react/dist/csr/House';
import { ArrowLeft } from '@phosphor-icons/react/dist/csr/ArrowLeft';
import { AuroraBackground } from '@/components/ui/AuroraBackground';

export default function NotFound() {
    return (
        <AuroraBackground>
            <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center z-10 relative">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-md w-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl"
                >
                    <div className="mb-6 relative">
                        <h1 className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-accent-secondary opacity-20 select-none">
                            404
                        </h1>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-4xl">🤔</span>
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-3">Page Not Found</h2>
                    <p className="text-gray-400 mb-8">
                        The page you're looking for seems to have wandered off into the digital void.
                    </p>

                    <div className="flex flex-col gap-3">
                        <Link
                            href="/"
                            className="w-full bg-white/10 hover:bg-white/20 border border-white/10 text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2 group"
                        >
                            <House size={18} className="group-hover:scale-110 transition-transform" weight="bold" />
                            Return Home
                        </Link>

                        <button
                            onClick={() => window.history.back()}
                            className="w-full bg-transparent hover:bg-white/5 text-gray-400 hover:text-white py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                            <ArrowLeft size={18} weight="bold" />
                            Go Back
                        </button>
                    </div>
                </motion.div>
            </div>
        </AuroraBackground>
    );
}
