import { delay } from '@/lib/utils'
import {
  companies,
  faqs,
  homeStats,
  journeyDays,
  roadmapPhases,
  testimonials,
  topics,
} from '@/data'
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
    await delay()
    return topics
  },

  async getTopic(slug: string): Promise<Topic | null> {
    await delay()
    return topics.find((t) => t.slug === slug) ?? null
  },

  async getCompanies(): Promise<Company[]> {
    await delay()
    return companies
  },

  async getCompany(id: string): Promise<Company | null> {
    await delay()
    return companies.find((c) => c.id === id || c.name.toLowerCase() === id.toLowerCase()) ?? null
  },

  async getRoadmap(): Promise<RoadmapPhase[]> {
    await delay()
    return roadmapPhases
  },

  async getJourneyDays(): Promise<JourneyDay[]> {
    await delay()
    return journeyDays
  },

  async getCurrentJourneyDay(): Promise<JourneyDay | null> {
    await delay()
    return journeyDays.find((d) => d.isCurrent) ?? null
  },

  async getHomeStats(): Promise<HomeStats> {
    await delay()
    return homeStats
  },

  async getTestimonials(): Promise<Testimonial[]> {
    await delay()
    return testimonials
  },

  async getFaqs(): Promise<FAQ[]> {
    await delay()
    return faqs
  },

  async subscribeNewsletter(email: string): Promise<{ success: boolean }> {
    await delay(400)
    return { success: Boolean(email) }
  },
}
