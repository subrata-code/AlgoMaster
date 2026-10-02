import { apiRequest } from '@/lib/api'
import type {
  Company,
  FAQ,
  HomeStats,
  JourneyDay,
  RoadmapPhase,
  Testimonial,
  Topic,
} from '@/types'

export const contentService = {
  async getTopics(): Promise<Topic[]> {
    const response = await apiRequest<{ topics: Topic[] }>('/content/topics')
    return response.data?.topics ?? []
  },

  async getTopic(slug: string): Promise<Topic | null> {
    try {
      const response = await apiRequest<{ topic: Topic }>(`/content/topics/${encodeURIComponent(slug)}`)
      return response.data?.topic ?? null
    } catch {
      return null
    }
  },

  async getCompanies(): Promise<Company[]> {
    const response = await apiRequest<{ companies: Company[] }>('/content/companies')
    return response.data?.companies ?? []
  },

  async getCompany(id: string): Promise<Company | null> {
    try {
      const response = await apiRequest<{ company: Company }>(`/content/companies/${encodeURIComponent(id)}`)
      return response.data?.company ?? null
    } catch {
      return null
    }
  },

  async getRoadmap(): Promise<RoadmapPhase[]> {
    const response = await apiRequest<{ roadmap: RoadmapPhase[] }>('/content/roadmap')
    return response.data?.roadmap ?? []
  },

  async getJourneyDays(): Promise<JourneyDay[]> {
    const response = await apiRequest<{ journey: JourneyDay[] }>('/content/journey')
    return response.data?.journey ?? []
  },

  async getCurrentJourneyDay(): Promise<JourneyDay | null> {
    try {
      const response = await apiRequest<{ day: JourneyDay | null }>('/content/journey/current')
      return response.data?.day ?? null
    } catch {
      return null
    }
  },

  async getHomeStats(): Promise<HomeStats> {
    const response = await apiRequest<{ stats: HomeStats }>('/content/stats')
    return response.data?.stats ?? { problems: 0, learners: 0, topics: 0, companies: 0 }
  },

  async getTestimonials(): Promise<Testimonial[]> {
    const response = await apiRequest<{ testimonials: Testimonial[] }>('/content/testimonials')
    return response.data?.testimonials ?? []
  },

  async getFaqs(): Promise<FAQ[]> {
    const response = await apiRequest<{ faqs: FAQ[] }>('/content/faqs')
    return response.data?.faqs ?? []
  },

  async subscribeNewsletter(email: string): Promise<{ success: boolean }> {
    const response = await apiRequest<{ success: boolean }>('/content/newsletter', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
    return response.data ?? { success: true }
  },
}
