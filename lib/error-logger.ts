export enum ErrorType {
  RUNTIME_ERROR = 'RUNTIME_ERROR',
  COMPILE_ERROR = 'COMPILE_ERROR',
  EXECUTION_TIMEOUT = 'EXECUTION_TIMEOUT',
  NETWORK_ERROR = 'NETWORK_ERROR',
  CONSOLE_WARNING = 'CONSOLE_WARNING',
  SERVER_ERROR = 'SERVER_ERROR',
  CLIENT_ERROR = 'CLIENT_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface ErrorLog {
  type: ErrorType;
  message: string;
  stack?: string;
  componentStack?: string;
  digest?: string;
  timestamp: string;
  url?: string;
  userAgent?: string;
  userId?: string;
  sessionId?: string;
}

export function categorizeError(error: Error | string): ErrorType {
  const message = typeof error === 'string' ? error.toLowerCase() : error.message.toLowerCase();
  
  if (message.includes('timeout') || message.includes('execution') || message.includes('time')) {
    return ErrorType.EXECUTION_TIMEOUT;
  }
  if (message.includes('compile') || message.includes('syntax') || message.includes('parse')) {
    return ErrorType.COMPILE_ERROR;
  }
  if (message.includes('network') || message.includes('fetch') || message.includes('connection') || message.includes('failed to fetch')) {
    return ErrorType.NETWORK_ERROR;
  }
  if (message.includes('console') || message.includes('warning') || message.includes('deprecated')) {
    return ErrorType.CONSOLE_WARNING;
  }
  if (message.includes('server') || message.includes('500') || message.includes('internal')) {
    return ErrorType.SERVER_ERROR;
  }
  
  return ErrorType.RUNTIME_ERROR;
}

export function logError(
  error: Error | string,
  type?: ErrorType,
  context?: {
    userId?: string;
    sessionId?: string;
    additionalInfo?: Record<string, unknown>;
  }
): ErrorLog {
  const errorMessage = typeof error === 'string' ? error : error.message;
  const errorStack = typeof error === 'string' ? undefined : error.stack;
  const errorType = type || categorizeError(error);
  
  const errorLog: ErrorLog = {
    type: errorType,
    message: errorMessage,
    stack: errorStack,
    timestamp: new Date().toISOString(),
    ...context,
  };

  if (typeof window !== 'undefined') {
    errorLog.url = window.location.href;
    errorLog.userAgent = navigator.userAgent;
  }

  if (process.env.NODE_ENV === 'development') {
    console.error(`[${errorType}]`, errorLog);
  }

  return errorLog;
}

export function getErrorMessage(type: ErrorType): string {
  switch (type) {
    case ErrorType.EXECUTION_TIMEOUT:
      return 'The operation took too long to complete. Please try again.';
    case ErrorType.COMPILE_ERROR:
      return 'A code error was detected. Please refresh the page.';
    case ErrorType.CONSOLE_WARNING:
      return 'A console warning was triggered during execution.';
    case ErrorType.NETWORK_ERROR:
      return 'Unable to connect to the server. Check your connection.';
    case ErrorType.SERVER_ERROR:
      return 'A server error occurred. Please try again later.';
    case ErrorType.CLIENT_ERROR:
      return 'A client-side error occurred.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
}

export function isRetryableError(error: Error | string): boolean {
  const message = typeof error === 'string' ? error.toLowerCase() : error.message.toLowerCase();
  
  return (
    message.includes('timeout') ||
    message.includes('network') ||
    message.includes('connection') ||
    message.includes('fetch')
  );
}

export function getErrorTitle(type: ErrorType): string {
  switch (type) {
    case ErrorType.EXECUTION_TIMEOUT:
      return 'Operation Timeout';
    case ErrorType.COMPILE_ERROR:
      return 'Compile Error';
    case ErrorType.CONSOLE_WARNING:
      return 'Console Warning';
    case ErrorType.NETWORK_ERROR:
      return 'Connection Error';
    case ErrorType.SERVER_ERROR:
      return 'Server Error';
    case ErrorType.CLIENT_ERROR:
      return 'Client Error';
    case ErrorType.UNKNOWN_ERROR:
      return 'Something Went Wrong';
    default:
      return 'Unexpected Error';
  }
}
