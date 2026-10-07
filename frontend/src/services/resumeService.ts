import { apiRequest } from '@/lib/api'
import type { ResumeData } from '@/types'

export interface GenerateResumeResponse {
  resume: ResumeData
  pdfBase64?: string
}

export const resumeService = {
  async getPrefillData(): Promise<Partial<ResumeData>> {
    const response = await apiRequest<Partial<ResumeData>>('/resume/prefill')
    return response.data ?? {}
  },

  async parseJobDescription(jobDescription: string, targetRole = ''): Promise<{ keywords: string[] }> {
    const response = await apiRequest<{ keywords: string[] }>('/resume/parse-jd', {
      method: 'POST',
      body: JSON.stringify({ jobDescription, targetRole }),
    })
    return response.data ?? { keywords: [] }
  },

  async generateResume(payload: Partial<ResumeData>): Promise<GenerateResumeResponse> {
    const response = await apiRequest<GenerateResumeResponse>('/resume/generate', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    return response.data!
  },

  async getMyResumes(): Promise<ResumeData[]> {
    const response = await apiRequest<{ resumes: ResumeData[] }>('/resume/list')
    return response.data?.resumes ?? []
  },

  async deleteResume(id: string): Promise<void> {
    await apiRequest(`/resume/${id}`, {
      method: 'DELETE',
    })
  },

  getDownloadUrl(id: string): string {
    return `/api/resume/${id}/download`
  },
}
