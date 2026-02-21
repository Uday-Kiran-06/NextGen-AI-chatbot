import { useState, useCallback, useEffect } from 'react';

/**
 * A custom hook to handle rate limiting and cooldowns for form submissions or button clicks.
 * @param defaultCooldown The default cooldown duration in seconds (default is 3)
 */
export function useRateLimit(defaultCooldown: number = 3) {
    const [cooldown, setCooldown] = useState(0);

    const startCooldown = useCallback((seconds: number = defaultCooldown) => {
        setCooldown(seconds);
    }, [defaultCooldown]);

    useEffect(() => {
        if (cooldown <= 0) return;

        const timer = setInterval(() => {
            setCooldown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        // Cleanup interval on unmount or when cooldown changes to 0
        return () => clearInterval(timer);
    }, [cooldown]);

    return {
        isRateLimited: cooldown > 0,
        cooldownSeconds: cooldown,
        startCooldown,
    };
}
