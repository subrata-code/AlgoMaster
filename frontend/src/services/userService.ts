import { apiRequest } from '@/lib/api'
import type { Achievement, Activity, Bookmark, DashboardStats, User } from '@/types'
import { authService } from './authService'

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
    return response.data!.user
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
