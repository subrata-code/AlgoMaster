export type ApiSuccessResponse<T> = {
  success: true
  message?: string
  data?: T
}

export type ApiErrorResponse = {
  success: false
  message?: string
}

const DEFAULT_API_BASE_URL = 'http://localhost:5000/api'

export const API_BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) || DEFAULT_API_BASE_URL

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<ApiSuccessResponse<T>> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
    ...init,
  })

  const payload = (await response.json().catch(() => null)) as ApiSuccessResponse<T> | ApiErrorResponse | null

  if (!response.ok) {
    const message = payload?.message || 'Request failed. Please try again.'
    throw new Error(message)
  }

  return payload as ApiSuccessResponse<T>
}
