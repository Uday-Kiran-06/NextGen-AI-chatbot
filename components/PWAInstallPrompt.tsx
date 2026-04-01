'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, MonitorSmartphone } from 'lucide-react';

export default function PWAInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
            // Delay showing prompt for better UX
            setTimeout(() => {
                if (!sessionStorage.getItem('pwa-prompt-dismissed')) {
                    setShowPrompt(true);
                }
            }, 3000);
        };

        window.addEventListener('beforeinstallprompt', handler);

        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
        }

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            setIsInstalled(true);
        }
        setShowPrompt(false);
        setDeferredPrompt(null);
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        sessionStorage.setItem('pwa-prompt-dismissed', 'true');
    };

    if (isInstalled || !showPrompt) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 100, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 100, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed bottom-24 left-4 right-4 md:left-auto md:right-4 md:w-80 z-[9999] rounded-2xl overflow-hidden"
                style={{
                    backgroundColor: 'var(--sidebar-bg)',
                    border: '1px solid var(--sidebar-border)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)'
                }}
            >
                <div className="p-4">
                    <div className="flex items-start gap-3">
                        <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                            style={{ backgroundColor: 'var(--accent-primary)' }}
                        >
                            <MonitorSmartphone className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--foreground)' }}>
                                Install NextGen AI
                            </h3>
                            <p className="text-xs leading-relaxed" style={{ color: 'var(--foreground)', opacity: 0.6 }}>
                                Add to your home screen for quick access and offline support.
                            </p>
                        </div>
                        <button
                            onClick={handleDismiss}
                            className="p-1.5 rounded-lg transition-colors hover:bg-[var(--sidebar-hover)]"
                            style={{ color: 'var(--foreground)', opacity: 0.5 }}
                        >
                            <X size={18} />
                        </button>
                    </div>
                    <div className="flex gap-2 mt-4">
                        <button
                            onClick={handleDismiss}
                            className="flex-1 px-4 py-2.5 text-sm font-medium rounded-xl transition-colors"
                            style={{ 
                                backgroundColor: 'var(--sidebar-hover)',
                                color: 'var(--foreground)'
                            }}
                        >
                            Not now
                        </button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleInstall}
                            className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl text-white flex items-center justify-center gap-2"
                            style={{ backgroundColor: 'var(--accent-primary)' }}
                        >
                            <Download size={16} />
                            Install
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
