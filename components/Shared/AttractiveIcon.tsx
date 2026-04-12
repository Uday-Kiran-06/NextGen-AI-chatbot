import React, { useId } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AttractiveIconProps {
    icon: LucideIcon;
    size?: number;
    className?: string;
    gradient?: [string, string]; // [fromColor, toColor]
    animate?: boolean;
    glow?: boolean;
    strokeWidth?: number;
}

export const AttractiveIcon = ({
    icon: Icon,
    size = 24,
    className,
    gradient,
    animate = true,
    glow = false,
    strokeWidth = 1.5,
}: AttractiveIconProps) => {
    const id = useId().replace(/:/g, '');
    const gradientId = `icon-gradient-${id}`;

    const iconVariants = {
        initial: { scale: 0.9, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        hover: { 
            scale: 1.1, 
            rotate: [0, -5, 5, 0],
            transition: { duration: 0.3, ease: "easeInOut" as const } 
        }
    };

    return (
        <motion.div
            initial={animate ? "initial" : undefined}
            animate={animate ? "animate" : undefined}
            whileHover={animate ? "hover" : undefined}
            variants={iconVariants as any}
            className={cn(
                "relative flex items-center justify-center shrink-0",
                glow && "drop-shadow-[0_0_8px_rgba(var(--accent-primary-rgb),0.5)]",
                className
            )}
            style={{ width: size, height: size }}
        >
            <svg width="0" height="0" className="absolute">
                <defs>
                    {gradient ? (
                        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor={gradient[0]} />
                            <stop offset="100%" stopColor={gradient[1]} />
                        </linearGradient>
                    ) : (
                        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="currentColor" />
                            <stop offset="100%" stopColor="currentColor" stopOpacity="0.8" />
                        </linearGradient>
                    )}
                </defs>
            </svg>

            <Icon
                size={size}
                strokeWidth={strokeWidth}
                style={{ stroke: `url(#${gradientId})` }}
                className="relative z-10 overflow-visible"
            />
            
            {glow && (
                <div 
                    className="absolute inset-0 blur-md opacity-40 -z-1"
                    style={{ 
                        background: gradient ? `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})` : 'currentColor' 
                    }}
                />
            )}
        </motion.div>
    );
};
