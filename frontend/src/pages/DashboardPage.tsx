import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bookmark, Flame, Target, Trophy, ArrowRight, Sparkles, Brain, Database, Code2 } from 'lucide-react'
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
    <div className="space-y-10 pb-20">
      
      {/* 1. Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-blue-500/20 border border-white/10 p-8 sm:p-12">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-72 h-72 bg-purple-500/30 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-72 h-72 bg-blue-500/30 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium mb-6 backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span className="bg-gradient-to-r from-amber-200 to-yellow-500 bg-clip-text text-transparent">Ready to conquer today?</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Welcome back, <span className="text-white">{user?.name?.split(' ')[0] || 'Challenger'}</span>.
          </h1>
          <p className="text-lg text-white/60 max-w-2xl">
            You're currently in the top 15% of active users this week. Keep up the momentum and tackle your next challenge.
          </p>
        </div>
      </div>

      {/* 2. Quick Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Problems Solved', value: stats.solved, icon: Trophy, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
          { label: 'Day Streak', value: stats.streak, icon: Flame, color: 'text-orange-500', bg: 'bg-orange-500/10' },
          { label: 'Mastery Score', value: `${progress}%`, icon: Target, color: 'text-green-500', bg: 'bg-green-500/10' },
          { label: 'Bookmarks', value: stats.bookmarks, icon: Bookmark, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        ].map((item, i) => (
          <div key={i} className="flex flex-col gap-2 p-5 rounded-2xl bg-[#12121a] border border-white/5 hover:bg-white/[0.02] transition-colors">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${item.bg}`}>
                <item.icon className={`h-5 w-5 ${item.color}`} />
              </div>
              <span className="text-sm font-medium text-white/50">{item.label}</span>
            </div>
            <span className="text-3xl font-bold tracking-tight pl-1">{item.value}</span>
          </div>
        ))}
      </div>

      {/* 3. Special Curated Tracks */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Curated For You</h2>
          <Link to={ROUTES.ROADMAP} className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium transition-colors">
            View all paths <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 100 Day Challenge */}
          <Link to={ROUTES.JOURNEY_100} className="group relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#1a1a2e] to-[#0e0e16] border border-indigo-500/30 p-6 sm:p-8 hover:border-indigo-500/60 transition-all hover:-translate-y-1 shadow-[0_0_40px_-10px_rgba(99,102,241,0.2)]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-[50px] rounded-full group-hover:bg-indigo-500/40 transition-colors" />
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-indigo-500/20 rounded-2xl border border-indigo-500/30">
                    <Flame className="h-6 w-6 text-indigo-400" />
                  </div>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-white/80">RECOMMENDED</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">100 Days of Code</h3>
                <p className="text-sm text-white/60 line-clamp-2">Master DSA from scratch to advanced topics with a daily structured plan.</p>
              </div>
              <div className="mt-8 flex items-center justify-between">
                <span className="text-sm font-medium text-indigo-400">Continue Day 13</span>
                <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          </Link>

          {/* Dynamic Programming */}
          <Link to={ROUTES.PROBLEMS} className="group relative overflow-hidden rounded-3xl bg-[#12121a] border border-white/5 p-6 sm:p-8 hover:bg-white/[0.02] hover:border-white/10 transition-all hover:-translate-y-1">
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20 w-max mb-4">
                  <Brain className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">DP Special Playlist</h3>
                <p className="text-sm text-white/60 line-clamp-2">Struggling with Dynamic Programming? We broke it down into 50 essential patterns.</p>
              </div>
              <div className="mt-8 flex items-center gap-3">
                <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: '45%' }} />
                </div>
                <span className="text-xs font-medium text-white/50">45%</span>
              </div>
            </div>
          </Link>

          {/* SQL Mastery */}
          <Link to="/sql" className="group relative overflow-hidden rounded-3xl bg-[#12121a] border border-white/5 p-6 sm:p-8 hover:bg-white/[0.02] hover:border-white/10 transition-all hover:-translate-y-1">
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 w-max mb-4">
                  <Database className="h-6 w-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">SQL Mastery</h3>
                <p className="text-sm text-white/60 line-clamp-2">From basic SELECTs to advanced window functions and complex joins.</p>
              </div>
              <div className="mt-8 flex items-center justify-between">
                 <span className="text-sm font-medium text-white/40">Start Track</span>
                <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          </Link>
          
           {/* Array Beginners */}
           <Link to={`${ROUTES.PROBLEMS}?topic=array`} className="group relative overflow-hidden rounded-3xl bg-[#12121a] border border-white/5 p-6 sm:p-8 hover:bg-white/[0.02] hover:border-white/10 transition-all hover:-translate-y-1">
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="p-3 bg-sky-500/10 rounded-2xl border border-sky-500/20 w-max mb-4">
                  <Code2 className="h-6 w-6 text-sky-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Arrays for Beginners</h3>
                <p className="text-sm text-white/60 line-clamp-2">Master the fundamental data structure with this curated list of 25 problems.</p>
              </div>
              <div className="mt-8 flex items-center justify-between">
                 <span className="text-sm font-medium text-white/40">Start Track</span>
                <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-sky-500 group-hover:text-white transition-colors">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          </Link>

        </div>
      </div>

      {/* 4. Activity & Analytics Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Weekly Chart */}
        <div className="lg:col-span-2 rounded-3xl border border-white/5 bg-[#12121a] p-6 sm:p-8">
          <div className="mb-6">
            <h3 className="text-xl font-semibold">Weekly Activity</h3>
            <p className="text-sm text-white/50">Submissions over the last 7 days</p>
          </div>
          <div className="h-64">
             {stats.weeklyProgress && stats.weeklyProgress.length > 0 ? (
               <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.weeklyProgress}>
                  <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} stroke="rgba(255,255,255,0.3)" />
                  <Tooltip
                    contentStyle={{
                      background: '#1a1a24',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      color: 'white'
                    }}
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  />
                  <Bar dataKey="solved" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
             ) : (
               <div className="h-full flex items-center justify-center text-white/30 text-sm">
                 Not enough data yet. Solve some problems!
               </div>
             )}
          </div>
        </div>

        {/* Recent Activity List */}
        <div className="rounded-3xl border border-white/5 bg-[#12121a] p-6 sm:p-8 flex flex-col">
          <div className="mb-6">
            <h3 className="text-xl font-semibold">Recent Submissions</h3>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
             {activity.length > 0 ? activity.map((item) => (
                <div key={item.id} className="group flex items-start gap-3">
                  <div className="mt-1 w-2 h-2 rounded-full bg-green-500 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-white group-hover:text-indigo-400 transition-colors cursor-pointer line-clamp-1">{item.title}</p>
                    <time className="text-xs text-white/40">{formatRelativeTime(item.timestamp)}</time>
                  </div>
                </div>
              )) : (
                 <div className="flex items-center justify-center text-white/30 text-sm h-full pb-10">
                   No recent activity
                 </div>
              )}
          </div>
        </div>
      </div>

    </div>
  )
}
