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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState<'signin' | 'signup'>('signin');
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();
    const [cooldown, setCooldown] = useState(0);



    const validateForm = () => {
        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            setError('Please enter a valid email address.');
            return false;
        }
        if (password.length < 6) {
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
                    setError('Check your email for the confirmation link.');
                }
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
                    <Card className="glass-panel border-white/10 shadow-2xl backdrop-blur-xl bg-black/40">
                        <CardHeader className="space-y-4 items-center text-center pb-2">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-accent to-violet-600 flex items-center justify-center shadow-[0_0_20px_-5px_var(--accent)] ring-1 ring-white/20">
                                <Sparkles size={32} className="text-white drop-shadow-md" />
                            </div>
                            <div className="space-y-1">
                                <CardTitle className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-400">
                                    {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
                                </CardTitle>
                                <CardDescription className="text-muted-foreground">
                                    {mode === 'signin'
                                        ? 'Enter your credentials to access your workspace'
                                        : 'Sign up to start your cognitive journey'}
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-4">
                            <form onSubmit={handleAuth} className="space-y-4">
                                {mode === 'signup' && (
                                    <div className="space-y-2">
                                        <div className="relative group">
                                            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-white transition-colors" />
                                            <Input
                                                type="text"
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                placeholder="Full Name"
                                                className="pl-10 bg-white/5 border-white/10 focus:bg-white/10"
                                                required
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <div className="relative group">
                                        <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-white transition-colors" />
                                        <Input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Email address"
                                            className="pl-10 bg-white/5 border-white/10 focus:bg-white/10"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="relative group">
                                        <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-white transition-colors" />
                                        <Input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Password"
                                            className="pl-10 bg-white/5 border-white/10 focus:bg-white/10"
                                            required
                                            minLength={6}
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="text-destructive text-xs bg-destructive/10 border border-destructive/20 p-2.5 rounded-lg text-center font-medium"
                                    >
                                        {error}
                                    </motion.div>
                                )}

                                <Button
                                    type="submit"
                                    disabled={loading || cooldown > 0}
                                    className="w-full bg-gradient-to-r from-accent to-violet-600 hover:opacity-90 transition-all shadow-[0_0_20px_-5px_var(--accent)]"
                                    size="lg"
                                >
                                    {loading ? <Loader2 size={18} className="animate-spin" /> :
                                        cooldown > 0 ? `Wait ${cooldown}s` :
                                            (mode === 'signin' ? 'Sign In' : 'Sign Up')}
                                </Button>
                            </form>

                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/10"></div>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-[#0a0a0a] px-2 text-muted-foreground border border-white/10 rounded-full">Or continue with</span>
                                </div>
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleOAuth('github')}
                                className="w-full gap-2 border-white/10 hover:bg-white/5 bg-transparent"
                            >
                                <Github size={18} />
                                GitHub
                            </Button>
                        </CardContent>
                        <CardFooter className="justify-center pb-6">
                            <div className="text-center text-sm text-muted-foreground">
                                {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
                                <button
                                    onClick={() => {
                                        setMode(mode === 'signin' ? 'signup' : 'signin');
                                        setError(null);
                                    }}
                                    className="text-accent hover:text-white font-medium transition-colors underline underline-offset-4"
                                >
                                    {mode === 'signin' ? 'Sign Up' : 'Sign In'}
                                </button>
                            </div>
                        </CardFooter>
                    </Card>
                </motion.div>
            </div>
        </AuroraBackground>
    );
}
