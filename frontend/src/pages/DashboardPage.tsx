import { useEffect, useState } from 'react'
import { Bookmark, Flame, Target, Trophy } from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader } from '@/components/EmptyState'
import { PageHeader } from '@/components/PageHeader'
import { dashboardService } from '@/services'
import { formatRelativeTime } from '@/lib/utils'
import type { Activity, DashboardStats } from '@/types'

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [activity, setActivity] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [s, a] = await Promise.all([dashboardService.getStats(), dashboardService.getRecentActivity()])
      setStats(s)
      setActivity(a)
      setLoading(false)
    }
    void load()
  }, [])

  if (loading || !stats) return <Loader />

  const progress = Math.round((stats.solved / stats.totalProblems) * 100)

  return (
    <div>
      <PageHeader title="Dashboard" description="Your progress, streak, and recent activity at a glance." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Solved', value: stats.solved, icon: Trophy, sub: `${stats.easy}E · ${stats.medium}M · ${stats.hard}H` },
          { label: 'Current Streak', value: `${stats.streak} days`, icon: Flame, sub: `Longest: ${stats.longestStreak}` },
          { label: 'Bookmarks', value: stats.bookmarks, icon: Bookmark, sub: 'Saved for later' },
          { label: 'Progress', value: `${progress}%`, icon: Target, sub: `${stats.solved}/${stats.totalProblems}` },
        ].map((item) => (
          <Card key={item.label}>
            <CardContent className="flex items-start gap-3 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <item.icon className="h-4 w-4 text-muted-foreground" aria-hidden />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="text-2xl font-semibold tabular-nums">{item.value}</p>
                <p className="text-xs text-muted-foreground">{item.sub}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Weekly Progress</CardTitle>
            <CardDescription>Problems solved this week</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.weeklyProgress}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="solved" fill="var(--foreground)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Topic Progress</CardTitle>
            <CardDescription>Coverage across core areas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.topicProgress.map((t) => {
              const pct = Math.round((t.solved / t.total) * 100)
              return (
                <div key={t.topic}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>{t.topic}</span>
                    <span className="text-muted-foreground tabular-nums">
                      {t.solved}/{t.total}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
                    <div className="h-full rounded-full bg-foreground transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {activity.map((item) => (
            <div key={item.id} className="flex items-start justify-between gap-4 border-b border-border pb-4 last:border-0 last:pb-0">
              <div>
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
              <time className="shrink-0 text-xs text-muted-foreground">{formatRelativeTime(item.timestamp)}</time>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
