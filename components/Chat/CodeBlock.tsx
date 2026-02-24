import React, { useState } from 'react';
import { Bot, Copy, Check } from 'lucide-react';
import { cn, vibrate } from '@/lib/utils';
import { toast } from 'sonner';
import MermaidDiagram from './MermaidDiagram';

interface CodeBlockProps {
    inline?: boolean;
    className?: string;
    children?: React.ReactNode;
    onOpenArtifact?: (code: string, lang: string) => void;
}

export default function CodeBlock({ inline, className, children, onOpenArtifact, ...props }: CodeBlockProps) {
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : '';
    const codeString = String(children).replace(/\n$/, '');
    const [isCopied, setIsCopied] = useState(false);

    const PREVIEW_LANGS = ['html', 'css', 'javascript', 'js', 'jsx', 'typescript', 'ts', 'tsx', 'svg'];
    const showPreview = !inline && PREVIEW_LANGS.includes(language.toLowerCase());

    if (!inline && language === 'mermaid') {
        return <MermaidDiagram code={codeString} />;
    }

    if (!inline && match) {
        return (
            <div className="relative rounded-lg overflow-hidden my-4 bg-gray-900 border border-gray-800 shadow-xl group/code">
                <div className="flex items-center justify-between px-4 py-1.5 bg-gray-950/80 border-b border-gray-800">
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-gray-400 capitalize">{language}</span>
                        {showPreview && (
                            <button
                                onClick={() => onOpenArtifact?.(codeString, language)}
                                className="flex items-center gap-1.5 text-[10px] font-bold text-accent-primary hover:text-accent-secondary transition-colors px-2 py-0.5 rounded bg-accent-primary/5 border border-accent-primary/20"
                            >
                                <Bot size={12} /> Open Preview
                            </button>
                        )}
                    </div>
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(codeString);
                            setIsCopied(true);
                            vibrate(10);
                            toast.success('Code copied to clipboard');
                            setTimeout(() => setIsCopied(false), 2000);
                        }}
                        className="text-gray-400 hover:text-white transition-colors p-1 rounded-md hover:bg-white/10"
                        title="Copy code"
                        aria-label="Copy code block"
                    >
                        {isCopied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                    </button>
                </div>
                <div className="p-4 overflow-x-auto bg-gray-100 dark:bg-[#0d1117] text-sm text-gray-800 dark:text-gray-300 font-mono leading-relaxed" style={{ scrollbarWidth: 'thin', scrollbarColor: '#30363d transparent' }}>
                    <code className={className} {...props}>
                        {children}
                    </code>
                </div>
            </div>
        );
    }
    return (
        <code className={cn("bg-black/10 dark:bg-white/10 rounded px-1.5 py-0.5 text-[0.9em] font-mono text-accent-secondary", className)} {...props}>
            {children}
        </code>
    );
}
