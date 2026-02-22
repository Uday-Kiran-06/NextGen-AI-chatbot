'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface MermaidDiagramProps {
    code: string;
}

export default function MermaidDiagram({ code }: MermaidDiagramProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [svg, setSvg] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAndRender = async () => {
            setLoading(true);
            setError(null);

            try {
                // Check if mermaid is already loaded
                if (!(window as any).mermaid) {
                    const script = document.createElement('script');
                    script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js';
                    script.async = true;
                    document.body.appendChild(script);

                    await new Promise((resolve, reject) => {
                        script.onload = resolve;
                        script.onerror = reject;
                    });
                }

                const mermaid = (window as any).mermaid;
                mermaid.initialize({
                    startOnLoad: false,
                    theme: 'dark',
                    securityLevel: 'loose',
                    fontFamily: 'Inter',
                });

                const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
                const { svg } = await mermaid.render(id, code);
                setSvg(svg);
            } catch (err) {
                console.error('Mermaid render error:', err);
                setError('Failed to render diagram. Please check the syntax.');
            } finally {
                setLoading(false);
            }
        };

        loadAndRender();
    }, [code]);

    if (error) {
        return (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
                <pre className="mt-2 text-xs opacity-60 overflow-x-auto">{code}</pre>
            </div>
        );
    }

    return (
        <div className="relative my-6 glass-panel rounded-xl overflow-hidden bg-gray-900/50 p-6 flex justify-center items-center min-h-[100px]">
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-950/20 backdrop-blur-sm z-10">
                    <Loader2 className="animate-spin text-accent-primary" size={24} />
                </div>
            )}
            <div
                ref={containerRef}
                className="w-full h-full flex justify-center"
                dangerouslySetInnerHTML={{ __html: svg }}
            />
        </div>
    );
}
