'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error('[GLOBAL_ERROR]', {
      message: error.message,
      stack: error.stack,
      digest: error.digest,
      timestamp: new Date().toISOString(),
    });
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 antialiased">
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-950/30 via-slate-950 to-pink-950/30" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
          
          <div className="relative z-10 w-full max-w-md">
            <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
              <div className="flex justify-center mb-6">
                <div className="p-4 rounded-2xl bg-red-500/10">
                  <AlertTriangle className="w-10 h-10 text-red-400" />
                </div>
              </div>

              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-white mb-3">
                  Critical Error
                </h1>
                <p className="text-slate-400">
                  A critical error occurred that prevented the app from loading.
                </p>
              </div>

              {error.digest && (
                <div className="bg-black/40 rounded-lg p-3 mb-6">
                  <p className="text-xs text-slate-500 font-mono">
                    Error digest: {error.digest}
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={reset}
                  className="w-full bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white py-2.5 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try to Recover
                </button>
                <Link href="/">
                  <button
                    className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white py-2.5 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                  >
                    <Home className="w-4 h-4" />
                    Return Home
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
