import React, { useState } from 'react';
import { Bot, Copy, Check } from 'lucide-react';
import { cn, vibrate } from '@/lib/utils';
import { toast } from 'sonner';
import MermaidDiagram from './MermaidDiagram';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';

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
    const [isExpanded, setIsExpanded] = useState(false);

    const PREVIEW_LANGS = ['html', 'css', 'javascript', 'js', 'jsx', 'typescript', 'ts', 'tsx', 'svg'];
    const showPreview = !inline && PREVIEW_LANGS.includes(language.toLowerCase());

    const lines = codeString.split('\n');
    const isLongCode = lines.length > 20;

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
                <div className={cn("relative bg-gray-100 dark:bg-[#0d1117] transition-all duration-300", !isExpanded && isLongCode ? "max-h-[350px] overflow-hidden" : "")}>
                    <div className="overflow-x-auto p-4 text-sm text-gray-800 dark:text-gray-300 font-mono leading-relaxed pb-4" style={{ scrollbarWidth: 'thin', scrollbarColor: '#30363d transparent' }}>
                        <SyntaxHighlighter
                            language={language}
                            style={vscDarkPlus}
                            PreTag="div"
                            customStyle={{ margin: 0, padding: 0, background: 'transparent' }}
                            {...(props as any)}
                        >
                            {codeString}
                        </SyntaxHighlighter>
                    </div>

                    {/* Expand Overlay */}
                    {isLongCode && !isExpanded && (
                        <div className="absolute bottom-0 left-0 right-0 flex justify-center items-end pb-2 pt-16 bg-gradient-to-t from-[#0d1117] via-[#0d1117]/80 to-transparent pointer-events-none">
                            <button
                                onClick={() => setIsExpanded(true)}
                                className="pointer-events-auto px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-medium text-white shadow-lg backdrop-blur-md transition-all active:scale-95 flex items-center gap-1"
                            >
                                Show All ({lines.length} lines)
                            </button>
                        </div>
                    )}
                </div>
                {/* Show Less Footer */}
                {isLongCode && isExpanded && (
                    <div className="flex justify-center border-t border-gray-800 bg-[#0d1117]/90 py-2">
                        <button
                            onClick={() => setIsExpanded(false)}
                            className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-medium text-white shadow-lg backdrop-blur-md transition-all active:scale-95 flex items-center gap-1"
                        >
                            Show Less
                        </button>
                    </div>
                )}
            </div>
        );
    }
    return (
        <code className={cn("bg-black/10 dark:bg-white/10 rounded px-1.5 py-0.5 text-[0.9em] font-mono text-accent-secondary", className)} {...props}>
            {children}
        </code>
    );
}
