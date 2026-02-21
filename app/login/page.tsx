'use client';

import { useState } from 'react';
import { Sparkle } from '@phosphor-icons/react/dist/csr/Sparkle';
import { CircleNotch } from '@phosphor-icons/react/dist/csr/CircleNotch';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { getFriendlyErrorMessage } from '@/lib/utils/auth-error';
import { useRateLimit } from '@/lib/hooks/useRateLimit';

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
    const { isRateLimited, cooldownSeconds, startCooldown } = useRateLimit(3);

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
        if (loading || isRateLimited) return;

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
            startCooldown();
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="relative flex flex-col min-h-screen w-full bg-slate-950 text-slate-50 overflow-hidden">
            {/* Ambient background glow to replace the expensive aurora effect */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-slate-950 to-slate-950 pointer-events-none" />

            <div className="flex min-h-screen items-center justify-center p-4 relative z-10">
                <div className="w-full max-w-sm animate-[fadeInUp_0.5s_ease-out_both] bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8 shadow-2xl">
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                            <Sparkle size={24} className="text-primary" weight="fill" />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">
                            {mode === 'signin' ? 'Welcome back' : mode === 'signup' ? 'Create an account' : 'Reset password'}
                        </h1>
                        <p className="text-slate-400 text-sm text-center">
                            {mode === 'signin'
                                ? 'Enter your details to continue'
                                : mode === 'signup'
                                    ? 'Sign up to start your AI journey'
                                    : 'Enter your email to receive a reset link'}
                        </p>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-4">
                        {mode === 'signup' && (
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-300">Full Name</label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Jane Doe"
                                    className="w-full bg-slate-900/50 rounded-lg py-2.5 px-4 text-sm text-white placeholder-slate-500 focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors border border-white/5"
                                    required
                                />
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-300">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                className="w-full bg-slate-900/50 rounded-lg py-2.5 px-4 text-sm text-white placeholder-slate-500 focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors border border-white/5"
                                required
                            />
                        </div>

                        {mode !== 'forgot-password' && (
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium text-slate-300">Password</label>
                                    {mode === 'signin' && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setMode('forgot-password');
                                                setError(null);
                                                setMessage(null);
                                            }}
                                            className="text-xs text-primary hover:text-primary/80 transition-colors font-medium"
                                        >
                                            Forgot password?
                                        </button>
                                    )}
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-slate-900/50 rounded-lg py-2.5 px-4 text-sm text-white placeholder-slate-500 focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors border border-white/5"
                                    required
                                    minLength={6}
                                />
                            </div>
                        )}

                        {error && (
                            <div className="text-red-400 text-xs bg-red-500/10 p-2.5 rounded-lg text-center font-medium">
                                {error}
                            </div>
                        )}

                        {message && (
                            <div className="text-green-400 text-xs bg-green-500/10 p-2.5 rounded-lg text-center font-medium">
                                {message}
                            </div>
                        )}

                        <div className="pt-2">

                        <button
                            type="submit"
                            disabled={loading || isRateLimited}
                            className="w-full bg-white text-slate-900 hover:bg-slate-200 font-medium text-sm py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <CircleNotch size={16} className="animate-spin" weight="bold" />
                            ) : isRateLimited ? (
                                `Wait ${cooldownSeconds}s`
                            ) : mode === 'signin' ? (
                                'Sign In'
                            ) : mode === 'signup' ? (
                                'Sign Up'
                            ) : (
                                'Send Reset Link'
                            )}
                        </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center text-sm text-slate-400">
                        {mode === 'forgot-password' ? (
                            <button
                                onClick={() => {
                                    setMode('signin');
                                    setError(null);
                                    setMessage(null);
                                }}
                                className="text-white hover:text-slate-300 font-medium transition-colors ml-1"
                            >
                                Back to sign in
                            </button>
                        ) : (
                            <>
                                {mode === 'signin' ? "Don't have an account?" : "Already have an account?"}
                                <button
                                    onClick={() => {
                                        setMode(mode === 'signin' ? 'signup' : 'signin');
                                        setError(null);
                                        setMessage(null);
                                    }}
                                    className="text-white hover:text-slate-300 font-medium transition-colors ml-1"
                                >
                                    {mode === 'signin' ? 'Sign up' : 'Sign in'}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
