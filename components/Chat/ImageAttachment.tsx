import React, { useState } from 'react';
import { X, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import ImageViewer from './ImageViewer';

interface ImageAttachmentProps {
    src: string;
    alt: string;
    variant?: 'single' | 'grid';
}

export default function ImageAttachment({ src, alt, variant = 'single' }: ImageAttachmentProps) {
    const [error, setError] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const handleDownload = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!src) return;

        try {
            setIsDownloading(true);
            const response = await fetch(src);
            const blob = await response.blob() as Blob;
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `image-${Date.now()}.jpg`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            console.error("Failed to download image:", err);
        } finally {
            setIsDownloading(false);
        }
    };

    if (error) {
        return (
            <span className="p-4 rounded-xl border border-white/10 bg-white/5 text-gray-400 text-sm flex items-center gap-2 w-full h-full min-h-[100px] justify-center">
                <X size={16} />
                <span>Failed to load image</span>
            </span>
        );
    }

    const isGrid = variant === 'grid';
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    return (
        <>
            <span
                onClick={() => setIsLightboxOpen(true)}
                className={cn(
                    "relative group block overflow-hidden rounded-xl border border-white/10 bg-black/20 shrink-0 cursor-zoom-in snap-center",
                    isGrid ? "w-[200px] h-[200px]" : "w-full max-w-full h-auto min-h-[200px]"
                )}
            >
                {isLoading && (
                    <span className="absolute inset-0 flex items-center justify-center bg-white/5 min-h-[200px]">
                        <span className="w-6 h-6 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
                    </span>
                )}
                <img
                    src={src}
                    alt={alt}
                    loading="lazy"
                    decoding="async"
                    className={cn(
                        "transition-opacity duration-300 transition-transform transform-gpu",
                        isGrid ? "w-full h-full object-cover md:hover:scale-105" : "w-full h-auto block max-h-[300px] object-contain",
                        isLoading ? "opacity-0" : "opacity-100"
                    )}
                    onLoad={() => setIsLoading(false)}
                    onError={() => {
                        setIsLoading(false);
                        setError(true);
                    }}
                />
                {!isLoading && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 pointer-events-none">
                        <div className="bg-black/60 text-white rounded-full p-2 backdrop-blur-sm">
                            <Download size={18} />
                        </div>
                    </div>
                )}
            </span>

            <ImageViewer
                src={src}
                alt={alt}
                isOpen={isLightboxOpen}
                onClose={() => setIsLightboxOpen(false)}
            />
        </>
    );
}
