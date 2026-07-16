export type Difficulty = 'Easy' | 'Medium' | 'Hard'
export type Platform = 'LeetCode' | 'GeeksforGeeks' | 'Codeforces' | 'HackerRank' | 'AtCoder'
export type ProblemStatus = 'published' | 'draft'
export type ActivityType = 'solved' | 'bookmarked' | 'viewed' | 'streak' | 'achievement'

export interface Company {
  id: string
  name: string
  logo?: string
  problemCount: number
  description: string
}

export interface Topic {
  id: string
  name: string
  slug: string
  description: string
  problemCount: number
  icon: string
  color: string
}

export interface Problem {
  id: string
  day?: number
  name: string
  slug: string
  difficulty: Difficulty
  platform: Platform
  link: string
  companies: string[]
  tags: string[]
  topics: string[]
  hints: string[]
  solution?: string
  conceptVideoUrl?: string
  isPremium: boolean
  isFeatured: boolean
  status: ProblemStatus
  solvedCount: number
  acceptanceRate: number
  createdAt: string
  updatedAt: string
  description?: string
}

export interface User {
  id: string
  name: string
  username: string
  email: string
  avatar?: string
  bio?: string
  role: 'user' | 'admin'
  joinedAt: string
  location?: string
  github?: string
  linkedin?: string
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt?: string
  progress: number
  total: number
}

export interface Activity {
  id: string
  type: ActivityType
  title: string
  description: string
  timestamp: string
  problemId?: string
}

export interface Bookmark {
  id: string
  problemId: string
  createdAt: string
}

export interface RoadmapPhase {
  id: string
  title: string
  description: string
  topics: string[]
  duration: string
  order: number
  isCompleted: boolean
}

export interface JourneyDay {
  day: number
  title: string
  problemIds: string[]
  focus: string
  isCompleted: boolean
  isCurrent: boolean
}

export interface DashboardStats {
  solved: number
  easy: number
  medium: number
  hard: number
  streak: number
  longestStreak: number
  bookmarks: number
  totalProblems: number
  weeklyProgress: { day: string; solved: number }[]
  topicProgress: { topic: string; solved: number; total: number }[]
}

export interface Testimonial {
  id: string
  name: string
  role: string
  avatar?: string
  content: string
}

export interface FAQ {
  id: string
  question: string
  answer: string
}

export interface HomeStats {
  problems: number
  learners: number
  topics: number
  companies: number
}

export interface PaginationMeta {
  page: number
  pageSize: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: PaginationMeta
}

export interface ProblemFilters {
  search?: string
  difficulty?: Difficulty | 'All'
  platform?: Platform | 'All'
  topic?: string
  company?: string
  sortBy?: 'newest' | 'oldest' | 'difficulty' | 'popular'
  page?: number
  pageSize?: number
}

export interface AdminStats {
  totalProblems: number
  published: number
  drafts: number
  totalUsers: number
  viewsThisWeek: number
}
