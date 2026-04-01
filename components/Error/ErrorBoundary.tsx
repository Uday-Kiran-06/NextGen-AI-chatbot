'use client';

import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, ArrowLeft, Bug, Zap, Clock, Code2 } from 'lucide-react';
import Link from 'next/link';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });
    this.logError(error, errorInfo);
  }

  private logError(error: Error, errorInfo: React.ErrorInfo) {
    if (typeof window !== 'undefined') {
      console.error('[ERROR_BOUNDARY]', {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        url: window.location.href,
      });
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return <DefaultErrorFallback error={this.state.error} onReset={this.handleReset} />;
    }

    return this.props.children;
  }
}

interface FallbackProps {
  error: Error | null;
  onReset: () => void;
}

function DefaultErrorFallback({ error, onReset }: FallbackProps) {
  const errorType = categorizeError(error);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-red-950/20 via-transparent to-orange-950/20" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/10 via-transparent to-transparent" />
      
      <div className="relative z-10 w-full max-w-lg">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className={`p-4 rounded-2xl ${getErrorColor(errorType)}`}>
              {getErrorIcon(errorType)}
            </div>
          </div>

          <div className="text-center mb-6">
            <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-white/10 text-red-400 mb-3">
              {errorType}
            </span>
            <h1 className="text-2xl font-bold text-white mb-2">Component Error</h1>
            <p className="text-slate-400 text-sm">
              {getErrorMessage(errorType)}
            </p>
          </div>

          <div className="bg-black/30 rounded-xl p-4 mb-6 border border-white/5">
            <p className="text-xs text-slate-500 font-mono break-all">
              {error?.message || 'An unexpected error occurred'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onReset}
              className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white py-2.5 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
            <Link href="/">
              <button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white py-2.5 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2">
                <Home className="w-4 h-4" />
                Home
              </button>
            </Link>
          </div>

          <div className="mt-4 flex justify-center">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              <ArrowLeft className="w-3 h-3 mr-1" />
              Go back safely
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function categorizeError(error: Error | null): string {
  if (!error) return 'UNKNOWN_ERROR';
  const message = error.message.toLowerCase();
  
  if (message.includes('timeout') || message.includes('execution') || message.includes('time')) {
    return 'EXECUTION_TIMEOUT';
  }
  if (message.includes('compile') || message.includes('syntax') || message.includes('parse')) {
    return 'COMPILE_ERROR';
  }
  if (message.includes('console') || message.includes('warning') || message.includes('deprecated')) {
    return 'CONSOLE_WARNING';
  }
  if (message.includes('network') || message.includes('fetch') || message.includes('connection')) {
    return 'NETWORK_ERROR';
  }
  
  return 'RUNTIME_ERROR';
}

function getErrorIcon(type: string) {
  switch (type) {
    case 'EXECUTION_TIMEOUT':
      return <Clock className="w-8 h-8 text-yellow-400" />;
    case 'COMPILE_ERROR':
      return <Code2 className="w-8 h-8 text-red-400" />;
    case 'CONSOLE_WARNING':
      return <Bug className="w-8 h-8 text-orange-400" />;
    case 'NETWORK_ERROR':
      return <Zap className="w-8 h-8 text-cyan-400" />;
    default:
      return <AlertTriangle className="w-8 h-8 text-red-400" />;
  }
}

function getErrorColor(type: string): string {
  switch (type) {
    case 'EXECUTION_TIMEOUT':
      return 'bg-yellow-500/10';
    case 'COMPILE_ERROR':
      return 'bg-red-500/10';
    case 'CONSOLE_WARNING':
      return 'bg-orange-500/10';
    case 'NETWORK_ERROR':
      return 'bg-cyan-500/10';
    default:
      return 'bg-red-500/10';
  }
}

function getErrorMessage(type: string): string {
  switch (type) {
    case 'EXECUTION_TIMEOUT':
      return 'The operation took too long to complete.';
    case 'COMPILE_ERROR':
      return 'A code error was detected in this component.';
    case 'CONSOLE_WARNING':
      return 'A console warning was triggered.';
    case 'NETWORK_ERROR':
      return 'Unable to connect. Check your connection.';
    default:
      return 'An unexpected error occurred in this component.';
  }
}

export default ErrorBoundary;
