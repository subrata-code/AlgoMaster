import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bookmark, Flame, Target, Trophy, ArrowRight, Brain, Database, Code2, FileText, Sparkles } from 'lucide-react'
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts'
import { Loader } from '@/components/EmptyState'
import { dashboardService } from '@/services'
import { formatRelativeTime } from '@/lib/utils'
import { ROUTES } from '@/constants'
import type { Activity, DashboardStats } from '@/types'
import { useAuth } from '@/context/AuthContext'

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [activity, setActivity] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [s, a] = await Promise.all([
          dashboardService.getStats().catch(() => null),
          dashboardService.getRecentActivity().catch(() => [])
        ])
        setStats(s || { solved: 0, totalProblems: 100, easy: 0, medium: 0, hard: 0, streak: 0, longestStreak: 0, bookmarks: 0, weeklyProgress: [], topicProgress: [] })
        setActivity(a || [])
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [])

  if (loading || !stats) return <div className="h-[60vh] flex items-center justify-center"><Loader /></div>

  const progress = stats.totalProblems > 0 ? Math.round((stats.solved / stats.totalProblems) * 100) : 0

  return (
    <div className="space-y-6 pb-20 max-w-6xl mx-auto">
      
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Hi, {user?.name?.split(' ')[0] || 'User'}! 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track your progress, continue your preparation, and achieve your goals.
          </p>
        </div>
      </div>

      {/* 2. Quick Stats Row (Bento Grid Style) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Problems Solved', value: stats.solved, icon: Trophy, color: 'text-yellow-500' },
          { label: 'Current Streak', value: stats.streak, icon: Flame, color: 'text-orange-500' },
          { label: 'Mastery Score', value: `${progress}%`, icon: Target, color: 'text-green-500' },
          { label: 'Bookmarks', value: stats.bookmarks, icon: Bookmark, color: 'text-blue-500' },
        ].map((item, i) => (
          <div key={i} className="flex flex-col gap-1 p-5 rounded-xl bg-card border border-border shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <item.icon className={`h-4 w-4 ${item.color}`} />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{item.label}</span>
            </div>
            <span className="text-3xl font-semibold tabular-nums tracking-tight">{item.value}</span>
          </div>
        ))}
      </div>

      {/* 3. Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Curated Tracks */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-lg font-semibold border-b border-border pb-2">Continue Preparation</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* ATS Resume Builder Banner Card */}
            <Link
              to={ROUTES.RESUME_BUILDER}
              className="group relative flex flex-col justify-between p-5 rounded-xl bg-gradient-to-br from-indigo-950/40 via-purple-950/20 to-card border border-indigo-500/30 hover:border-indigo-500/60 transition-all shadow-md sm:col-span-2"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 bg-indigo-500/15 rounded-xl text-indigo-400 border border-indigo-500/25">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-foreground text-base group-hover:text-indigo-400 transition-colors">
                        ATS Resume Builder
                      </h3>
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                        <Sparkles className="h-2.5 w-2.5" /> 100% Python Engine
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground max-w-xl">
                      Auto-extract profile details, tailor to specific job descriptions, verify ATS score, and export professional single-column PDFs.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 shrink-0">
                  <span>Build Resume</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* 100 Day Challenge */}
            <Link to={ROUTES.JOURNEY_100} className="group relative flex flex-col justify-between p-5 rounded-xl bg-card border border-border hover:border-foreground/20 transition-all shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500">
                    <Flame className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-semibold bg-accent text-accent-foreground px-2 py-0.5 rounded-md">Primary</span>
                </div>
                <h3 className="font-semibold text-foreground mb-1 group-hover:text-orange-500 transition-colors">100 Days of Code</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">Consistent daily problem solving to build strong fundamentals.</p>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                <span className="text-xs font-medium text-foreground">Day {stats.streak > 0 ? stats.streak : 1} / 100</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-orange-500 transition-colors" />
              </div>
            </Link>

            {/* Dynamic Programming */}
            <Link to={ROUTES.PROBLEMS} className="group relative flex flex-col justify-between p-5 rounded-xl bg-card border border-border hover:border-foreground/20 transition-all shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                    <Brain className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="font-semibold text-foreground mb-1 group-hover:text-purple-500 transition-colors">DP Special</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">Master dynamic programming through 50 essential pattern questions.</p>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                <div className="flex-1 mr-4">
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '45%' }} />
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-purple-500 transition-colors" />
              </div>
            </Link>

            {/* Arrays */}
            <Link to={`${ROUTES.PROBLEMS}?topic=array`} className="group relative flex flex-col justify-between p-5 rounded-xl bg-card border border-border hover:border-foreground/20 transition-all shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-sky-500/10 rounded-lg text-sky-500">
                    <Code2 className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="font-semibold text-foreground mb-1 group-hover:text-sky-500 transition-colors">Arrays for Beginners</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">Solidify your understanding of the most common data structure.</p>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                 <span className="text-xs font-medium text-foreground">Start Track</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-sky-500 transition-colors" />
              </div>
            </Link>

            {/* SQL */}
            <Link to="/sql" className="group relative flex flex-col justify-between p-5 rounded-xl bg-card border border-border hover:border-foreground/20 transition-all shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                    <Database className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="font-semibold text-foreground mb-1 group-hover:text-emerald-500 transition-colors">SQL Mastery</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">Complete database querying guide from SELECT to Window functions.</p>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                 <span className="text-xs font-medium text-foreground">Start Track</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-emerald-500 transition-colors" />
              </div>
            </Link>
          </div>

          {/* Activity Chart */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold border-b border-border pb-2 mb-4">Submission Activity</h2>
            <div className="h-64 rounded-xl bg-card border border-border p-4 shadow-sm">
               {stats.weeklyProgress && stats.weeklyProgress.length > 0 ? (
                 <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.weeklyProgress}>
                    <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                    <Tooltip
                      contentStyle={{
                        background: 'var(--card)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        color: 'var(--foreground)'
                      }}
                      cursor={{ fill: 'var(--accent)' }}
                    />
                    <Bar dataKey="solved" fill="var(--foreground)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
               ) : (
                 <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                   Not enough data yet. Solve some problems!
                 </div>
               )}
            </div>
          </div>
        </div>

        {/* Right Column: Recent Activity Feed */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold border-b border-border pb-2">Recent Submissions</h2>
          <div className="rounded-xl bg-card border border-border shadow-sm p-4 flex flex-col min-h-[400px]">
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
               {activity.length > 0 ? activity.map((item) => (
                  <div key={item.id} className="group flex items-start gap-3">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground hover:underline cursor-pointer line-clamp-1">{item.title}</p>
                      <time className="text-xs text-muted-foreground">{formatRelativeTime(item.timestamp)}</time>
                    </div>
                  </div>
                )) : (
                   <div className="flex items-center justify-center text-muted-foreground text-sm h-full pb-10">
                     No recent activity found.
                   </div>
                )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
