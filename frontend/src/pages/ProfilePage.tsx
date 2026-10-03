import { useEffect, useState, useCallback } from 'react'
import { BookOpen, Briefcase, Check, GraduationCap, Link2, Pencil, Save, UserCircle, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader } from '@/components/EmptyState'
import { PageHeader } from '@/components/PageHeader'
import { useAuth } from '@/context/AuthContext'
import { userService } from '@/services'
import { toast } from '@/hooks/use-toast'
import { formatDate } from '@/lib/utils'
import type { User } from '@/types'

/* ─── Profile Completion Logic ─── */

interface ProfileSection {
  id: string
  title: string
  icon: React.ElementType
  color: string
  bgColor: string
  fields: { key: keyof User; label: string }[]
}

const SECTIONS: ProfileSection[] = [
  {
    id: 'basic',
    title: 'Basic Info',
    icon: UserCircle,
    color: 'text-blue-400',
    bgColor: 'from-blue-500/20 to-blue-600/10 border-blue-500/25',
    fields: [
      { key: 'name', label: 'Full Name' },
      { key: 'bio', label: 'Bio' },
      { key: 'location', label: 'City / State' },
      { key: 'phone', label: 'Phone Number' },
    ],
  },
  {
    id: 'education',
    title: 'Education',
    icon: GraduationCap,
    color: 'text-purple-400',
    bgColor: 'from-purple-500/20 to-purple-600/10 border-purple-500/25',
    fields: [
      { key: 'college', label: 'College / University' },
      { key: 'degree', label: 'Degree (e.g. B.Tech CS)' },
      { key: 'graduationYear', label: 'Graduation Year' },
    ],
  },
  {
    id: 'professional',
    title: 'Professional Goals',
    icon: Briefcase,
    color: 'text-emerald-400',
    bgColor: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/25',
    fields: [
      { key: 'skills', label: 'Skills (comma-separated)' },
      { key: 'targetCompanyType', label: 'Target Company Type' },
      { key: 'targetRole', label: 'Target Role' },
    ],
  },
  {
    id: 'links',
    title: 'Social & Links',
    icon: Link2,
    color: 'text-amber-400',
    bgColor: 'from-amber-500/20 to-amber-600/10 border-amber-500/25',
    fields: [
      { key: 'github', label: 'GitHub Username' },
      { key: 'linkedin', label: 'LinkedIn Username' },
      { key: 'portfolio', label: 'Portfolio URL' },
    ],
  },
]

const COMPANY_TYPES = ['FAANG / MAANG', 'Product-based', 'Startup', 'Service-based', 'Any']
const ROLES = ['SDE / Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full-stack Developer', 'DevOps Engineer', 'Data Scientist', 'Other']

function isFieldFilled(user: User, key: keyof User): boolean {
  const val = user[key]
  if (Array.isArray(val)) return val.length > 0
  return typeof val === 'string' ? val.trim().length > 0 : Boolean(val)
}

function getSectionCompletion(user: User, section: ProfileSection): number {
  const filled = section.fields.filter((f) => isFieldFilled(user, f.key)).length
  return Math.round((filled / section.fields.length) * 100)
}

function getOverallCompletion(user: User): number {
  const total = SECTIONS.reduce((sum, s) => sum + s.fields.length, 0)
  const filled = SECTIONS.reduce(
    (sum, s) => sum + s.fields.filter((f) => isFieldFilled(user, f.key)).length,
    0
  )
  return Math.round((filled / total) * 100)
}

/* ─── Circular Progress Ring ─── */
function ProgressRing({ percent, size = 72, stroke = 5 }: { percent: number; size?: number; stroke?: number }) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percent / 100) * circumference
  const color = percent === 100 ? '#22c55e' : percent >= 50 ? '#3b82f6' : '#f59e0b'

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {percent === 100 ? (
          <Check className="h-5 w-5 text-green-400" />
        ) : (
          <span className="text-sm font-bold text-white/90">{percent}%</span>
        )}
      </div>
    </div>
  )
}

