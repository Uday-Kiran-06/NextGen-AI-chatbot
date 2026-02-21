'use client';

import { useState } from 'react';
import { Sparkle } from '@phosphor-icons/react/dist/csr/Sparkle';
import { Envelope } from '@phosphor-icons/react/dist/csr/Envelope';
import { Lock } from '@phosphor-icons/react/dist/csr/Lock';
import { CircleNotch } from '@phosphor-icons/react/dist/csr/CircleNotch';
import { User } from '@phosphor-icons/react/dist/csr/User';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
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

    return (
        <main className="relative flex flex-col min-h-screen w-full bg-background text-slate-950 overflow-hidden">
            {/* Lightweight CSS aurora effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -inset-[10px] opacity-20 will-change-transform"
                    style={{
                        backgroundImage: `repeating-linear-gradient(100deg, var(--primary) 10%, var(--secondary) 15%, #1b4332 20%, #0f2e21 25%, #2d6a4f 30%)`,
                        backgroundSize: '200% 100%',
                        filter: 'blur(10px)',
                        maskImage: 'radial-gradient(ellipse at 100% 0%, black 10%, transparent 70%)',
                    }}
                />
            </div>

            <div className="flex min-h-screen items-center justify-center p-4 relative z-10">
                <div
                    className="w-full max-w-md animate-[fadeInUp_0.5s_ease-out_both]"
                >
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center mb-4 shadow-md shadow-primary/10">
                            <Sparkle size={24} className="text-primary" weight="fill" />
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
                                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" weight="bold" />
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="Full Name"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-300 ml-1">Email</label>
                            <div className="relative">
                                <Envelope size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" weight="bold" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {mode !== 'forgot-password' && (
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-300 ml-1">Password</label>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" weight="bold" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                                        required
                                        minLength={6}
                                    />
                                </div>
                            </div>
                        )}

                        {error && (
                            <div
                                className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 p-2.5 rounded-lg text-center font-medium animate-[fadeIn_0.3s_ease-out_both]"
                            >
                                {error}
                            </div>
                        )}

                        {message && (
                            <div
                                className="text-green-400 text-xs bg-green-500/10 border border-green-500/20 p-2 rounded-lg text-center animate-[fadeIn_0.3s_ease-out_both]"
                            >
                                {message}
                            </div>
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
                            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-xl transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <CircleNotch size={18} className="animate-spin" weight="bold" />
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

                    <div className="mt-8 text-center text-sm text-gray-400">
                        {mode === 'forgot-password' ? (
                            <button
                                onClick={() => {
                                    setMode('signin');
                                    setError(null);
                                    setMessage(null);
                                }}
                                className="text-primary hover:text-primary/80 font-medium transition-colors"
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
                                    className="text-primary hover:text-primary/80 font-medium transition-colors"
                                >
                                    {mode === 'signin' ? 'Sign Up' : 'Sign In'}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
