import { apiRequest } from '@/lib/api'
import type { PaginatedResponse, Problem, ProblemFilters } from '@/types'

export const problemService = {
  async getAll(filters: ProblemFilters = {}): Promise<PaginatedResponse<Problem>> {
    const params = new URLSearchParams()
    if (filters.search) params.set('search', filters.search)
    if (filters.difficulty && filters.difficulty !== 'All') params.set('difficulty', filters.difficulty)
    if (filters.platform && filters.platform !== 'All') params.set('platform', filters.platform)
    if (filters.topic) params.set('topic', filters.topic)
    if (filters.company) params.set('company', filters.company)
    if (filters.sortBy) params.set('sortBy', filters.sortBy)
    if (filters.page) params.set('page', String(filters.page))
    if (filters.pageSize) params.set('pageSize', String(filters.pageSize))

    const qs = params.toString()
    const response = await apiRequest<{ data: Problem[]; pagination: PaginatedResponse<Problem>['pagination'] }>(
      `/problems${qs ? `?${qs}` : ''}`,
    )

    return {
      data: response.data!.data,
      pagination: response.data!.pagination,
    }
  },

  async getById(id: string): Promise<Problem | null> {
    try {
      const response = await apiRequest<{ problem: Problem }>(`/problems/${encodeURIComponent(id)}`)
      return response.data?.problem ?? null
    } catch {
      return null
    }
  },

  async getFeatured(): Promise<Problem[]> {
    const response = await apiRequest<{ problems: Problem[] }>('/problems/featured')
    return response.data?.problems ?? []
  },

  async getRecent(limit = 6): Promise<Problem[]> {
    const response = await apiRequest<{ problems: Problem[] }>(`/problems/recent?limit=${limit}`)
    return response.data?.problems ?? []
  },

  async getRelated(id: string, limit = 4): Promise<Problem[]> {
    try {
      const response = await apiRequest<{ problems: Problem[] }>(
        `/problems/${encodeURIComponent(id)}/related?limit=${limit}`,
      )
      return response.data?.problems ?? []
    } catch {
      return []
    }
  },

  async getByDay(day: number): Promise<Problem | null> {
    try {
      const response = await apiRequest<{ problem: Problem | null }>(`/problems/day/${day}`)
      return response.data?.problem ?? null
    } catch {
      return null
    }
  },

  async getCurrentDayProblem(): Promise<Problem | null> {
    try {
      const response = await apiRequest<{ problem: Problem | null }>('/problems/current')
      return response.data?.problem ?? null
    } catch {
      return null
    }
  },
}
