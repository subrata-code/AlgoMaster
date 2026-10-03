import { apiRequest } from '@/lib/api'
import type { Achievement, Activity, Bookmark, DashboardStats, User, Weakness, AppNotification } from '@/types'
import { authService, normalizeUser } from './authService'

export const userService = {
  async getCurrentUser(): Promise<User> {
    return authService.getCurrentUser()
  },

  async getAchievements(): Promise<Achievement[]> {
    const response = await apiRequest<{ achievements: Achievement[] }>('/users/me/achievements')
    return response.data?.achievements ?? []
  },

  async getActivities(): Promise<Activity[]> {
    const response = await apiRequest<{ activities: Activity[] }>('/users/me/activity')
    return response.data?.activities ?? []
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await apiRequest<{ user: User }>('/users/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    return normalizeUser(response.data!.user as never)
  },

  async updateOnboarding(data: { completed: boolean; difficultyPreference: string; tourCompleted: boolean }): Promise<User> {
    const response = await apiRequest<{ user: User }>('/users/me/onboarding', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    return response.data!.user
  },

  async getSuggestedProblem(): Promise<{ id: string; slug: string } | null> {
    try {
      const response = await apiRequest<{ problem: { id: string; slug: string } }>('/users/me/suggested-problem')
      return response.data?.problem ?? null
    } catch {
      return null
    }
  },

  async isSolved(problemId: string): Promise<boolean> {
    try {
      const response = await apiRequest<{ solved: boolean }>(`/users/me/solved/${encodeURIComponent(problemId)}`)
      return response.data?.solved ?? false
    } catch {
      return false
    }
  },

  async markSolved(problemId: string): Promise<void> {
    await apiRequest(`/users/me/solve/${encodeURIComponent(problemId)}`, { method: 'POST' })
  },

  async logEvent(problemId: string, eventType: string): Promise<void> {
    try {
      await apiRequest('/users/me/events', {
        method: 'POST',
        body: JSON.stringify({ problemId, eventType }),
      })
    } catch {
      // fail silently for telemetry
    }
  },
}

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const response = await apiRequest<DashboardStats>('/users/me/stats')
    return response.data!
  },

  async getRecentActivity(limit = 5): Promise<Activity[]> {
    const response = await apiRequest<{ activities: Activity[] }>(`/users/me/activity?limit=${limit}`)
    return response.data?.activities ?? []
  },

  async getInsights(): Promise<Weakness[]> {
    const response = await apiRequest<{ weaknesses: Weakness[] }>('/users/me/insights')
    return response.data?.weaknesses ?? []
  },
}

export const bookmarkService = {
  async getAll(): Promise<Bookmark[]> {
    const response = await apiRequest<{ bookmarks: Bookmark[] }>('/users/me/bookmarks')
    return response.data?.bookmarks ?? []
  },

  async isBookmarked(problemId: string): Promise<boolean> {
    try {
      const response = await apiRequest<{ bookmarked: boolean }>(
        `/users/me/bookmarks/${encodeURIComponent(problemId)}`,
      )
      return response.data?.bookmarked ?? false
    } catch {
      return false
    }
  },

  async toggle(problemId: string): Promise<{ bookmarked: boolean }> {
    const response = await apiRequest<{ bookmarked: boolean }>(
      `/users/me/bookmarks/${encodeURIComponent(problemId)}`,
      { method: 'POST' },
    )
    return response.data ?? { bookmarked: false }
  },
}

export const notificationService = {
  async getRecent(): Promise<AppNotification[]> {
    const response = await apiRequest<{ notifications: AppNotification[] }>('/users/me/notifications')
    return response.data?.notifications ?? []
  },

  async markAllRead(): Promise<void> {
    await apiRequest('/users/me/notifications/read', { method: 'PUT' })
  },
}
