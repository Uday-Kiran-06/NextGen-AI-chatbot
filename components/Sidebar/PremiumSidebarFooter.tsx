'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    User, LogOut, Settings, Sun, Moon, 
    ChevronRight, Shield, Bell,
    HelpCircle, CreditCard, LogIn, Award
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

interface PremiumSidebarFooterProps {
    user: any;
    isCollapsed: boolean;
    onLogout: () => void;
    onExpand?: () => void;
}

export default function PremiumSidebarFooter({ user, isCollapsed, onLogout, onExpand }: PremiumSidebarFooterProps) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    if (isCollapsed) {
        return (
            <div className="shrink-0 border-t p-2" style={{ 
                borderColor: 'var(--sidebar-border)',
                backgroundColor: 'var(--sidebar-bg)'
            }}>
                <div className="flex flex-col items-center gap-2">
                    {/* Settings Icon with Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => { onExpand?.(); setShowSettings(!showSettings); }}
                            className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
                            style={{ 
                                backgroundColor: showSettings ? 'var(--accent-primary)' : 'var(--sidebar-hover)',
                                color: showSettings ? 'white' : 'var(--foreground)'
                            }}
                        >
                            <Settings className="w-4 h-4" />
                        </button>
                        <AnimatePresence>
                            {showSettings && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10, scale: 0.95 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    exit={{ opacity: 0, x: -10, scale: 0.95 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute left-full top-0 ml-2 w-48 rounded-lg shadow-lg overflow-hidden z-50"
                                    style={{ backgroundColor: 'var(--sidebar-bg)', border: '1px solid var(--sidebar-border)' }}
                                >
                                    <div className="p-2 space-y-0.5">
                                        <button className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors hover:bg-[var(--sidebar-hover)]" style={{ color: 'var(--foreground)', opacity: 0.8 }}>
                                            <Bell className="w-4 h-4" />
                                            <span className="text-xs font-medium">Notifications</span>
                                        </button>
                                        <button className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors hover:bg-[var(--sidebar-hover)]" style={{ color: 'var(--foreground)', opacity: 0.8 }}>
                                            <Shield className="w-4 h-4" />
                                            <span className="text-xs font-medium">Privacy & Security</span>
                                        </button>
                                        <button className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors hover:bg-[var(--sidebar-hover)]" style={{ color: 'var(--foreground)', opacity: 0.8 }}>
                                            <HelpCircle className="w-4 h-4" />
                                            <span className="text-xs font-medium">Help & Support</span>
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Theme Toggle */}
                    <button
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
                        style={{ backgroundColor: 'var(--sidebar-hover)', color: 'var(--foreground)' }}
                    >
                        {mounted ? (
                            theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />
                        ) : (
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: 'var(--foreground)', opacity: 0.2 }} />
                        )}
                    </button>

                    {/* User / Sign In */}
                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() => { onExpand?.(); setShowSettings(!showSettings); }}
                                className="w-9 h-9 rounded-lg flex items-center justify-center transition-transform hover:scale-105"
                                style={{ backgroundColor: 'var(--accent-primary)', color: 'white' }}
                            >
                                <User className="w-4 h-4" />
                            </button>
                            <AnimatePresence>
                                {!showSettings && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -10, scale: 0.95 }}
                                        animate={{ opacity: 1, x: 0, scale: 1 }}
                                        exit={{ opacity: 0, x: -10, scale: 0.95 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute left-full top-0 ml-2 w-40 rounded-lg shadow-lg overflow-hidden z-50"
                                        style={{ backgroundColor: 'var(--sidebar-bg)', border: '1px solid var(--sidebar-border)' }}
                                    >
                                        <div className="p-2">
                                            <p className="text-xs font-medium px-2 py-1 truncate" style={{ color: 'var(--foreground)' }}>
                                                {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
                                            </p>
                                            <p className="text-[10px] px-2 py-1 truncate" style={{ color: 'var(--foreground)', opacity: 0.5 }}>
                                                {user.email}
                                            </p>
                                            <div className="mt-2 pt-2 border-t" style={{ borderColor: 'var(--sidebar-border)' }}>
                                                <a href="/login" className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors hover:bg-[var(--sidebar-hover)]" style={{ color: 'var(--foreground)', opacity: 0.8 }}>
                                                    <Settings className="w-4 h-4" />
                                                    <span className="text-xs font-medium">Profile</span>
                                                </a>
                                                <button
                                                    onClick={onLogout}
                                                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors hover:bg-[var(--sidebar-hover)]"
                                                    style={{ color: '#ef4444' }}
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    <span className="text-xs font-medium">Sign Out</span>
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <a href="/login" className="w-9 h-9 rounded-lg flex items-center justify-center transition-transform hover:scale-105" style={{ backgroundColor: 'var(--accent-primary)', color: 'white' }}>
                            <LogIn className="w-4 h-4" />
                        </a>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="shrink-0 border-t" style={{ 
            borderColor: 'var(--sidebar-border)',
            backgroundColor: 'var(--sidebar-bg)'
        }}>
            {/* Settings Panel */}
            <AnimatePresence>
                {showSettings && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="overflow-hidden"
                    >
                        <div className="p-3 border-b" style={{ borderColor: 'var(--sidebar-border)', backgroundColor: 'var(--sidebar-hover)' }}>
                            <h3 className="text-xs font-semibold" style={{ color: 'var(--foreground)' }}>Settings</h3>
                        </div>
                        <div className="p-2 space-y-0.5" style={{ backgroundColor: 'var(--sidebar-hover)' }}>
                            <SettingsOption icon={Bell} label="Notifications" />
                            <SettingsOption icon={Shield} label="Privacy & Security" />
                            <SettingsOption icon={HelpCircle} label="Help & Support" />
                            <SettingsOption icon={CreditCard} label="Subscription" badge="Pro" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="p-3 space-y-1">
                {/* Settings Toggle */}
                <button
                    onClick={() => setShowSettings(!showSettings)}
                    className={cn(
                        "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-colors",
                        showSettings 
                            ? "bg-[var(--sidebar-hover)]" 
                            : "hover:bg-[var(--sidebar-hover)]"
                    )}
                    style={{ color: 'var(--foreground)' }}
                >
                    <Settings className="w-4 h-4" />
                    <span className="flex-1 text-left text-xs font-medium">Settings</span>
                    <ChevronRight className={cn("w-3.5 h-3.5 transition-transform", showSettings && "rotate-90")} />
                </button>

                {/* Theme Toggle */}
                <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm hover:bg-[var(--sidebar-hover)] transition-colors"
                    style={{ color: 'var(--foreground)', opacity: 0.7 }}
                >
                    {mounted ? (
                        theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />
                    ) : (
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: 'var(--foreground)', opacity: 0.2 }} />
                    )}
                    <span className="text-xs font-medium">{mounted ? (theme === 'dark' ? 'Light Mode' : 'Dark Mode') : 'Theme'}</span>
                </button>

                {/* User Section */}
                {user ? (
                    <div className="mt-2 p-3 rounded-lg" style={{ backgroundColor: 'var(--sidebar-hover)' }}>
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--accent-primary)' }}>
                                <User className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate" style={{ color: 'var(--foreground)' }}>
                                    {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
                                </p>
                                <p className="text-[11px] truncate" style={{ color: 'var(--foreground)', opacity: 0.5 }}>{user.email}</p>
                            </div>
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                            <a 
                                href="/login"
                                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
                                style={{ color: 'var(--foreground)', opacity: 0.6 }}
                            >
                                <Settings className="w-3.5 h-3.5" />
                                Profile
                            </a>
                            <button
                                onClick={onLogout}
                                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
                                style={{ color: '#ef4444' }}
                            >
                                <LogOut className="w-3.5 h-3.5" />
                                Sign Out
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="mt-2">
                        <a
                            href="/login"
                            className="flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg text-xs font-semibold text-white transition-all hover:scale-[1.02]"
                            style={{ backgroundColor: 'var(--accent-primary)' }}
                        >
                            <LogIn className="w-4 h-4" />
                            <span>Get Started</span>
                        </a>
                        <p className="text-[10px] text-center mt-2" style={{ color: 'var(--foreground)', opacity: 0.4 }}>
                            Sign in to save your conversations
                        </p>
                    </div>
                )}

                {/* Premium Badge */}
                <div className="mt-3 flex items-center justify-center">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ backgroundColor: 'var(--sidebar-hover)' }}>
                        <Award className="w-3 h-3" style={{ color: 'var(--accent-primary)' }} />
                        <span className="text-[10px] font-medium" style={{ color: 'var(--foreground)', opacity: 0.5 }}>Powered by NextGen AI</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SettingsOption({ 
    icon: Icon, 
    label, 
    badge 
}: { 
    icon: React.ElementType; 
    label: string; 
    badge?: string;
}) {
    return (
        <button className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm hover:bg-[var(--sidebar-hover)] transition-colors" style={{ color: 'var(--foreground)', opacity: 0.7 }}>
            <Icon className="w-4 h-4" />
            <span className="flex-1 text-left text-xs font-medium">{label}</span>
            {badge && (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold text-white" style={{ backgroundColor: 'var(--accent-primary)' }}>
                    {badge}
                </span>
            )}
        </button>
    );
}
