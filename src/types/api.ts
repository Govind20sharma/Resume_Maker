export type ApiSuccess<T> = { data: T }

export type ApiError = {
  error: string
  code:
    | 'VALIDATION_ERROR'
    | 'AI_UNAVAILABLE'
    | 'RATE_LIMIT_EXCEEDED'
    | 'PARSE_FAILED'
    | 'SERVER_ERROR'
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError

export function isApiError(res: ApiResponse<unknown>): res is ApiError {
  return 'error' in res
}
