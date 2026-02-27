import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download } from 'lucide-react';
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

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-2xl px-4 py-8 md:p-12"
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

                    {/* Main Image Viewport using react-zoom-pan-pinch */}
                    <div className="w-full h-full flex items-center justify-center overflow-hidden">
                        <TransformWrapper
                            initialScale={1}
                            minScale={0.5}
                            maxScale={5}
                            centerZoomedOut={true}
                            wheel={{ step: 0.2 }}
                            doubleClick={{ step: 1.5 }}
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
        </AnimatePresence>
    );
}
