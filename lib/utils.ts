import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getFriendlyErrorMessage(error: any): string {
    const msg = error?.message || String(error);
    
    if (msg.includes('503')) {
        return "I'm receiving a lot of messages right now. Please give me a moment to catch up!";
    } else if (msg.includes('429')) {
        return "Whoa, that's fast! Let me finish my thought first.";
    } else if (msg.includes('API Key') || msg.includes('403') || msg.includes('unregistered callers')) {
        return "I'm having trouble connecting to my creative engine. Please try again later.";
    } else if (msg.includes('500')) {
        return "Oops, something went wrong on my end. Let's try that again.";
    } else if (msg.includes('Failed to fetch') || msg.includes('Network request failed')) {
        return "I can't seem to reach the internet. Please check your connection.";
    }
    
    return 'Something went wrong. Please try again later.';
}
