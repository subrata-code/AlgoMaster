import { useEffect, useState, useCallback } from 'react'
import { Sparkles, FileText, History, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Loader } from '@/components/EmptyState'
import { ResumeWizard } from '@/components/resume/ResumeWizard'
import { ResumeHistoryCard } from '@/components/resume/ResumeHistoryCard'
import { resumeService } from '@/services'
import { toast } from '@/hooks/use-toast'
import type { ResumeData } from '@/types'

export default function ResumeBuilderPage() {
  const [loading, setLoading] = useState(true)
  const [initialData, setInitialData] = useState<Partial<ResumeData>>({})
  const [resumes, setResumes] = useState<ResumeData[]>([])
  const [activeTab, setActiveTab] = useState<'create' | 'history'>('create')

  const loadData = useCallback(async () => {
    try {
      const [prefill, list] = await Promise.all([
        resumeService.getPrefillData().catch(() => ({})),
        resumeService.getMyResumes().catch(() => []),
      ])
      setInitialData(prefill)
      setResumes(list)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadData()
  }, [loadData])

  const handleGenerate = async (data: Partial<ResumeData>) => {
    try {
      const res = await resumeService.generateResume(data)
      toast({
        title: 'Resume Built Successfully! 🚀',
        description: `ATS Compatibility Score: ${res.resume.atsScore}/100`,
      })
      // refresh resumes list
      resumeService.getMyResumes().then(setResumes).catch(() => {})
      return res
    } catch (err) {
      toast({
        title: 'Generation Failed',
        description: err instanceof Error ? err.message : 'Please check your inputs and try again.',
        variant: 'destructive',
      })
      throw err
    }
  }

  const handleDownload = (id: string, name: string) => {
    const url = resumeService.getDownloadUrl(id)
    const link = document.createElement('a')
    link.href = url
    link.download = `${name.replace(/\s+/g, '_')}_Resume_ATS.pdf`
    link.target = '_blank'
    link.click()
  }

  const handleDelete = async (id: string) => {
    try {
      await resumeService.deleteResume(id)
      setResumes((prev) => prev.filter((r) => r.id !== id))
      toast({ title: 'Resume Deleted', description: 'The resume has been removed.' })
    } catch (err) {
      toast({
        title: 'Delete Failed',
        description: err instanceof Error ? err.message : 'Could not delete resume.',
        variant: 'destructive',
      })
    }
  }

  if (loading) return <Loader label="Loading resume engine..." />

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              ATS Resume Builder
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 px-2.5 py-0.5 text-xs font-semibold text-indigo-400">
              <Sparkles className="h-3 w-3" /> 100% Python Engine
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Auto-fills from your profile, optimizes for your target job description, and passes every ATS filter.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 p-1 rounded-xl bg-card border border-border">
          <Button
            size="sm"
            variant={activeTab === 'create' ? 'secondary' : 'ghost'}
            onClick={() => setActiveTab('create')}
            className="text-xs h-8 gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" /> Build New
          </Button>
          <Button
            size="sm"
            variant={activeTab === 'history' ? 'secondary' : 'ghost'}
            onClick={() => setActiveTab('history')}
            className="text-xs h-8 gap-1.5"
          >
            <History className="h-3.5 w-3.5" /> History ({resumes.length})
          </Button>
        </div>
      </div>

      {activeTab === 'create' ? (
        <ResumeWizard initialData={initialData} onGenerate={handleGenerate} />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">
              Generated Resumes ({resumes.length})
            </h3>
            <Button
              size="sm"
              onClick={() => setActiveTab('create')}
              className="text-xs gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white"
            >
              <Plus className="h-3.5 w-3.5" /> Build Another Resume
            </Button>
          </div>

          {resumes.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-border bg-card">
              <FileText className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
              <h4 className="text-sm font-semibold text-foreground">No resumes generated yet</h4>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto mb-4">
                Use our wizard to generate your first ATS-compliant resume targeted to any software role.
              </p>
              <Button
                size="sm"
                onClick={() => setActiveTab('create')}
                className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white"
              >
                Start Resume Builder
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {resumes.map((resume) => (
                <ResumeHistoryCard
                  key={resume.id}
                  resume={resume}
                  onDownload={handleDownload}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
