import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { GraduationCap, Award, Plus, Trash2, X } from 'lucide-react'
import type { ResumeData, EducationItem, CertificationItem } from '@/types'

interface StepProps {
  data: Partial<ResumeData>
  updateData: (fields: Partial<ResumeData>) => void
}

export const StepEducation: React.FC<StepProps> = ({ data, updateData }) => {
  const [skillInput, setSkillInput] = useState('')
  const skills = data.skills || []
  const education = data.education || []
  const certifications = data.certifications || []

  // Add skill
  const handleAddSkill = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const trimmed = skillInput.trim()
    if (!trimmed) return
    const newSkills = trimmed.split(',').map((s) => s.trim()).filter(Boolean)
    const combined = Array.from(new Set([...skills, ...newSkills]))
    updateData({ skills: combined })
    setSkillInput('')
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    updateData({ skills: skills.filter((s) => s !== skillToRemove) })
  }

  // Education handlers
  const handleAddEducation = () => {
    const newItem: EducationItem = {
      college: '',
      degree: '',
      graduationYear: '',
      cgpa: '',
    }
    updateData({ education: [...education, newItem] })
  }

  const handleUpdateEdu = (index: number, field: keyof EducationItem, val: string) => {
    const updated = [...education]
    updated[index] = { ...updated[index], [field]: val }
    updateData({ education: updated })
  }

  const handleRemoveEdu = (index: number) => {
    updateData({ education: education.filter((_, i) => i !== index) })
  }

  // Certifications handlers
  const handleAddCert = () => {
    const newCert: CertificationItem = { name: '', issuer: '', year: '' }
    updateData({ certifications: [...certifications, newCert] })
  }

  const handleUpdateCert = (index: number, field: keyof CertificationItem, val: string) => {
    const updated = [...certifications]
    updated[index] = { ...updated[index], [field]: val }
    updateData({ certifications: updated })
  }

  const handleRemoveCert = (index: number) => {
    updateData({ certifications: certifications.filter((_, i) => i !== index) })
  }

  return (
    <div className="space-y-8">
      {/* 1. Technical Skills */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold text-foreground">
            Technical Skills ({skills.length})
          </Label>
          <span className="text-xs text-muted-foreground">Type a skill and hit Enter or comma</span>
        </div>

        <div className="flex gap-2">
          <Input
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault()
                handleAddSkill()
              }
            }}
            placeholder="e.g. React, Node.js, Python, PostgreSQL, System Design"
            className="bg-card border-border/80"
          />
          <Button
            type="button"
            variant="secondary"
            onClick={() => handleAddSkill()}
            className="shrink-0 gap-1 text-xs"
          >
            <Plus className="h-4 w-4" /> Add
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 pt-1 max-h-48 overflow-y-auto">
          {skills.map((skill, idx) => (
            <Badge
              key={idx}
              className="bg-white/5 border border-white/10 text-white/90 text-xs px-2.5 py-1 gap-1.5 hover:bg-white/10 transition-colors"
            >
              <span>{skill}</span>
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="text-white/40 hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {skills.length === 0 && (
            <span className="text-xs text-muted-foreground italic">
              No skills added yet. Add your top programming languages and frameworks.
            </span>
          )}
        </div>
      </div>

      {/* 2. Education */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-purple-400" />
            <h4 className="text-sm font-semibold text-foreground">Education</h4>
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleAddEducation}
            className="h-8 gap-1 text-xs border-dashed"
          >
            <Plus className="h-3.5 w-3.5" /> Add Degree
          </Button>
        </div>

        {education.map((edu, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-card border border-border/70 space-y-3 relative group"
          >
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-muted-foreground">Education #{idx + 1}</span>
              {education.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveEdu(idx)}
                  className="text-muted-foreground hover:text-rose-400 text-xs transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-[11px] text-muted-foreground">Degree / Major</Label>
                <Input
                  value={edu.degree}
                  onChange={(e) => handleUpdateEdu(idx, 'degree', e.target.value)}
                  placeholder="e.g. B.Tech in Computer Science"
                  className="bg-background/50 h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-[11px] text-muted-foreground">College / University</Label>
                <Input
                  value={edu.college}
                  onChange={(e) => handleUpdateEdu(idx, 'college', e.target.value)}
                  placeholder="e.g. National Institute of Technology"
                  className="bg-background/50 h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-[11px] text-muted-foreground">Graduation Year</Label>
                <Input
                  value={edu.graduationYear}
                  onChange={(e) => handleUpdateEdu(idx, 'graduationYear', e.target.value)}
                  placeholder="e.g. 2025"
                  className="bg-background/50 h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-[11px] text-muted-foreground">CGPA / Grade (Optional)</Label>
                <Input
                  value={edu.cgpa || ''}
                  onChange={(e) => handleUpdateEdu(idx, 'cgpa', e.target.value)}
                  placeholder="e.g. 8.9 / 10"
                  className="bg-background/50 h-9 text-xs"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Certifications (Optional) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-amber-400" />
            <h4 className="text-sm font-semibold text-foreground">Certifications & Honors (Optional)</h4>
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleAddCert}
            className="h-8 gap-1 text-xs border-dashed"
          >
            <Plus className="h-3.5 w-3.5" /> Add Certification
          </Button>
        </div>

        {certifications.map((cert, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <Input
              value={cert.name}
              onChange={(e) => handleUpdateCert(idx, 'name', e.target.value)}
              placeholder="Certification Title (e.g. AWS Certified Solutions Architect)"
              className="bg-card h-9 text-xs flex-2"
            />
            <Input
              value={cert.issuer}
              onChange={(e) => handleUpdateCert(idx, 'issuer', e.target.value)}
              placeholder="Issuing Org (e.g. Amazon Web Services)"
              className="bg-card h-9 text-xs flex-1"
            />
            <Input
              value={cert.year}
              onChange={(e) => handleUpdateCert(idx, 'year', e.target.value)}
              placeholder="Year"
              className="bg-card h-9 text-xs w-24"
            />
            <button
              type="button"
              onClick={() => handleRemoveCert(idx)}
              className="text-muted-foreground hover:text-rose-400 p-2"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
