'use client';

import Link from 'next/link';
import { Home, ArrowLeft, Search, MessageSquare } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-950/20 via-transparent to-pink-950/20" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-transparent to-transparent" />
      
      <div className="relative z-10 w-full max-w-lg text-center">
        <div className="mb-8">
          <h1 className="text-[120px] font-bold leading-none bg-gradient-to-b from-slate-700 to-slate-800 bg-clip-text text-transparent">
            404
          </h1>
        </div>

        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="p-4 rounded-2xl bg-violet-500/10 inline-flex mb-4">
            <Search className="w-8 h-8 text-violet-400" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-3">
            Page Not Found
          </h2>
          <p className="text-slate-400 mb-6">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <Link href="/">
              <button className="w-full bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white py-2.5 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2">
                <Home className="w-4 h-4" />
                Home
              </button>
            </Link>
            <button
              onClick={() => window.history.back()}
              className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white py-2.5 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          </div>

          <div className="pt-4 border-t border-white/5">
            <Link 
              href="/"
              className="inline-flex items-center justify-center text-sm text-slate-400 hover:text-violet-400 transition-colors"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Start a new conversation
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
