import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { FolderGit2, Plus, Trash2 } from 'lucide-react'
import type { ResumeData, ProjectItem } from '@/types'

interface StepProps {
  data: Partial<ResumeData>
  updateData: (fields: Partial<ResumeData>) => void
}

export const StepProjects: React.FC<StepProps> = ({ data, updateData }) => {
  const projects = data.projects || []

  const handleAddProject = () => {
    const newProject: ProjectItem = {
      name: '',
      techStack: '',
      description: '',
      link: '',
      bullets: [''],
    }
    updateData({ projects: [...projects, newProject] })
  }

  const handleUpdateProject = (index: number, field: keyof ProjectItem, val: any) => {
    const updated = [...projects]
    updated[index] = { ...updated[index], [field]: val }
    updateData({ projects: updated })
  }

  const handleRemoveProject = (index: number) => {
    updateData({ projects: projects.filter((_, i) => i !== index) })
  }

  const handleBulletChange = (projIndex: number, bulletIndex: number, val: string) => {
    const updated = [...projects]
    const bullets = [...(updated[projIndex].bullets || [])]
    bullets[bulletIndex] = val
    updated[projIndex] = { ...updated[projIndex], bullets }
    updateData({ projects: updated })
  }

  const handleAddBullet = (projIndex: number) => {
    const updated = [...projects]
    const bullets = [...(updated[projIndex].bullets || []), '']
    updated[projIndex] = { ...updated[projIndex], bullets }
    updateData({ projects: updated })
  }

  const handleRemoveBullet = (projIndex: number, bulletIndex: number) => {
    const updated = [...projects]
    const bullets = (updated[projIndex].bullets || []).filter((_, i) => i !== bulletIndex)
    updated[projIndex] = { ...updated[projIndex], bullets }
    updateData({ projects: updated })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-card border border-border/70">
        <div>
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <FolderGit2 className="h-4 w-4 text-sky-400" /> Featured Projects (2-3 Recommended)
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            Technical projects carry high weight in ATS scoring for software roles.
          </p>
        </div>
        <Button
          type="button"
          onClick={handleAddProject}
          size="sm"
          className="gap-1.5 text-xs bg-sky-600 hover:bg-sky-500 shrink-0"
        >
          <Plus className="h-3.5 w-3.5" /> Add Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-10 px-4 rounded-xl border border-dashed border-border/80 bg-white/[0.02]">
          <FolderGit2 className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
          <h5 className="text-sm font-medium text-foreground">No projects added yet</h5>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1 mb-4">
            Showcase your best software engineering or algorithmic applications.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddProject}
            className="text-xs gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" /> Add First Project
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {projects.map((proj, projIdx) => (
            <div
              key={projIdx}
              className="p-5 rounded-xl bg-card border border-border/80 space-y-4 relative group"
            >
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider">
                  Project #{projIdx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveProject(projIdx)}
                  className="text-muted-foreground hover:text-rose-400 text-xs flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Remove Project
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Project Title *</Label>
                  <Input
                    value={proj.name}
                    onChange={(e) => handleUpdateProject(projIdx, 'name', e.target.value)}
                    placeholder="e.g. AlgoMaster DSA Analytics Platform"
                    className="bg-background/50 text-xs h-9"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Technologies Used *</Label>
                  <Input
                    value={proj.techStack}
                    onChange={(e) => handleUpdateProject(projIdx, 'techStack', e.target.value)}
                    placeholder="e.g. React, TypeScript, FastAPI, MongoDB, Tailwind"
                    className="bg-background/50 text-xs h-9"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <Label className="text-xs text-muted-foreground">Live URL / GitHub Repo</Label>
                  <Input
                    value={proj.link || ''}
                    onChange={(e) => handleUpdateProject(projIdx, 'link', e.target.value)}
                    placeholder="e.g. https://github.com/username/project"
                    className="bg-background/50 text-xs h-9"
                  />
                </div>
              </div>

              {/* Bullet Points */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold text-foreground">
                    Project Highlights & Technical Challenges
                  </Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAddBullet(projIdx)}
                    className="h-7 text-xs text-sky-400 hover:text-sky-300 px-2"
                  >
                    + Add Highlight
                  </Button>
                </div>

                <div className="space-y-2">
                  {(proj.bullets || []).map((bullet, bIdx) => (
                    <div key={bIdx} className="flex items-start gap-2">
                      <span className="text-muted-foreground mt-2 text-xs font-bold">&bull;</span>
                      <Textarea
                        value={bullet}
                        onChange={(e) => handleBulletChange(projIdx, bIdx, e.target.value)}
                        placeholder="e.g. Architected responsive dashboards using React and Vite, achieving 99+ Lighthouse performance score..."
                        rows={2}
                        className="bg-background/50 text-xs resize-none"
                      />
                      {(proj.bullets || []).length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveBullet(projIdx, bIdx)}
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
