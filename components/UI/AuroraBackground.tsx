'use client';

import { cn } from '@/lib/utils';
import React from 'react';

export const AuroraBackground = ({
    className,
    children,
    showRadialGradient = true,
    ...props
}: React.HTMLProps<HTMLDivElement> & { showRadialGradient?: boolean }) => {
    return (
        <main
            className={cn(
                'relative flex flex-col h-screen w-full bg-background text-foreground overflow-hidden transition-colors',
                className
            )}
            {...props}
        >
            <div className="bg-noise" />
            {children}
        </main>
    );
};
