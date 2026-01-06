import React from 'react';
import { MessageSquarePlus, History, Settings, LogOut } from 'lucide-react';

export default function Sidebar() {
    return (
        <aside className="fixed left-4 top-4 bottom-4 w-64 glass-panel rounded-2xl flex flex-col p-4 z-10 hidden md:flex transition-all duration-300">
            <div className="flex items-center gap-3 px-2 mb-8">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent-primary to-accent-secondary flex items-center justify-center">
                    <span className="text-white font-bold text-xs">AI</span>
                </div>
                <h1 className="font-bold text-lg tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-pink-200">
                    NextGen
                </h1>
            </div>

            <button className="glass-button w-full justify-center mb-6 py-3 font-semibold hover:bg-white/10">
                <MessageSquarePlus size={20} />
                New Chat
            </button>

            <div className="flex-1 overflow-y-auto pr-2 space-y-2 scrollbar-hide">
                <p className="text-xs font-medium text-gray-400 px-2 mb-2 uppercase tracking-wider">Recent</p>

                {/* Dummy History Items */}
                {['React Glassmorphism', 'Gemini API Setup', 'Marketing Copy'].map((item, i) => (
                    <button key={i} className="w-full text-left p-3 rounded-lg text-sm text-gray-300 hover:bg-white/5 transition-colors flex items-center gap-3 truncate">
                        <History size={16} className="shrink-0 opacity-50" />
                        <span className="truncate">{item}</span>
                    </button>
                ))}
            </div>

            <div className="pt-4 border-t border-white/10 mt-2 space-y-1">
                <button className="w-full text-left p-3 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-3">
                    <Settings size={18} />
                    Settings
                </button>
            </div>
        </aside>
    );
}
