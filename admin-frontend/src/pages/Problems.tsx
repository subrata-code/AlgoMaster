import { useEffect, useState } from 'react'
import { apiRequest } from '../lib/api'
import { AdminLayout } from '../components/layout/AdminLayout'
import { Trash2, Edit, Plus, Eye, EyeOff } from 'lucide-react'

export function Problems() {
  const [problems, setProblems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const fetchProblems = async () => {
    setLoading(true)
    const { data } = await apiRequest(`/admin/problems`)
    if (data?.problems) {
      // client-side filtering for simplicity since admin/problems returns all
      let filtered = data.problems
      if (search) {
        const lower = search.toLowerCase()
        filtered = filtered.filter((p: any) => 
          p.title.toLowerCase().includes(lower) || 
          p.difficulty.toLowerCase().includes(lower)
        )
      }
      setProblems(filtered)
    }
    setLoading(false)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProblems()
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this problem?')) return
    await apiRequest(`/problems/${id}`, { method: 'DELETE' })
    fetchProblems()
  }

  const handleEdit = (id: string) => {
    alert(`Edit functionality for ${id} (WIP)`)
  }

  const handleCreate = () => {
    alert(`Create functionality (WIP)`)
  }

  return (
    <AdminLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Manage Problems</h2>
          <p className="mt-1 text-sm text-textSecondary">Add, edit, or remove DSA problems.</p>
        </div>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search problems..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field w-64"
          />
          <button onClick={handleCreate} className="btn-primary flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Problem
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-surface overflow-hidden">
        <table className="w-full text-left text-sm text-textSecondary">
          <thead className="border-b border-white/10 bg-white/5 uppercase">
            <tr>
              <th className="px-6 py-4 font-medium text-white">Problem</th>
              <th className="px-6 py-4 font-medium text-white">Difficulty</th>
              <th className="px-6 py-4 font-medium text-white">Status</th>
              <th className="px-6 py-4 font-medium text-white text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {problems.map((problem) => (
              <tr key={problem._id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-white">{problem.title}</div>
                  <div className="text-xs max-w-md truncate">{problem.topic}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${
                    problem.difficulty === 'Easy' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' :
                    problem.difficulty === 'Medium' ? 'border-amber-500/30 bg-amber-500/10 text-amber-400' :
                    'border-red-500/30 bg-red-500/10 text-red-400'
                  }`}>
                    {problem.difficulty}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                    problem.status === 'published' ? 'text-emerald-400' : 'text-textSecondary'
                  }`}>
                    {problem.status === 'published' ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                    {problem.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(problem._id)}
                      className="p-2 text-textSecondary hover:text-white transition-colors rounded-lg hover:bg-white/5"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(problem._id)}
                      className="p-2 text-textSecondary hover:text-red-400 transition-colors rounded-lg hover:bg-white/5"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {loading && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center">
                  Loading...
                </td>
              </tr>
            )}
            {!loading && problems.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center">
                  No problems found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  )
}
