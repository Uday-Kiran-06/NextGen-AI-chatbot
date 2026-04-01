'use client';

import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-950/20 via-transparent to-pink-950/20" />
      
      <div className="relative z-10 flex flex-col items-center gap-4">
        <div className="p-4 rounded-2xl bg-violet-500/10">
          <Loader2 className="w-10 h-10 text-violet-400 animate-spin" />
        </div>
        <p className="text-slate-400 text-sm">Loading...</p>
      </div>
    </div>
  );
}
