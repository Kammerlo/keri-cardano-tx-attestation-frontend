// Environment configuration utilities

/**
 * Get the Signify service URL from environment variables
 * Defaults to 'http://localhost:3901' if not set
 */
export function getSignifyUrl(): string {
  return process.env.NEXT_PUBLIC_SIGNIFY_URL || 'http://localhost:3901';
}
