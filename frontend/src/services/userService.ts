import { delay } from '@/lib/utils'
import { achievements, activities, adminUser, bookmarks, dashboardStats } from '@/data'
import type { Achievement, Activity, Bookmark, DashboardStats, User } from '@/types'
import { authService } from './authService'

export const userService = {
  async getCurrentUser(): Promise<User> {
    return authService.getCurrentUser()
  },

  async getAdminUser(): Promise<User> {
    await delay()
    return adminUser
  },

  async getAchievements(): Promise<Achievement[]> {
    await delay()
    return achievements
  },

  async getActivities(): Promise<Activity[]> {
    await delay()
    return activities
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    const user = await authService.getCurrentUser()
    return { ...user, ...data }
  },
}

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    await delay()
    return dashboardStats
  },

  async getRecentActivity(limit = 5): Promise<Activity[]> {
    await delay()
    return activities.slice(0, limit)
  },
}

export const bookmarkService = {
  async getAll(): Promise<Bookmark[]> {
    await delay()
    return bookmarks
  },

  async isBookmarked(problemId: string): Promise<boolean> {
    await delay(100)
    return bookmarks.some((b) => b.problemId === problemId)
  },

  async toggle(problemId: string): Promise<{ bookmarked: boolean }> {
    await delay(200)
    const exists = bookmarks.some((b) => b.problemId === problemId)
    return { bookmarked: !exists }
  },
}
