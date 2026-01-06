import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NextGen Chatbot',
  description: 'AI-powered chatbot with Gemini API and Glassmorphism design',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
