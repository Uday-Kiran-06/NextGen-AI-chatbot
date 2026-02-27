import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageViewerProps {
    src: string;
    alt: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function ImageViewer({ src, alt, isOpen, onClose }: ImageViewerProps) {
    const [scale, setScale] = useState(1);
    const [isDownloading, setIsDownloading] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const initialDistance = useRef<number | null>(null);
    const initialScale = useRef(1);

    // Reset zoom state when closing/opening
    useEffect(() => {
        if (!isOpen) {
            setScale(1);
            initialDistance.current = null;
        }
    }, [isOpen]);

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

    const handleWheel = useCallback((e: WheelEvent) => {
        if (!isOpen) return;
        e.preventDefault();
        const delta = e.deltaY;
        setScale(prev => {
            const newScale = delta < 0 ? prev + 0.2 : prev - 0.2;
            return Math.min(Math.max(newScale, 1), 5);
        });
    }, [isOpen]);

    const handleTouchStart = useCallback((e: TouchEvent) => {
        if (e.touches.length === 2) {
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const dist = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
            initialDistance.current = dist;
            initialScale.current = scale;
        }
    }, [scale]);

    const handleTouchMove = useCallback((e: TouchEvent) => {
        if (e.touches.length === 2 && initialDistance.current !== null) {
            e.preventDefault();
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const dist = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
            const ratio = dist / initialDistance.current;
            const newScale = initialScale.current * ratio;
            setScale(Math.min(Math.max(newScale, 1), 5));
        }
    }, []);

    const handleTouchEnd = useCallback(() => {
        initialDistance.current = null;
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        if (container && isOpen) {
            container.addEventListener('wheel', handleWheel, { passive: false });
            container.addEventListener('touchstart', handleTouchStart);
            container.addEventListener('touchmove', handleTouchMove, { passive: false });
            container.addEventListener('touchend', handleTouchEnd);
            return () => {
                container.removeEventListener('wheel', handleWheel);
                container.removeEventListener('touchstart', handleTouchStart);
                container.removeEventListener('touchmove', handleTouchMove);
                container.removeEventListener('touchend', handleTouchEnd);
            };
        }
    }, [isOpen, handleWheel, handleTouchStart, handleTouchMove, handleTouchEnd]);

    const handleDownload = async () => {
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

    const handleDoubleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setScale(prev => (prev > 1 ? 1 : 2));
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    ref={containerRef}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-2xl px-4 py-8 md:p-12"
                    onClick={onClose}
                >
                    {/* Top Action Bar */}
                    <div className="absolute top-0 left-0 right-0 p-4 md:p-6 flex justify-between items-center z-50 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
                        <button
                            onClick={(e) => { e.stopPropagation(); onClose(); }}
                            className="p-2.5 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-all text-white pointer-events-auto active:scale-95"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex items-center gap-3 pointer-events-auto">
                            <button
                                onClick={(e) => { e.stopPropagation(); handleDownload(); }}
                                className={cn(
                                    "p-2.5 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-all text-white active:scale-95",
                                    isDownloading && "animate-pulse"
                                )}
                            >
                                <Download size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Main Image Viewport */}
                    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                        <motion.div
                            animate={{ scale }}
                            transition={{ type: "spring", damping: 30, stiffness: 250 }}
                            drag={scale > 1}
                            dragConstraints={containerRef}
                            dragElastic={0.1}
                            onDoubleClick={handleDoubleClick}
                            className="relative cursor-grab active:cursor-grabbing max-w-full max-h-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Swipe to dismiss only works at scale 1 */}
                            {scale === 1 && (
                                <motion.div
                                    drag="y"
                                    dragConstraints={{ top: 0, bottom: 0 }}
                                    dragElastic={0.8}
                                    onDragEnd={(_, info) => {
                                        if (Math.abs(info.offset.y) > 100 || Math.abs(info.velocity.y) > 500) {
                                            onClose();
                                        }
                                    }}
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={src}
                                        alt={alt || "Viewed image"}
                                        className="max-w-full max-h-screen object-contain rounded-xl shadow-[0_0_80px_rgba(0,0,0,0.5)] select-none pointer-events-none"
                                        draggable={false}
                                    />
                                </motion.div>
                            )}

                            {scale > 1 && (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img
                                    src={src}
                                    alt={alt || "Viewed image"}
                                    className="max-w-[none] max-h-screen object-contain rounded-lg shadow-2xl select-none"
                                    draggable={false}
                                />
                            )}
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
