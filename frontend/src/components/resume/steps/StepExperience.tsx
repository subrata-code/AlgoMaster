import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Briefcase, Plus, Trash2, Sparkles } from 'lucide-react'
import type { ResumeData, ExperienceItem } from '@/types'

interface StepProps {
  data: Partial<ResumeData>
  updateData: (fields: Partial<ResumeData>) => void
}

export const StepExperience: React.FC<StepProps> = ({ data, updateData }) => {
  const experience = data.experience || []

  const handleAddExperience = () => {
    const newItem: ExperienceItem = {
      company: '',
      role: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      bullets: [''],
    }
    updateData({ experience: [...experience, newItem] })
  }

  const handleUpdateItem = (index: number, field: keyof ExperienceItem, val: any) => {
    const updated = [...experience]
    updated[index] = { ...updated[index], [field]: val }
    updateData({ experience: updated })
  }

  const handleRemoveItem = (index: number) => {
    updateData({ experience: experience.filter((_, i) => i !== index) })
  }

  const handleBulletChange = (expIndex: number, bulletIndex: number, val: string) => {
    const updated = [...experience]
    const bullets = [...(updated[expIndex].bullets || [])]
    bullets[bulletIndex] = val
    updated[expIndex] = { ...updated[expIndex], bullets }
    updateData({ experience: updated })
  }

  const handleAddBullet = (expIndex: number) => {
    const updated = [...experience]
    const bullets = [...(updated[expIndex].bullets || []), '']
    updated[expIndex] = { ...updated[expIndex], bullets }
    updateData({ experience: updated })
  }

  const handleRemoveBullet = (expIndex: number, bulletIndex: number) => {
    const updated = [...experience]
    const bullets = (updated[expIndex].bullets || []).filter((_, i) => i !== bulletIndex)
    updated[expIndex] = { ...updated[expIndex], bullets }
    updateData({ experience: updated })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-card border border-border/70">
        <div>
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-emerald-400" /> Work Experience & Internships
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            Freshers with no full-time experience can skip this or add internship/freelance work.
          </p>
        </div>
        <Button
          type="button"
          onClick={handleAddExperience}
          size="sm"
          className="gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 shrink-0"
        >
          <Plus className="h-3.5 w-3.5" /> Add Experience
        </Button>
      </div>

      {experience.length === 0 ? (
        <div className="text-center py-10 px-4 rounded-xl border border-dashed border-border/80 bg-white/[0.02]">
          <Briefcase className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
          <h5 className="text-sm font-medium text-foreground">No experience added yet</h5>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1 mb-4">
            If you are a fresher or student, feel free to proceed to Projects. Or add an internship if you have one.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddExperience}
            className="text-xs gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" /> Add First Experience
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {experience.map((exp, expIdx) => (
            <div
              key={expIdx}
              className="p-5 rounded-xl bg-card border border-border/80 space-y-4 relative group"
            >
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  Role #{expIdx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveItem(expIdx)}
                  className="text-muted-foreground hover:text-rose-400 text-xs flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Remove Role
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Job Title / Role *</Label>
                  <Input
                    value={exp.role}
                    onChange={(e) => handleUpdateItem(expIdx, 'role', e.target.value)}
                    placeholder="e.g. Software Engineer Intern"
                    className="bg-background/50 text-xs h-9"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Company Name *</Label>
                  <Input
                    value={exp.company}
                    onChange={(e) => handleUpdateItem(expIdx, 'company', e.target.value)}
                    placeholder="e.g. Google or Startup Inc."
                    className="bg-background/50 text-xs h-9"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Start Date</Label>
                  <Input
                    value={exp.startDate}
                    onChange={(e) => handleUpdateItem(expIdx, 'startDate', e.target.value)}
                    placeholder="e.g. Jan 2024"
                    className="bg-background/50 text-xs h-9"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-muted-foreground">End Date</Label>
                    <label className="flex items-center gap-1.5 text-[11px] text-muted-foreground cursor-pointer">
                      <input
                        type="checkbox"
                        checked={exp.isCurrent || false}
                        onChange={(e) => handleUpdateItem(expIdx, 'isCurrent', e.target.checked)}
                        className="rounded border-border text-emerald-500 focus:ring-0"
                      />
                      Current Role
                    </label>
                  </div>
                  <Input
                    value={exp.isCurrent ? 'Present' : exp.endDate}
                    disabled={exp.isCurrent}
                    onChange={(e) => handleUpdateItem(expIdx, 'endDate', e.target.value)}
                    placeholder="e.g. Present or Jul 2024"
                    className="bg-background/50 text-xs h-9"
                  />
                </div>
              </div>

              {/* Bullet Points */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3 text-amber-400" /> Key Responsibilities & Achievements
                  </Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAddBullet(expIdx)}
                    className="h-7 text-xs text-emerald-400 hover:text-emerald-300 px-2"
                  >
                    + Add Bullet
                  </Button>
                </div>

                <div className="space-y-2">
                  {(exp.bullets || []).map((bullet, bIdx) => (
                    <div key={bIdx} className="flex items-start gap-2">
                      <span className="text-muted-foreground mt-2 text-xs font-bold">&bull;</span>
                      <Textarea
                        value={bullet}
                        onChange={(e) => handleBulletChange(expIdx, bIdx, e.target.value)}
                        placeholder="e.g. Engineered RESTful microservices reducing API latency by 35% using Node.js and Redis..."
                        rows={2}
                        className="bg-background/50 text-xs resize-none"
                      />
                      {(exp.bullets || []).length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveBullet(expIdx, bIdx)}
                          className="text-muted-foreground hover:text-rose-400 mt-2 p-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
