'use client';

import React, { useState } from 'react';
import { AuroraBackground } from '@/components/UI/AuroraBackground';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, Github, Chrome, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [view, setView] = useState<'login' | 'signup' | 'forgot_password'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const router = useRouter();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            if (view === 'signup') {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                setSuccessMessage('Check your email for the confirmation link!');
            } else if (view === 'login') {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                router.push('/');
            } else if (view === 'forgot_password') {
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${window.location.origin}/update-password`,
                });
                if (error) throw error;
                setSuccessMessage('Password reset link sent to your email!');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuroraBackground showRadialGradient={true}>
            <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md glass-panel p-8 rounded-3xl border-t border-white/20 shadow-2xl relative overflow-hidden"
                >
                    {/* Ambient Glow */}
                    <div className="absolute -top-20 -left-20 w-40 h-40 bg-accent-primary/30 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-accent-secondary/30 rounded-full blur-3xl pointer-events-none" />

                    <div className="text-center mb-8 relative z-10">
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 mb-2">
                            {view === 'signup' ? 'Create Account' : view === 'forgot_password' ? 'Reset Password' : 'Welcome Back'}
                        </h1>
                        <p className="text-gray-400 text-sm">
                            {view === 'signup' ? 'Join the future of AI conversation' :
                                view === 'forgot_password' ? 'Enter your email to receive a reset link' :
                                    'Enter your credentials to access your chats'}
                        </p>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-4 relative z-10">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-300 ml-1">Email</label>
                            <div className="relative group">
                                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-accent-primary transition-colors" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-primary/50 transition-all"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        {view !== 'forgot_password' && (
                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-xs font-medium text-gray-300">Password</label>
                                    {view === 'login' && (
                                        <button
                                            type="button"
                                            onClick={() => setView('forgot_password')}
                                            className="text-xs text-accent-primary hover:text-accent-secondary transition-colors"
                                        >
                                            Forgot Password?
                                        </button>
                                    )}
                                </div>
                                <div className="relative group">
                                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-accent-primary transition-colors" />
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-primary/50 transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        )}

                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="text-red-400 text-xs text-center bg-red-500/10 p-2 rounded-lg border border-red-500/20"
                                >
                                    {error}
                                </motion.div>
                            )}
                            {successMessage && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="text-green-400 text-xs text-center bg-green-500/10 p-2 rounded-lg border border-green-500/20"
                                >
                                    {successMessage}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button
                            type="submit"
                            disabled={loading || (view === 'forgot_password' && successMessage !== null)}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-accent-primary to-accent-secondary text-white font-semibold shadow-lg shadow-accent-primary/25 hover:shadow-accent-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
                        >
                            {loading ? <Loader2 size={20} className="animate-spin" /> : (
                                <>
                                    {view === 'signup' ? 'Sign Up' : view === 'forgot_password' ? 'Send Reset Link' : 'Sign In'}
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center space-y-2">
                        <p className="text-sm text-gray-400">
                            {view === 'signup' ? 'Already have an account?' :
                                view === 'forgot_password' ? 'Remember your password?' :
                                    "Don't have an account?"}
                            <button
                                onClick={() => setView(view === 'login' ? 'signup' : 'login')}
                                className="ml-2 text-accent-primary hover:text-accent-secondary font-medium transition-colors"
                            >
                                {view === 'login' ? 'Sign Up' : 'Sign In'}
                            </button>
                        </p>
                    </div>

                    {view !== 'forgot_password' && (
                        <div className="mt-8 pt-6 border-t border-white/10">
                            <div className="flex gap-4 justify-center">
                                <button className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-white border border-white/5 hover:border-white/20">
                                    <Github size={20} />
                                </button>
                                <button className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-white border border-white/5 hover:border-white/20">
                                    <Chrome size={20} />
                                </button>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </AuroraBackground>
    );
}
