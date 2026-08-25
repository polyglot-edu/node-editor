import axios from 'axios';

export function getApiErrorMessage(
  error: unknown,
  fallback = 'Something went wrong. Please try again.'
): string {
  if (typeof error === 'string') return error;

  if (axios.isAxiosError(error)) {
    const data = error.response?.data as any;
    if (data) {
      if (typeof data === 'string' && data.trim()) return data;
      if (typeof data === 'object') {
        const message = data.message ?? data.detail ?? data.error ?? data.title;
        if (typeof message === 'string' && message.trim()) return message;
      }
    }
    if (!error.response) {
      return 'Could not reach the server. Check your connection and try again.';
    }
    return error.message || fallback;
  }

  if (error instanceof Error) return error.message;

  return fallback;
}

