import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '../../app/login/page';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

// Mock Dependencies
vi.mock('@/lib/supabase/client', () => ({
    createClient: vi.fn(() => ({
        auth: {
            signInWithPassword: vi.fn(),
            signUp: vi.fn(),
            signInWithOAuth: vi.fn(),
        },
    })),
}));

vi.mock('next/navigation', () => ({
    useRouter: vi.fn(() => ({
        push: vi.fn(),
        refresh: vi.fn(),
    })),
}));

// Mock Framer Motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
}));

describe('LoginPage', () => {
    let supabaseMock: any;
    let routerMock: any;

    beforeEach(() => {
        supabaseMock = createClient();
        routerMock = useRouter();
        vi.clearAllMocks();
    });

    it('should toggle between sign in and sign up', () => {
        render(<LoginPage />);

        // Default is Sign In
        expect(screen.getByText('Welcome Back')).toBeInTheDocument();

        // Click to toggle
        fireEvent.click(screen.getByText('Sign Up', { selector: 'button' }));

        expect(screen.getByText('Create Account')).toBeInTheDocument();
    });

    it('should handle sign in submission', async () => {
        supabaseMock.auth.signInWithPassword.mockResolvedValue({ error: null });
        render(<LoginPage />);

        fireEvent.change(screen.getByPlaceholderText('your@email.com'), { target: { value: 'test@test.com' } });
        fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'password' } });

        fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

        await waitFor(() => {
            expect(supabaseMock.auth.signInWithPassword).toHaveBeenCalledWith({
                email: 'test@test.com',
                password: 'password',
            });
            expect(routerMock.push).toHaveBeenCalledWith('/');
        });
    });

    it('should display error on auth failure', async () => {
        supabaseMock.auth.signInWithPassword.mockResolvedValue({ error: { message: 'Invalid login' } });
        render(<LoginPage />);

        fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

        await waitFor(() => {
            expect(screen.getByText('Invalid login')).toBeInTheDocument();
        });
    });
});
