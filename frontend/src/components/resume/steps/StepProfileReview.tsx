import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { User, Mail, Phone, MapPin, Link2, Globe, Sparkles } from 'lucide-react'
import type { ResumeData } from '@/types'

interface StepProps {
  data: Partial<ResumeData>
  updateData: (fields: Partial<ResumeData>) => void
}

export const StepProfileReview: React.FC<StepProps> = ({ data, updateData }) => {
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-start gap-3">
        <Sparkles className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-semibold text-indigo-300">Auto-fetched from your AlgoMaster Profile</h4>
          <p className="text-xs text-indigo-200/70 mt-0.5">
            We verified and imported your profile details. Feel free to refine or add any missing information below.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-blue-400" /> Full Name *
          </Label>
          <Input
            value={data.fullName || ''}
            onChange={(e) => updateData({ fullName: e.target.value })}
            placeholder="e.g. Subrata Debnath"
            className="bg-card border-border/80"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5 text-blue-400" /> Email Address *
          </Label>
          <Input
            value={data.email || ''}
            onChange={(e) => updateData({ email: e.target.value })}
            placeholder="e.g. subrata@example.com"
            className="bg-card border-border/80"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Phone className="h-3.5 w-3.5 text-emerald-400" /> Phone Number
          </Label>
          <Input
            value={data.phone || ''}
            onChange={(e) => updateData({ phone: e.target.value })}
            placeholder="+91 98765 43210"
            className="bg-card border-border/80"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-rose-400" /> Location (City, Country)
          </Label>
          <Input
            value={data.location || ''}
            onChange={(e) => updateData({ location: e.target.value })}
            placeholder="e.g. Bengaluru, India"
            className="bg-card border-border/80"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Link2 className="h-3.5 w-3.5 text-sky-400" /> LinkedIn Profile / URL
          </Label>
          <Input
            value={data.linkedin || ''}
            onChange={(e) => updateData({ linkedin: e.target.value })}
            placeholder="linkedin.com/in/username"
            className="bg-card border-border/80"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Link2 className="h-3.5 w-3.5 text-purple-400" /> GitHub Profile / URL
          </Label>
          <Input
            value={data.github || ''}
            onChange={(e) => updateData({ github: e.target.value })}
            placeholder="github.com/username"
            className="bg-card border-border/80"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Globe className="h-3.5 w-3.5 text-amber-400" /> Portfolio Website (Optional)
          </Label>
          <Input
            value={data.portfolio || ''}
            onChange={(e) => updateData({ portfolio: e.target.value })}
            placeholder="https://yourportfolio.dev"
            className="bg-card border-border/80"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Professional Summary (Optional)</Label>
            <span className="text-[11px] text-muted-foreground">Leave blank to auto-generate from target role</span>
          </div>
          <Textarea
            value={data.summary || ''}
            onChange={(e) => updateData({ summary: e.target.value })}
            placeholder="Summary of your technical expertise and career highlights. We'll automatically optimize this with strong ATS action verbs."
            rows={3}
            className="bg-card border-border/80 resize-none text-sm"
          />
        </div>
      </div>
    </div>
  )
}
