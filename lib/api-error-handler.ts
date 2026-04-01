import { NextResponse } from 'next/server';
import { ErrorType, logError, categorizeError } from './error-logger';

export interface APIErrorResponse {
  error: string;
  code: string;
  message: string;
  statusCode: number;
  timestamp: string;
  requestId?: string;
}

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code: string = 'INTERNAL_ERROR'
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export class ValidationError extends APIError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends APIError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends APIError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
    this.name = 'UnauthorizedError';
  }
}

export class RateLimitError extends APIError {
  constructor(message: string = 'Too many requests') {
    super(message, 429, 'RATE_LIMIT_EXCEEDED');
    this.name = 'RateLimitError';
  }
}

export class TimeoutError extends APIError {
  constructor(message: string = 'Operation timed out') {
    super(message, 408, 'TIMEOUT');
    this.name = 'TimeoutError';
  }
}

export function handleAPIError(error: unknown, requestId?: string): NextResponse {
  if (error instanceof APIError) {
    logError(new Error(error.message), categorizeError(error.message), { additionalInfo: { requestId } });
    
    const response: APIErrorResponse = {
      error: error.code,
      code: error.code,
      message: error.message,
      statusCode: error.statusCode,
      timestamp: new Date().toISOString(),
      requestId,
    };

    return NextResponse.json(response, { status: error.statusCode });
  }

  if (error instanceof Error) {
    const errorType = categorizeError(error);
    logError(error, errorType, { additionalInfo: { requestId } });

    const response: APIErrorResponse = {
      error: 'INTERNAL_ERROR',
      code: errorType,
      message: process.env.NODE_ENV === 'production' 
        ? 'An unexpected error occurred' 
        : error.message,
      statusCode: 500,
      timestamp: new Date().toISOString(),
      requestId,
    };

    return NextResponse.json(response, { status: 500 });
  }

  logError(new Error('Unknown error type'), ErrorType.UNKNOWN_ERROR, { additionalInfo: { requestId } });

  const response: APIErrorResponse = {
    error: 'UNKNOWN_ERROR',
    code: ErrorType.UNKNOWN_ERROR,
    message: 'An unexpected error occurred',
    statusCode: 500,
    timestamp: new Date().toISOString(),
    requestId,
  };

  return NextResponse.json(response, { status: 500 });
}

export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export async function withErrorHandling<T>(
  handler: () => Promise<T>,
  requestId?: string
): Promise<NextResponse | T> {
  try {
    return await handler();
  } catch (error) {
    return handleAPIError(error, requestId);
  }
}
