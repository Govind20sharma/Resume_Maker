export const MAX_AI_CALLS = 20

export function isRateLimited(count: number): boolean {
  return count >= MAX_AI_CALLS
}
