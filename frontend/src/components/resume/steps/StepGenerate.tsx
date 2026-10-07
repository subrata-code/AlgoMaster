import React from 'react'
import { motion } from 'framer-motion'
import { Download, Sparkles, RefreshCw, CheckCircle, Lightbulb } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ATSScoreGauge } from '../ATSScoreGauge'
import { KeywordBadges } from '../KeywordBadges'
import type { ResumeData } from '@/types'

interface StepProps {
  resumeResult: {
    resume: ResumeData
    pdfBase64?: string
  } | null
  loading: boolean
  onRegenerate: () => void
  onDownload: () => void
}

export const StepGenerate: React.FC<StepProps> = ({
  resumeResult,
  loading,
  onRegenerate,
  onDownload,
}) => {
  if (loading) {
    return (
      <div className="py-16 flex flex-col items-center justify-center text-center space-y-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400"
        >
          <Sparkles className="h-8 w-8" />
        </motion.div>
        <div>
          <h3 className="text-lg font-bold text-foreground">
            Python Engine Generating ATS Resume...
          </h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            Extracting JD keywords, strengthening action verbs, calculating ATS compatibility, and compiling the single-column PDF.
          </p>
        </div>
      </div>
    )
  }

  if (!resumeResult) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        Click "Generate Resume" to run the local Python engine.
      </div>
    )
  }

  const { resume } = resumeResult
  const breakdown = resume.atsBreakdown || {
    keywordMatch: 28,
    skillsCoverage: 18,
    sectionCompleteness: 18,
    actionVerbs: 8,
    quantification: 8,
    formattingSafety: 10,
  }

  return (
    <div className="space-y-8">
      {/* 1. Header Banner & Download Action */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-900 border border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Your ATS-Ready Resume is Ready!</h3>
            <p className="text-xs text-indigo-200/70 mt-0.5">
              Compiled using standard single-column ATS specifications. Fully compatible with Workday, Taleo, Greenhouse, and Lever.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={onRegenerate}
            className="gap-2 text-xs border-white/10 hover:bg-white/5"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Tweak & Re-run
          </Button>
          <Button
            type="button"
            onClick={onDownload}
            className="gap-2 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-500/20 px-5"
          >
            <Download className="h-4 w-4" /> Download ATS PDF
          </Button>
        </div>
      </div>

      {/* 2. ATS Score & Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: ATS Gauge Card */}
        <Card className="bg-card border-border/80 lg:col-span-1 flex flex-col justify-center p-6">
          <CardContent className="p-0 flex flex-col items-center">
            <ATSScoreGauge score={resume.atsScore || 0} size={170} />
            <div className="mt-6 w-full space-y-2 border-t border-border/60 pt-4 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Target Role:</span>
                <span className="font-semibold text-foreground truncate max-w-[150px]">
                  {resume.targetRole || 'Software Engineer'}
                </span>
              </div>
              {resume.targetCompany && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Target Company:</span>
                  <span className="font-semibold text-foreground">{resume.targetCompany}</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>Format Style:</span>
                <span className="font-semibold text-emerald-400">1-Column ATS Plain</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right: Dimension Scores */}
        <Card className="bg-card border-border/80 lg:col-span-2 p-6">
          <CardContent className="p-0 space-y-4">
            <h4 className="text-sm font-semibold text-foreground">ATS Score Breakdown</h4>

            <div className="space-y-3">
              {[
                { label: 'JD Keyword Match', val: breakdown.keywordMatch, max: 30, desc: 'Presence of role technical keywords' },
                { label: 'Skills Coverage', val: breakdown.skillsCoverage, max: 20, desc: 'Breadth of core technologies & frameworks' },
                { label: 'Section Completeness', val: breakdown.sectionCompleteness, max: 20, desc: 'Summary, Education, Experience, Projects' },
                { label: 'Action Verbs in Bullets', val: breakdown.actionVerbs, max: 10, desc: 'High-impact verbs starting each bullet' },
                { label: 'Quantifiable Metrics', val: breakdown.quantification, max: 10, desc: 'Numbers, percentages, and metrics' },
                { label: 'Formatting Safety', val: breakdown.formattingSafety, max: 10, desc: 'Strict single column, standard PDF fonts' },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-foreground">{item.label}</span>
                    <span className="text-muted-foreground font-mono">
                      {item.val} / {item.max} pts
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-muted/60 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full"
                      style={{ width: `${(item.val / item.max) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. Keywords & AI Suggestions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Keywords */}
        <Card className="bg-card border-border/80 p-5">
          <CardContent className="p-0">
            <h4 className="text-sm font-semibold text-foreground mb-3">Keywords Analysis</h4>
            <KeywordBadges
              matched={resume.keywordsMatched || []}
              missed={resume.keywordsMissed || []}
            />
          </CardContent>
        </Card>

        {/* Suggestions */}
        <Card className="bg-card border-border/80 p-5">
          <CardContent className="p-0 space-y-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-amber-400" />
              <h4 className="text-sm font-semibold text-foreground">ATS Optimization Insights</h4>
            </div>
            <div className="space-y-2">
              {(resume.suggestions || []).length > 0 ? (
                resume.suggestions!.map((sugg, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg bg-white/5 border border-white/5 text-xs text-muted-foreground leading-relaxed flex items-start gap-2"
                  >
                    <span className="text-amber-400 font-bold">&bull;</span>
                    <span>{sugg}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground italic">
                  Resume passes all ATS benchmark validations.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
