import { useEffect, useState } from 'react'
import { apiRequest } from '../lib/api'
import { AdminLayout } from '../components/layout/AdminLayout'
import { Trash2, Shield, User, Trophy, Flame, Plus, X } from 'lucide-react'

export function Users() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('createdAt')
  const [showCreateModal, setShowCreateModal] = useState(false)
  
  // Create user form state
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const fetchUsers = async () => {
    setLoading(true)
    const { data } = await apiRequest(`/admin/users?search=${search}&sort=${sort}`)
    if (data?.users) {
      setUsers(data.users)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchUsers()
  }, [search, sort])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return
    await apiRequest(`/admin/users/${id}`, { method: 'DELETE' })
    fetchUsers()
  }

  const handleRoleChange = async (id: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin'
    await apiRequest(`/admin/users/${id}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role: newRole }),
    })
    fetchUsers()
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    // Using the public register route to create a user, 
    // or ideally a dedicated admin route.
    const { error } = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name: newName, email: newEmail, password: newPassword, username: newEmail.split('@')[0] })
    })
    
    if (error) {
      alert(`Error: ${error}`)
    } else {
      setShowCreateModal(false)
      setNewName('')
      setNewEmail('')
      setNewPassword('')
      fetchUsers()
    }
  }

  return (
    <AdminLayout>
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Manage Users</h2>
          <p className="mt-1 text-sm text-textSecondary">View and manage all platform users.</p>
        </div>
        <div className="flex flex-wrap gap-4 items-center">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="input-field max-w-[200px]"
          >
            <option value="createdAt">Newest First</option>
            <option value="streak">Longest Streak</option>
            <option value="solved">Most Solved</option>
          </select>
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field max-w-xs"
          />
          <button onClick={() => setShowCreateModal(true)} className="btn-primary flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add User
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-surface overflow-hidden">
        <table className="w-full text-left text-sm text-textSecondary">
          <thead className="border-b border-white/10 bg-white/5 uppercase">
            <tr>
              <th className="px-6 py-4 font-medium text-white">User</th>
              <th className="px-6 py-4 font-medium text-white">Stats</th>
              <th className="px-6 py-4 font-medium text-white">Role</th>
              <th className="px-6 py-4 font-medium text-white text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary font-bold uppercase">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-white">{user.name}</div>
                      <div className="text-xs">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <Trophy className="h-3.5 w-3.5" /> {user.stats?.totalSolved || 0} Solved
                    </span>
                    <span className="flex items-center gap-1.5 text-orange-400">
                      <Flame className="h-3.5 w-3.5" /> {user.stats?.maxStreak || 0} Day Streak
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleRoleChange(user._id, user.role)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border ${
                      user.role === 'admin'
                        ? 'border-purple-500/30 bg-purple-500/10 text-purple-400'
                        : 'border-white/10 bg-white/5 text-textSecondary'
                    }`}
                  >
                    {user.role === 'admin' ? <Shield className="h-3 w-3" /> : <User className="h-3 w-3" />}
                    {user.role}
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="p-2 text-textSecondary hover:text-red-400 transition-colors rounded-lg hover:bg-white/5"
                    title="Delete user"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
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
            {!loading && users.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-surface p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Create New User</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-textSecondary hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="input-field"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  className="input-field"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="input-field"
                  placeholder="Password"
                />
              </div>
              
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
