import React, { useState, useEffect } from 'react';
import { User, LogOut, Settings, Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { AttractiveIcon } from '../Shared/AttractiveIcon';

interface SidebarFooterProps {
    user: any;
    isCollapsed: boolean;
    handleLogout: () => void;
}

export default function SidebarFooter({ user, isCollapsed, handleLogout }: SidebarFooterProps) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <div className="p-4 border-t border-white/5 mt-auto bg-black/20">
            {user ? (
                <div className={cn(
                    "w-full flex items-center gap-3 p-2 rounded-lg text-sm text-gray-400",
                    isCollapsed ? "justify-center flex-col gap-4" : "justify-between"
                )}>
                    <div className={cn("flex items-center gap-3 overflow-hidden", isCollapsed && "justify-center")}>
                        <AttractiveIcon 
                            icon={User} 
                            size={20} 
                            gradient={['#7c3aed', '#db2777']} 
                            glow 
                            strokeWidth={1.5}
                        />
                        {!isCollapsed && (
                            <div className="flex flex-col truncate">
                                <span className="text-white text-xs truncate">{user.email}</span>
                                <span className="text-[10px] text-gray-500">Free Plan</span>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleLogout}
                        className="text-gray-500 hover:text-red-400 hover:scale-110 active:scale-95 transition-all p-1"
                        title="Sign Out"
                    >
                        <AttractiveIcon icon={LogOut} size={16} strokeWidth={1.5} />
                    </button>
                </div>
            ) : (
                <a href="/login" className={cn(
                    "w-full text-left p-2 rounded-lg text-sm text-foreground opacity-70 hover:opacity-100 hover:bg-glass-shimmer transition-colors flex items-center gap-3",
                    isCollapsed && "justify-center"
                )}>
                    <AttractiveIcon icon={Settings} size={20} strokeWidth={1.5} />
                    {!isCollapsed && <span>Login / Profile</span>}
                </a>
            )}

            {/* Theme Toggle */}
            <button
                onClick={toggleTheme}
                className={cn(
                    "w-full mt-2 text-left p-2 rounded-lg text-sm text-foreground opacity-70 hover:opacity-100 hover:bg-glass-shimmer transition-colors flex items-center gap-3",
                    isCollapsed && "justify-center"
                )}
            >
                {mounted && (
                    theme === 'dark' 
                        ? <AttractiveIcon icon={Sun} size={20} gradient={['#fbbf24', '#f59e0b']} glow /> 
                        : <AttractiveIcon icon={Moon} size={20} gradient={['#6366f1', '#4f46e5']} glow />
                )}
                {!mounted && <div className="w-5 h-5 rounded-full bg-white/10 animate-pulse" />}
                {!isCollapsed && <span>{mounted ? (theme === 'dark' ? 'Light Mode' : 'Dark Mode') : 'Theme'}</span>}
            </button>
        </div>
    );
}
