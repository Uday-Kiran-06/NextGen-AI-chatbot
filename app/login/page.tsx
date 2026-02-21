'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Mail, Lock, Loader2, Github, User } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AuroraBackground } from '@/components/ui/AuroraBackground';
import { cn } from '@/lib/utils';
import { getFriendlyErrorMessage } from '@/lib/utils/auth-error';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState<'signin' | 'signup' | 'forgot-password'>('signin');
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();
    const [cooldown, setCooldown] = useState(0);

    const validateForm = () => {
        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            setError('Please enter a valid email address.');
            return false;
        }
        if (mode !== 'forgot-password' && password.length < 6) {
            setError('Password must be at least 6 characters.');
            return false;
        }
        if (mode === 'signup' && !fullName.trim()) {
            setError('Full Name is required for signup.');
            return false;
        }
        return true;
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        if (loading || cooldown > 0) return;

        if (!validateForm()) return;

        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            if (mode === 'signup') {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${location.origin}/auth/callback`,
                        data: {
                            full_name: fullName,
                        }
                    },
                });
                if (error) throw error;

                if (data.session) {
                    router.push('/');
                    router.refresh();
                } else {
                    setMessage('Check your email for the confirmation link.');
                }
            } else if (mode === 'forgot-password') {
                const response = await fetch('/api/send-reset', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email }),
                });

                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.error || 'Failed to send reset email');
                }

                setMessage('Check your email for the password reset link.');
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                router.push('/');
                router.refresh();
            }
        } catch (err: any) {
            setError(getFriendlyErrorMessage(err.message));
            setCooldown(3);
            const timer = setInterval(() => {
                setCooldown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } finally {
            setLoading(false);
        }
    };

    const handleOAuth = async (provider: 'github' | 'google') => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: `${location.origin}/auth/callback`,
                },
            });
            if (error) throw error;
        } catch (err: any) {
            const msg = getFriendlyErrorMessage(err.message);
            setError(msg);
            toast.error(msg);
        }
    };

    return (
        <AuroraBackground>
            <div className="flex min-h-screen items-center justify-center p-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.5, type: 'spring' }}
                    className="w-full max-w-md"
                >
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-accent-primary to-accent-secondary flex items-center justify-center mb-4 shadow-lg shadow-accent-primary/20">
                            <Sparkles size={24} className="text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">
                            {mode === 'signin' ? 'Welcome Back' : mode === 'signup' ? 'Create Account' : 'Reset Password'}
                        </h1>
                        <p className="text-gray-400 text-sm text-center">
                            {mode === 'signin'
                                ? 'Enter your credentials to access your chat history'
                                : mode === 'signup'
                                    ? 'Sign up to start your AI journey'
                                    : 'Enter your email to receive a password reset link'}
                        </p>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-4">
                        {mode === 'signup' && (
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-300 ml-1">Full Name</label>
                                <div className="relative">
                                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="Full Name"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-accent-primary/50 transition-all"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-300 ml-1">Email</label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-accent-primary/50 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {mode !== 'forgot-password' && (
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-300 ml-1">Password</label>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-accent-primary/50 transition-all"
                                        required
                                        minLength={6}
                                    />
                                </div>
                            </div>
                        )}

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 p-2.5 rounded-lg text-center font-medium"
                            >
                                {error}
                            </motion.div>
                        )}

                        {message && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="text-green-400 text-xs bg-green-500/10 border border-green-500/20 p-2 rounded-lg text-center"
                            >
                                {message}
                            </motion.div>
                        )}

                        {mode === 'signin' && (
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setMode('forgot-password');
                                        setError(null);
                                        setMessage(null);
                                    }}
                                    className="text-xs text-gray-400 hover:text-white transition-colors"
                                >
                                    Forgot Password?
                                </button>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || cooldown > 0}
                            className="w-full bg-gradient-to-r from-accent-primary to-accent-secondary hover:opacity-90 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-accent-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : cooldown > 0 ? (
                                `Wait ${cooldown}s`
                            ) : mode === 'signin' ? (
                                'Sign In'
                            ) : mode === 'signup' ? (
                                'Sign Up'
                            ) : (
                                'Send Reset Link'
                            )}
                        </button>
                    </form>

                    {mode !== 'forgot-password' && (
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/10"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-black/40 px-2 text-gray-500">Or continue with</span>
                            </div>
                        </div>
                    )}

                    {mode !== 'forgot-password' && (
                        <div className="grid grid-cols-1 gap-3">
                            <button
                                onClick={() => handleOAuth('github')}
                                className="flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-all text-sm font-medium"
                            >
                                <Github size={18} />
                                GitHub
                            </button>
                        </div>
                    )}

                    <div className="mt-8 text-center text-sm text-gray-400">
                        {mode === 'forgot-password' ? (
                            <button
                                onClick={() => {
                                    setMode('signin');
                                    setError(null);
                                    setMessage(null);
                                }}
                                className="text-accent-primary hover:text-accent-secondary font-medium transition-colors"
                            >
                                Back to Sign In
                            </button>
                        ) : (
                            <>
                                {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
                                <button
                                    onClick={() => {
                                        setMode(mode === 'signin' ? 'signup' : 'signin');
                                        setError(null);
                                        setMessage(null);
                                    }}
                                    className="text-accent-primary hover:text-accent-secondary font-medium transition-colors"
                                >
                                    {mode === 'signin' ? 'Sign Up' : 'Sign In'}
                                </button>
                            </>
                        )}
                    </div>
                </motion.div>
            </div>
        </AuroraBackground>
    );
}
