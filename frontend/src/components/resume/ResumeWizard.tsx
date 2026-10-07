import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Sparkles, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StepProfileReview } from './steps/StepProfileReview'
import { StepEducation } from './steps/StepEducation'
import { StepExperience } from './steps/StepExperience'
import { StepProjects } from './steps/StepProjects'
import { StepTargetJob } from './steps/StepTargetJob'
import { StepGenerate } from './steps/StepGenerate'
import type { ResumeData } from '@/types'

const STEPS = [
  { id: 1, title: 'Profile' },
  { id: 2, title: 'Education & Skills' },
  { id: 3, title: 'Experience' },
  { id: 4, title: 'Projects' },
  { id: 5, title: 'Target Job' },
  { id: 6, title: 'ATS Result' },
]

interface ResumeWizardProps {
  initialData: Partial<ResumeData>
  onGenerate: (data: Partial<ResumeData>) => Promise<{ resume: ResumeData; pdfBase64?: string }>
}

export const ResumeWizard: React.FC<ResumeWizardProps> = ({ initialData, onGenerate }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<Partial<ResumeData>>(initialData)
  const [generating, setGenerating] = useState(false)
  const [generationResult, setGenerationResult] = useState<{
    resume: ResumeData
    pdfBase64?: string
  } | null>(null)

  const updateFormData = (fields: Partial<ResumeData>) => {
    setFormData((prev) => ({ ...prev, ...fields }))
  }

  const handleNext = async () => {
    if (currentStep === 5) {
      // Step 5 -> Step 6: Trigger Python engine generation
      setCurrentStep(6)
      setGenerating(true)
      try {
        const res = await onGenerate(formData)
        setGenerationResult(res)
      } catch (err) {
        // error handling
      } finally {
        setGenerating(false)
      }
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length))
    }
  }

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleDownload = () => {
    if (!generationResult) return
    const { resume, pdfBase64 } = generationResult
    if (pdfBase64) {
      const linkSource = `data:application/pdf;base64,${pdfBase64}`
      const downloadLink = document.createElement('a')
      const fileName = `${(resume.fullName || 'Resume').replace(/\s+/g, '_')}_ATS.pdf`
      downloadLink.href = linkSource
      downloadLink.download = fileName
      downloadLink.click()
    } else if (resume.id) {
      window.open(`/api/resume/${resume.id}/download`, '_blank')
    }
  }

  return (
    <div className="space-y-6">
      {/* Step Progress Bar */}
      <div className="rounded-2xl bg-card border border-border/80 p-4 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 h-0.5 bg-border -z-0" />
          {STEPS.map((step) => {
            const isCompleted = step.id < currentStep
            const isCurrent = step.id === currentStep

            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => step.id < currentStep && setCurrentStep(step.id)}
                  className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full text-xs font-bold transition-all ${
                    isCompleted
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                      : isCurrent
                      ? 'bg-indigo-600 text-white ring-4 ring-indigo-500/20'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : step.id}
                </button>
                <span
                  className={`mt-2 hidden md:block text-[11px] font-medium transition-colors ${
                    isCurrent ? 'text-foreground font-semibold' : 'text-muted-foreground'
                  }`}
                >
                  {step.title}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Wizard Form Card */}
      <Card className="border-border/80 bg-card overflow-hidden">
        <CardHeader className="border-b border-border/60 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider">
                Step {currentStep} of {STEPS.length}
              </span>
              <CardTitle className="text-xl font-bold text-foreground mt-0.5">
                {STEPS.find((s) => s.id === currentStep)?.title}
              </CardTitle>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {currentStep === 1 && (
                <StepProfileReview data={formData} updateData={updateFormData} />
              )}
              {currentStep === 2 && (
                <StepEducation data={formData} updateData={updateFormData} />
              )}
              {currentStep === 3 && (
                <StepExperience data={formData} updateData={updateFormData} />
              )}
              {currentStep === 4 && (
                <StepProjects data={formData} updateData={updateFormData} />
              )}
              {currentStep === 5 && (
                <StepTargetJob data={formData} updateData={updateFormData} />
              )}
              {currentStep === 6 && (
                <StepGenerate
                  resumeResult={generationResult}
                  loading={generating}
                  onRegenerate={() => setCurrentStep(5)}
                  onDownload={handleDownload}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          {currentStep !== 6 && (
            <div className="flex items-center justify-between border-t border-border/60 pt-6 mt-8">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handlePrev}
                disabled={currentStep === 1}
                className="gap-1.5 text-xs"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back
              </Button>

              <Button
                type="button"
                size="sm"
                onClick={handleNext}
                disabled={currentStep === 1 && (!formData.fullName || !formData.email)}
                className={`gap-1.5 text-xs ${
                  currentStep === 5
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/25 px-5'
                    : 'bg-primary text-primary-foreground'
                }`}
              >
                {currentStep === 5 ? (
                  <>
                    <Sparkles className="h-3.5 w-3.5" /> Generate 100% ATS Resume
                  </>
                ) : (
                  <>
                    Next <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
