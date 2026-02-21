export const getFriendlyErrorMessage = (errorString: string): string => {
    const msg = errorString.toLowerCase();
    if (msg.includes('invalid login credentials')) return 'Invalid email or password.';
    if (msg.includes('user not found')) return 'No account found with this email.';
    if (msg.includes('rate limit')) return 'Too many attempts. Please wait a moment.';
    if (msg.includes('weak password')) return 'Password is too weak. Try a longer one.';
    if (msg.includes('already registered')) return 'This email is already taken.';
    return 'An error occurred during authentication. Please try again.';
};
