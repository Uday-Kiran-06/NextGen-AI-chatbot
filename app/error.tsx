'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import { AuroraBackground } from '@/components/ui/AuroraBackground';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Runtime Error:', error);
    }, [error]);

    return (
        <AuroraBackground>
            <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center z-10 relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md w-full bg-black/40 backdrop-blur-xl border border-red-500/20 rounded-3xl p-8 shadow-2xl"
                >
                    <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6 border border-red-500/20 shadow-lg shadow-red-500/10">
                        <AlertTriangle size={32} className="text-red-400" />
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-2">Something went wrong!</h2>
                    <p className="text-gray-400 mb-6 text-sm">
                        We encountered an unexpected issue. Please try again later.
                    </p>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={reset}
                            className="w-full bg-red-500/80 hover:bg-red-500 text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-500/20"
                        >
                            <RefreshCcw size={18} />
                            Try Again
                        </button>

                        <Link
                            href="/"
                            className="w-full bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                            <Home size={18} />
                            Return Home
                        </Link>
                    </div>
                </motion.div>
            </div>
        </AuroraBackground>
    );
}
