import React from 'react'
import { FileText, Download, Trash2, Calendar, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import type { ResumeData } from '@/types'

interface ResumeHistoryCardProps {
  resume: ResumeData
  onDownload: (id: string, name: string) => void
  onDelete: (id: string) => void
}

export const ResumeHistoryCard: React.FC<ResumeHistoryCardProps> = ({
  resume,
  onDownload,
  onDelete,
}) => {
  const score = resume.atsScore || 0
  const scoreColor =
    score >= 80 ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
    score >= 60 ? 'text-blue-400 bg-blue-500/10 border-blue-500/20' :
    'text-amber-400 bg-amber-500/10 border-amber-500/20'

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-card border border-border/60 hover:border-border transition-all">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          <FileText className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-semibold text-foreground text-sm">
              {resume.targetRole || 'Software Engineer'}
            </h4>
            {resume.targetCompany && (
              <Badge variant="outline" className="text-[10px] bg-white/5 border-white/10">
                {resume.targetCompany}
              </Badge>
            )}
            <Badge className={`text-xs px-2 py-0.5 border ${scoreColor}`}>
              ATS: {score}/100
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {resume.createdAt ? formatDate(resume.createdAt) : 'Recently generated'}
            </span>
            {resume.keywordsMatched && (
              <span className="flex items-center gap-1 text-emerald-400/90">
                <CheckCircle2 className="h-3 w-3" />
                {resume.keywordsMatched.length} keywords matched
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        <Button
          size="sm"
          variant="outline"
          onClick={() => resume.id && onDownload(resume.id, resume.fullName || 'Resume')}
          className="h-8 gap-1.5 text-xs border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/10"
        >
          <Download className="h-3.5 w-3.5" />
          Download PDF
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => resume.id && onDelete(resume.id)}
          className="h-8 w-8 p-0 text-muted-foreground hover:text-red-400 hover:bg-red-500/10"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}
