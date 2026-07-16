import { delay } from '@/lib/utils'
import { adminStats } from '@/data'
import { problems } from '@/data/problems'
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
    await delay()
    return adminStats
  },

  async getProblems(): Promise<Problem[]> {
    await delay()
    return [...problems].sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt))
  },

  async getProblem(id: string): Promise<Problem | null> {
    await delay()
    return problems.find((p) => p.id === id) ?? null
  },

  async createProblem(input: CreateProblemInput): Promise<Problem> {
    await delay(500)
    const now = new Date().toISOString()
    return {
      id: String(Date.now()),
      slug: input.name.toLowerCase().replace(/\s+/g, '-'),
      isPremium: Boolean(input.solution || input.conceptVideoUrl),
      isFeatured: false,
      solvedCount: 0,
      acceptanceRate: 0,
      topics: input.tags.map((t) => t.toLowerCase().replace(/\s+/g, '-')),
      createdAt: now,
      updatedAt: now,
      ...input,
    }
  },

  async updateProblem(id: string, input: Partial<CreateProblemInput>): Promise<Problem | null> {
    await delay(500)
    const existing = problems.find((p) => p.id === id)
    if (!existing) return null
    return {
      ...existing,
      ...input,
      updatedAt: new Date().toISOString(),
    }
  },

  async deleteProblem(id: string): Promise<{ success: boolean }> {
    await delay(400)
    return { success: problems.some((p) => p.id === id) }
  },
}
