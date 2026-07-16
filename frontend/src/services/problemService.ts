import { delay, paginate } from '@/lib/utils'
import { problems } from '@/data/problems'
import type { PaginatedResponse, Problem, ProblemFilters } from '@/types'

const DIFFICULTY_ORDER = { Easy: 1, Medium: 2, Hard: 3 }

function filterProblems(filters: ProblemFilters = {}): Problem[] {
  let result = problems.filter((p) => p.status === 'published')

  if (filters.search) {
    const q = filters.search.toLowerCase()
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.companies.some((c) => c.toLowerCase().includes(q)),
    )
  }

  if (filters.difficulty && filters.difficulty !== 'All') {
    result = result.filter((p) => p.difficulty === filters.difficulty)
  }

  if (filters.platform && filters.platform !== 'All') {
    result = result.filter((p) => p.platform === filters.platform)
  }

  if (filters.topic) {
    result = result.filter(
      (p) => p.topics.includes(filters.topic!) || p.tags.some((t) => t.toLowerCase() === filters.topic!.toLowerCase()),
    )
  }

  if (filters.company) {
    result = result.filter((p) => p.companies.includes(filters.company!))
  }

  switch (filters.sortBy) {
    case 'oldest':
      result = [...result].sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt))
      break
    case 'difficulty':
      result = [...result].sort((a, b) => DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty])
      break
    case 'popular':
      result = [...result].sort((a, b) => b.solvedCount - a.solvedCount)
      break
    case 'newest':
    default:
      result = [...result].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
  }

  return result
}

export const problemService = {
  async getAll(filters: ProblemFilters = {}): Promise<PaginatedResponse<Problem>> {
    await delay()
    const filtered = filterProblems(filters)
    return paginate(filtered, filters.page ?? 1, filters.pageSize ?? 9)
  },

  async getById(id: string): Promise<Problem | null> {
    await delay()
    return problems.find((p) => p.id === id || p.slug === id) ?? null
  },

  async getFeatured(): Promise<Problem[]> {
    await delay()
    return problems.filter((p) => p.isFeatured && p.status === 'published').slice(0, 6)
  },

  async getRecent(limit = 6): Promise<Problem[]> {
    await delay()
    return [...problems]
      .filter((p) => p.status === 'published')
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
      .slice(0, limit)
  },

  async getRelated(id: string, limit = 4): Promise<Problem[]> {
    await delay()
    const current = problems.find((p) => p.id === id)
    if (!current) return []
    return problems
      .filter(
        (p) =>
          p.id !== id &&
          p.status === 'published' &&
          (p.tags.some((t) => current.tags.includes(t)) || p.difficulty === current.difficulty),
      )
      .slice(0, limit)
  },

  async getByDay(day: number): Promise<Problem | null> {
    await delay()
    return problems.find((p) => p.day === day && p.status === 'published') ?? null
  },

  async getCurrentDayProblem(): Promise<Problem | null> {
    await delay()
    return problems.find((p) => p.day === 15) ?? problems.find((p) => p.day === 12) ?? null
  },
}
