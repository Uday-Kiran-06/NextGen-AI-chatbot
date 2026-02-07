import { describe, it, expect } from 'vitest';
import { cn } from '../utils';

describe('utils', () => {
    describe('cn', () => {
        it('should merge class names correctly', () => {
            expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white');
        });

        it('should handle conditional class names', () => {
            const condition = true;
            expect(cn('bg-red-500', condition && 'text-white')).toBe('bg-red-500 text-white');
            expect(cn('bg-red-500', !condition && 'text-white')).toBe('bg-red-500');
        });

        it('should merge tailwind classes using tailwind-merge', () => {
            expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
            expect(cn('p-4', 'p-2')).toBe('p-2');
        });
    });
});
