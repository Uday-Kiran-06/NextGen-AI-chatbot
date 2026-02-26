'use client';

import { useEffect } from 'react';

interface ShortcutOptions {
    onNewChat?: () => void;
    onToggleSidebar?: () => void;
    onFocusInput?: () => void;
    onToggleTheme?: () => void;
    onStopGeneration?: () => void;
}

export function useShortcuts({ onNewChat, onToggleSidebar, onFocusInput, onToggleTheme, onStopGeneration }: ShortcutOptions) {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const isCmd = event.metaKey || event.ctrlKey;
            const isShift = event.shiftKey;

            // Ctrl/Cmd + K: New Chat
            if (isCmd && event.key.toLowerCase() === 'k') {
                event.preventDefault();
                onNewChat?.();
            }

            // Ctrl/Cmd + \: Toggle Sidebar (Common shortcut for sidebars)
            if (isCmd && event.key === '\\') {
                event.preventDefault();
                onToggleSidebar?.();
            }

            // Ctrl/Cmd + /: Toggle Help (Could be useful later)

            // Ctrl/Cmd + L: Focus Input (Search/Input)
            if (isCmd && event.key.toLowerCase() === 'l') {
                event.preventDefault();
                onFocusInput?.();
            }

            // Ctrl/Cmd + J: Toggle Theme
            if (isCmd && event.key.toLowerCase() === 'j') {
                event.preventDefault();
                onToggleTheme?.();
            }

            // Escape: Stop Generation
            if (event.key === 'Escape') {
                event.preventDefault();
                onStopGeneration?.();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onNewChat, onToggleSidebar, onFocusInput, onToggleTheme, onStopGeneration]);
}