/* ─── Section Progress Bar ─── */
function SectionProgressBar({ percent }: { percent: number }) {
  const color = percent === 100 ? 'bg-green-500' : percent >= 50 ? 'bg-blue-500' : 'bg-amber-500'
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-700 ease-out`} style={{ width: `${percent}%` }} />
      </div>
      <span className="text-[11px] font-mono text-white/50 w-8 text-right">{percent}%</span>
    </div>
  )
}

/* ─── Main ProfilePage ─── */
export default function ProfilePage() {
  const { setUser: setAuthUser } = useAuth()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  const loadUser = useCallback(async () => {
    try {
      const u = await userService.getCurrentUser()
      setUser(u)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadUser()
  }, [loadUser])

  if (loading || !user) return <Loader />

  const overall = getOverallCompletion(user)

  const startEditing = (section: ProfileSection) => {
    const data: Record<string, string> = {}
    for (const f of section.fields) {
      const val = user[f.key]
      data[f.key] = Array.isArray(val) ? val.join(', ') : (val as string) ?? ''
    }
    setFormData(data)
    setEditingSection(section.id)
  }

  const cancelEditing = () => {
    setEditingSection(null)
    setFormData({})
  }

  const handleSave = async (section: ProfileSection) => {
    setSaving(true)
    try {
      const payload: Record<string, unknown> = {}
      for (const f of section.fields) {
        if (f.key === 'skills') {
          payload.skills = formData.skills
            ?.split(',')
            .map((s) => s.trim())
            .filter(Boolean) ?? []
        } else {
          payload[f.key] = formData[f.key] ?? ''
        }
      }
      const updated = await userService.updateProfile(payload as Partial<User>)
      setUser(updated)
      setAuthUser(updated)
      setEditingSection(null)
      setFormData({})
      toast({ title: 'Profile updated', description: `${section.title} saved successfully.` })
    } catch (error) {
      toast({ title: 'Save failed', description: error instanceof Error ? error.message : 'Unable to save.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader title="Profile" description="Complete your profile to get personalised recommendations." />

      {/* ─── Profile Card ─── */}
      <Card className="mb-6 overflow-hidden border-white/10 bg-gradient-to-br from-[#0e0e18] to-[#12121f]">
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            {/* Avatar + Ring */}
            <div className="relative mx-auto sm:mx-0">
              <ProgressRing percent={overall} size={88} stroke={4} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#2563eb] to-[#7c3aed] text-lg font-bold text-white shadow-lg">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="h-full w-full rounded-full object-cover" />
                  ) : (
                    user.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
                  )}
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl font-bold text-white">{user.name}</h2>
              <p className="text-sm text-white/50">@{user.username} · Joined {formatDate(user.joinedAt)}</p>
              {user.bio && <p className="mt-2 max-w-xl text-sm text-white/60">{user.bio}</p>}
              <div className="mt-3 flex flex-wrap gap-2 justify-center sm:justify-start">
                {user.location && (
                  <Badge variant="secondary" className="bg-white/5 border-white/10 text-white/60 text-[11px]">
                    📍 {user.location}
                  </Badge>
                )}
                {user.college && (
                  <Badge variant="secondary" className="bg-white/5 border-white/10 text-white/60 text-[11px]">
                    🎓 {user.college}
                  </Badge>
                )}
                {user.targetRole && (
                  <Badge variant="secondary" className="bg-white/5 border-white/10 text-white/60 text-[11px]">
                    🎯 {user.targetRole}
                  </Badge>
                )}
              </div>
            </div>

            {/* Overall Completion */}
            <div className="text-center shrink-0">
              <div className="text-3xl font-bold text-white">{overall}%</div>
              <p className="text-[11px] text-white/40 mt-1">Profile Complete</p>
              {overall < 100 && (
                <p className="text-[10px] text-amber-400/70 mt-0.5">
                  {100 - overall}% pending
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ─── Sections Grid ─── */}
      <div className="grid gap-4 md:grid-cols-2">
        {SECTIONS.map((section) => {
          const pct = getSectionCompletion(user, section)
          const isEditing = editingSection === section.id

          return (
            <Card
              key={section.id}
              className={`overflow-hidden border-white/10 transition-all ${
                isEditing ? 'ring-1 ring-blue-500/40 border-blue-500/30' : 'hover:border-white/20'
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br border ${section.bgColor}`}>
                      <section.icon className={`h-4 w-4 ${section.color}`} />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-semibold text-white">{section.title}</CardTitle>
                      <SectionProgressBar percent={pct} />
                    </div>
                  </div>

                  {!isEditing ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEditing(section)}
                      className="text-white/50 hover:text-white hover:bg-white/10 h-8 px-2.5"
                    >
                      <Pencil className="h-3.5 w-3.5 mr-1" />
                      <span className="text-xs">Edit</span>
                    </Button>
                  ) : (
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={cancelEditing}
                        className="text-white/50 hover:text-white hover:bg-white/10 h-8 px-2"
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleSave(section)}
                        disabled={saving}
                        className="h-8 px-3 text-xs bg-blue-600 hover:bg-blue-500"
                      >
                        <Save className="h-3.5 w-3.5 mr-1" />
                        {saving ? 'Saving...' : 'Save'}
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                {isEditing ? (
                  <div className="space-y-3">
                    {section.fields.map((field) => (
                      <div key={field.key} className="space-y-1">
                        <Label className="text-[11px] text-white/50">{field.label}</Label>
                        {field.key === 'targetCompanyType' ? (
                          <select
                            value={formData[field.key] ?? ''}
                            onChange={(e) => setFormData((prev) => ({ ...prev, [field.key]: e.target.value }))}
                            className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-blue-500/50 transition-colors"
                          >
                            <option value="" className="bg-[#0e0e16]">Select type...</option>
                            {COMPANY_TYPES.map((t) => (
                              <option key={t} value={t} className="bg-[#0e0e16]">{t}</option>
                            ))}
                          </select>
                        ) : field.key === 'targetRole' ? (
                          <select
                            value={formData[field.key] ?? ''}
                            onChange={(e) => setFormData((prev) => ({ ...prev, [field.key]: e.target.value }))}
                            className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-blue-500/50 transition-colors"
                          >
                            <option value="" className="bg-[#0e0e16]">Select role...</option>
                            {ROLES.map((r) => (
                              <option key={r} value={r} className="bg-[#0e0e16]">{r}</option>
                            ))}
                          </select>
                        ) : (
                          <Input
                            value={formData[field.key] ?? ''}
                            onChange={(e) => setFormData((prev) => ({ ...prev, [field.key]: e.target.value }))}
                            placeholder={field.label}
                            className="bg-white/5 border-white/15 text-white placeholder:text-white/30 focus:border-blue-500/50"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {section.fields.map((field) => {
                      const val = user[field.key]
                      const display = Array.isArray(val) ? val.join(', ') : (val as string)
                      const filled = isFieldFilled(user, field.key)

                      return (
                        <div key={field.key} className="flex items-center justify-between gap-3">
                          <span className="text-xs text-white/40 shrink-0">{field.label}</span>
                          {filled ? (
                            <span className="text-xs text-white/80 text-right truncate max-w-[60%]">{display}</span>
                          ) : (
                            <span className="text-[11px] text-white/20 italic">Not set</span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* ─── Skills Badges ─── */}
      {user.skills && user.skills.length > 0 && (
        <Card className="mt-6 border-white/10">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-blue-400" />
              Skills
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {user.skills.map((skill) => (
                <Badge
                  key={skill}
                  className="bg-blue-500/10 border-blue-500/20 text-blue-300 text-xs px-2.5 py-1"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
