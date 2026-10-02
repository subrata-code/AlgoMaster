import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiRequest } from '../lib/api'
import { Users, Code2, CheckCircle2 } from 'lucide-react'
import { AdminLayout } from '../components/layout/AdminLayout'

export function Dashboard() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchStats = async () => {
      const { data, error } = await apiRequest('/admin/stats')
      if (error) {
        navigate('/')
        return
      }
      setStats(data)
      setLoading(false)
    }
    fetchStats()
  }, [navigate])

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex h-[80vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Overview</h2>
        <p className="mt-1 text-sm text-textSecondary">
          Platform statistics and metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-white/10 bg-surface p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
              <Code2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-textSecondary">Total Problems</p>
              <p className="text-2xl font-bold">{stats?.totalProblems || 0}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-surface p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-textSecondary">Published</p>
              <p className="text-2xl font-bold">{stats?.published || 0}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-surface p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-textSecondary">Total Users</p>
              <p className="text-2xl font-bold">{stats?.totalUsers || 0}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="rounded-xl border border-white/10 bg-surface p-6">
          <h2 className="text-lg font-medium">Quick Actions</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <button onClick={() => navigate('/problems')} className="btn-secondary flex items-center justify-center gap-2 py-4">
              <Code2 className="h-4 w-4" />
              Manage Problems
            </button>
            <button onClick={() => navigate('/users')} className="btn-secondary flex items-center justify-center gap-2 py-4">
              <Users className="h-4 w-4" />
              Manage Users
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

