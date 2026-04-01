'use client';

import { useCallback, useEffect, useRef } from 'react';
import { logError, ErrorType, categorizeError } from '@/lib/error-logger';

interface UseErrorHandlerOptions {
  onError?: (error: Error) => void;
  shouldThrow?: boolean;
  context?: Record<string, unknown>;
}

export function useErrorHandler(options: UseErrorHandlerOptions = {}) {
  const { onError, shouldThrow = false, context } = options;
  const errorHandlersRef = useRef<Set<(error: Error) => void>>(new Set());

  const handleError = useCallback((error: Error | string) => {
    const errorInstance = typeof error === 'string' ? new Error(error) : error;
    const errorType = categorizeError(errorInstance);
    
    const errorLog = logError(errorInstance, errorType, context);
    
    if (onError) {
      onError(errorInstance);
    }
    
    errorHandlersRef.current.forEach((handler) => {
      handler(errorInstance);
    });

    if (shouldThrow) {
      throw errorInstance;
    }

    return errorLog;
  }, [onError, shouldThrow, context]);

  const subscribe = useCallback((handler: (error: Error) => void) => {
    errorHandlersRef.current.add(handler);
    return () => {
      errorHandlersRef.current.delete(handler);
    };
  }, []);

  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = event.reason instanceof Error 
        ? event.reason 
        : new Error(String(event.reason));
      
      logError(error, ErrorType.RUNTIME_ERROR, { 
        context: 'unhandled_promise_rejection',
        ...context 
      });

      if (onError) {
        onError(error);
      }
    };

    const handleGlobalError = (event: ErrorEvent) => {
      const error = event.error instanceof Error 
        ? event.error 
        : new Error(event.message);
      
      logError(error, categorizeError(error), {
        context: 'global_error_handler',
        ...context
      });

      if (onError) {
        onError(error);
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleGlobalError);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleGlobalError);
    };
  }, [onError, context]);

  return {
    handleError,
    subscribe,
  };
}

export function useConsoleErrorCapture() {
  useEffect(() => {
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;

    console.error = (...args: unknown[]) => {
      const errorMessage = args
        .map((arg) => (typeof arg === 'string' ? arg : JSON.stringify(arg)))
        .join(' ');

      if (errorMessage.toLowerCase().includes('error') || errorMessage.toLowerCase().includes('warning')) {
        logError(
          new Error(errorMessage),
          categorizeError(errorMessage),
          { context: 'console_error' }
        );
      }

      originalConsoleError.apply(console, args);
    };

    console.warn = (...args: unknown[]) => {
      const warningMessage = args
        .map((arg) => (typeof arg === 'string' ? arg : JSON.stringify(arg)))
        .join(' ');

      logError(
        new Error(warningMessage),
        ErrorType.CONSOLE_WARNING,
        { context: 'console_warning' }
      );

      originalConsoleWarn.apply(console, args);
    };

    return () => {
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
    };
  }, []);
}
