export function getErrorDetails(error: unknown): unknown | undefined {
  if (!error || typeof error !== 'object' || !('details' in error)) return undefined
  return (error as { details?: unknown }).details
}
