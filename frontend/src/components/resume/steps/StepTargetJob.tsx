import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Target, Sparkles, FileSearch, Building2, CheckCircle2 } from 'lucide-react'
import { resumeService } from '@/services'
import type { ResumeData } from '@/types'

interface StepProps {
  data: Partial<ResumeData>
  updateData: (fields: Partial<ResumeData>) => void
}

const COMMON_ROLES = [
  'SDE / Software Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Full-stack Developer',
  'Data Scientist / ML Engineer',
  'DevOps Engineer',
  'Mobile App Developer (iOS/Android)',
  'System Engineer',
]

const EXPERIENCE_LEVELS = [
  'Fresher / College Student',
  'Entry-Level (0 - 1 Years)',
  'Mid-Level (1 - 3 Years)',
  'Senior (3 - 5+ Years)',
]

export const StepTargetJob: React.FC<StepProps> = ({ data, updateData }) => {
  const [analyzingJD, setAnalyzingJD] = useState(false)
  const [extractedKeywords, setExtractedKeywords] = useState<string[]>([])

  const handleAnalyzeJD = async () => {
    if (!data.jobDescription?.trim()) return
    setAnalyzingJD(true)
    try {
      const res = await resumeService.parseJobDescription(
        data.jobDescription,
        data.targetRole || ''
      )
      setExtractedKeywords(res.keywords || [])
    } catch {
      // ignore
    } finally {
      setAnalyzingJD(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 flex items-start gap-3">
        <Target className="h-5 w-5 text-purple-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-semibold text-purple-300">Target Role & Job Description Alignment</h4>
          <p className="text-xs text-purple-200/70 mt-0.5">
            Our Python engine extracts core tech requirements and formats your resume so you hit maximum ATS score for this specific position.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Role Selector */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Target className="h-3.5 w-3.5 text-blue-400" /> Target Job Role *
          </Label>
          <select
            value={data.targetRole || ''}
            onChange={(e) => updateData({ targetRole: e.target.value })}
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-indigo-500"
          >
            <option value="">Select a common role or type below...</option>
            {COMMON_ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <Input
            value={data.targetRole || ''}
            onChange={(e) => updateData({ targetRole: e.target.value })}
            placeholder="Or type custom role (e.g. Platform Engineer)"
            className="bg-card text-xs mt-1.5 h-8"
          />
        </div>

        {/* Experience Level & Target Company */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
              Experience Level
            </Label>
            <select
              value={data.experienceLevel || 'Fresher / College Student'}
              onChange={(e) => updateData({ experienceLevel: e.target.value })}
              className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-indigo-500"
            >
              {EXPERIENCE_LEVELS.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-amber-400" /> Target Company (Optional)
            </Label>
            <Input
              value={data.targetCompany || ''}
              onChange={(e) => updateData({ targetCompany: e.target.value })}
              placeholder="e.g. Google, Microsoft, Atlassian, Startup"
              className="bg-card text-xs h-9"
            />
          </div>
        </div>

        {/* Job Description Paste Box */}
        <div className="space-y-2 md:col-span-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
              <FileSearch className="h-3.5 w-3.5 text-emerald-400" />
              Paste Job Description (JD) Text (Highly Recommended for 100% Match)
            </Label>
            {data.jobDescription && data.jobDescription.length > 20 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleAnalyzeJD}
                disabled={analyzingJD}
                className="h-7 text-xs text-emerald-400 hover:text-emerald-300 gap-1 px-2"
              >
                <Sparkles className="h-3 w-3" />
                {analyzingJD ? 'Analyzing...' : 'Extract JD Keywords'}
              </Button>
            )}
          </div>
          <Textarea
            value={data.jobDescription || ''}
            onChange={(e) => updateData({ jobDescription: e.target.value })}
            placeholder="Paste the raw requirements or job description text here (skills, qualifications, stack)... Our Python engine will identify every single keyword the company scans for."
            rows={6}
            className="bg-card text-xs resize-y font-mono"
          />
        </div>
      </div>

      {/* Extracted Keywords Preview */}
      {extractedKeywords.length > 0 && (
        <div className="p-4 rounded-xl bg-card border border-border/80 space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <h5 className="text-xs font-semibold text-foreground">
              Extracted Keywords from JD ({extractedKeywords.length})
            </h5>
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pt-1">
            {extractedKeywords.map((kw, i) => (
              <Badge
                key={i}
                className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] px-2 py-0.5 font-normal"
              >
                {kw}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
