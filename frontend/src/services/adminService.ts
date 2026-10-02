import { apiRequest } from '@/lib/api'
import type { AdminStats, Problem, ProblemStatus } from '@/types'

export interface CreateProblemInput {
  day?: number
  name: string
  link: string
  difficulty: Problem['difficulty']
  platform: Problem['platform']
  companies: string[]
  tags: string[]
  hints: string[]
  solution?: string
  conceptVideoUrl?: string
  description?: string
  status: ProblemStatus
}

export const adminService = {
  async getStats(): Promise<AdminStats> {
    const response = await apiRequest<AdminStats>('/admin/stats')
    return response.data!
  },

  async getProblems(): Promise<Problem[]> {
    const response = await apiRequest<{ problems: Problem[] }>('/admin/problems')
    return response.data?.problems ?? []
  },

  async getProblem(id: string): Promise<Problem | null> {
    try {
      const response = await apiRequest<{ problem: Problem }>(`/admin/problems/${encodeURIComponent(id)}`)
      return response.data?.problem ?? null
    } catch {
      return null
    }
  },

  async createProblem(input: CreateProblemInput): Promise<Problem> {
    const response = await apiRequest<{ problem: Problem }>('/problems', {
      method: 'POST',
      body: JSON.stringify(input),
    })
    return response.data!.problem
  },

  async updateProblem(id: string, input: Partial<CreateProblemInput>): Promise<Problem | null> {
    try {
      const response = await apiRequest<{ problem: Problem }>(`/problems/${encodeURIComponent(id)}`, {
        method: 'PUT',
        body: JSON.stringify(input),
      })
      return response.data?.problem ?? null
    } catch {
      return null
    }
  },

  async deleteProblem(id: string): Promise<{ success: boolean }> {
    try {
      const response = await apiRequest<{ success: boolean }>(`/problems/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      })
      return response.data ?? { success: false }
    } catch {
      return { success: false }
    }
  },
}
