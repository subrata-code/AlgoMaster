import { useEffect, useState, type ComponentType } from 'react'
import { Award, Flame, Footprints, Target, Trophy, Zap } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader } from '@/components/EmptyState'
import { PageHeader } from '@/components/PageHeader'
import { dashboardService, userService } from '@/services'
import { formatDate, formatRelativeTime } from '@/lib/utils'
import type { Achievement, Activity, DashboardStats, User } from '@/types'

const achievementIcons: Record<string, ComponentType<{ className?: string }>> = {
  Footprints,
  Trophy,
  Flame,
  Target,
  Zap,
  Award,
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [u, a, act, s] = await Promise.all([
        userService.getCurrentUser(),
        userService.getAchievements(),
        userService.getActivities(),
        dashboardService.getStats(),
      ])
      setUser(u)
      setAchievements(a)
      setActivities(act)
      setStats(s)
      setLoading(false)
    }
    void load()
  }, [])

  if (loading || !user || !stats) return <Loader />

  return (
    <div>
      <PageHeader title="Profile" description="Your public journey, achievements, and activity." />

      <Card className="mb-6">
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-lg">
              {user.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-sm text-muted-foreground">@{user.username}</p>
            {user.bio && <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{user.bio}</p>}
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
              {user.location && <span>{user.location}</span>}
              <span>Joined {formatDate(user.joinedAt)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Solved', value: stats.solved },
          { label: 'Streak', value: stats.streak },
          { label: 'Bookmarks', value: stats.bookmarks },
          { label: 'Achievements', value: achievements.filter((a) => a.unlockedAt).length },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <p className="text-xl font-semibold tabular-nums">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="achievements">
        <TabsList>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="achievements" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {achievements.map((ach) => {
              const Icon = achievementIcons[ach.icon] ?? Trophy
              const unlocked = Boolean(ach.unlockedAt)
              return (
                <Card key={ach.id} className={!unlocked ? 'opacity-60' : undefined}>
                  <CardHeader className="flex-row items-start gap-3 space-y-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{ach.title}</CardTitle>
                      <CardDescription>{ach.description}</CardDescription>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge variant={unlocked ? 'success' : 'secondary'}>
                          {unlocked ? 'Unlocked' : `${ach.progress}/${ach.total}`}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </TabsContent>
        <TabsContent value="activity" className="mt-4">
          <Card>
            <CardContent className="space-y-4 p-6">
              {activities.map((item) => (
                <div key={item.id} className="flex justify-between gap-4 border-b border-border pb-4 last:border-0">
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <time className="text-xs text-muted-foreground">{formatRelativeTime(item.timestamp)}</time>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
