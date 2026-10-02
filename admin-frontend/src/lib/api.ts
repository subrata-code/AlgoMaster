export const API_URL = 'http://localhost:5000/api'

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data?: T; error?: string }> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // for cookies
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'API request failed')
    }

    return { data: data.data || data }
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error)
    return { error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
