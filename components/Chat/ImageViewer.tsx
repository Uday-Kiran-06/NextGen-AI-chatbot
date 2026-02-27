import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { X, Download, ZoomIn, ZoomOut, Maximize, RotateCcw } from 'lucide-react';
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

    // Reset zoom state when closing/opening
    useEffect(() => {
        if (!isOpen) {
            setScale(1);
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

    const handleZoomIn = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setScale(prev => Math.min(prev + 0.5, 5));
    };

    const handleZoomOut = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setScale(prev => Math.max(prev - 0.5, 1));
    };

    const handleReset = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setScale(1);
    };

    const handleWheel = useCallback((e: WheelEvent) => {
        if (!isOpen) return;
        e.preventDefault();
        const delta = e.deltaY;
        setScale(prev => {
            const newScale = delta < 0 ? prev + 0.2 : prev - 0.2;
            return Math.min(Math.max(newScale, 1), 5);
        });
    }, [isOpen]);

    useEffect(() => {
        const container = containerRef.current;
        if (container && isOpen) {
            container.addEventListener('wheel', handleWheel, { passive: false });
            return () => container.removeEventListener('wheel', handleWheel);
        }
    }, [isOpen, handleWheel]);

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
                            <span className="text-xs font-mono text-white/60 bg-white/5 py-1 px-2 rounded-lg border border-white/10">
                                {Math.round(scale * 100)}%
                            </span>
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

                    {/* Floating Controls */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 p-1.5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl z-50 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button onClick={handleZoomOut} className="p-3 hover:bg-white/10 rounded-xl transition-colors text-white/80 hover:text-white" title="Zoom Out">
                            <ZoomOut size={20} />
                        </button>
                        <button onClick={handleReset} className="p-3 hover:bg-white/10 rounded-xl transition-colors text-white/80 hover:text-white" title="Reset">
                            <RotateCcw size={20} />
                        </button>
                        <button onClick={handleZoomIn} className="p-3 hover:bg-white/10 rounded-xl transition-colors text-white/80 hover:text-white" title="Zoom In">
                            <ZoomIn size={20} />
                        </button>
                    </motion.div>

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
