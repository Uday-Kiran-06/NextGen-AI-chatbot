import React from 'react';
import { SignOut } from '@phosphor-icons/react/dist/csr/SignOut';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface LogoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const LogoutModal = ({ isOpen, onClose, onConfirm }: LogoutModalProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="relative z-10 w-full max-w-sm"
                    >
                        <Card className="border-white/10 bg-[#0a0a0a] shadow-2xl ring-1 ring-white/10">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-destructive">
                                    <SignOut size={20} weight="bold" />
                                    Confirm Logout
                                </CardTitle>
                                <CardDescription>
                                    Are you sure you want to sign out? You will need to sign in again to access your history.
                                </CardDescription>
                            </CardHeader>
                            <CardFooter className="flex gap-3 justify-end">
                                <Button variant="ghost" onClick={onClose}>
                                    Cancel
                                </Button>
                                <Button variant="destructive" onClick={onConfirm} className="gap-2">
                                    Sign Out
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
