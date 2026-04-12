import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AttractiveIcon } from '../Shared/AttractiveIcon';
import { cn } from '@/lib/utils';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

interface ImageViewerProps {
    src: string;
    alt: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function ImageViewer({ src, alt, isOpen, onClose }: ImageViewerProps) {
    const [isDownloading, setIsDownloading] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent body scrolling when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const handleDownload = async () => {
        // ... (rest of the logic)
        try {
            setIsDownloading(true);
            const response = await fetch(src);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `image-${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Failed to download image:', error);
        } finally {
            setIsDownloading(false);
        }
    };

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/95 backdrop-blur-2xl px-4 py-8 md:p-12 overflow-hidden"
                >
                    {/* Top Action Bar */}
                    <div className="absolute top-0 left-0 right-0 p-4 md:p-6 flex justify-between items-center z-50 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
                        <button
                            onClick={(e) => { e.stopPropagation(); onClose(); }}
                            className="p-2.5 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-all text-white pointer-events-auto active:scale-95"
                        >
                            <AttractiveIcon icon={X} size={20} gradient={['#ef4444', '#b91c1c']} glow />
                        </button>

                        <div className="flex items-center gap-3 pointer-events-auto">
                            <motion.button
                                initial="initial"
                                whileHover="hover"
                                onClick={(e) => { e.stopPropagation(); handleDownload(); }}
                                className={cn(
                                    "flex items-center bg-white/10 hover:bg-accent-primary/20 rounded-full backdrop-blur-md transition-colors border border-white/10 hover:border-accent-primary/30 text-white active:scale-95 group overflow-hidden px-2.5 py-2.5 hover:px-4",
                                    isDownloading && "animate-pulse"
                                )}
                            >
                                <div className="flex items-center gap-0 group-hover:gap-2">
                                    <AttractiveIcon 
                                        icon={Download} 
                                        size={20} 
                                        gradient={['#06b6d4', '#3b82f6']} 
                                        glow 
                                    />
                                    <motion.span
                                        variants={{
                                            initial: { width: 0, opacity: 0, x: -10 },
                                            hover: { width: 'auto', opacity: 1, x: 0 }
                                        }}
                                        transition={{ duration: 0.3, ease: "easeOut" }}
                                        className="text-[11px] font-bold tracking-wider uppercase whitespace-nowrap"
                                    >
                                        Download
                                    </motion.span>
                                </div>
                            </motion.button>
                        </div>
                    </div>

                    {/* Main Image Viewport using react-zoom-pan-pinch */}
                    <div className="w-full h-full flex items-center justify-center overflow-hidden">
                        <TransformWrapper
                            initialScale={1}
                            minScale={0.5}
                            maxScale={8}
                            centerZoomedOut={true}
                            wheel={{ step: 0.1 }}
                            doubleClick={{ step: 2 }}
                        >
                            {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                                <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }} contentStyle={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={src}
                                        alt={alt || "Viewed image"}
                                        className="max-w-full max-h-screen object-contain rounded-xl shadow-[0_0_80px_rgba(0,0,0,0.5)] select-none"
                                        draggable={false}
                                    />
                                </TransformComponent>
                            )}
                        </TransformWrapper>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
}
