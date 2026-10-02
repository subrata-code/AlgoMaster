import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { apiRequest } from '../lib/api'
import { AdminLayout } from '../components/layout/AdminLayout'
import { Trash2, Edit, Plus } from 'lucide-react'

export function ContentManager() {
  const { type } = useParams<{ type: string }>()
  const navigate = useNavigate()
  
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Map type to API route
  const getApiRoute = (type: string) => {
    switch (type) {
      case 'topic': return '/content/topics'
      case 'company': return '/content/companies'
      case 'roadmap': return '/content/roadmap'
      case 'testimonial': return '/content/testimonials'
      case 'faq': return '/content/faqs'
      default: return null
    }
  }

  const fetchItems = async () => {
    const route = getApiRoute(type || '')
    if (!route) {
      navigate('/dashboard')
      return
    }

    setLoading(true)
    const { data } = await apiRequest(route)
    
    // The APIs return `{ data: { [key]: items } }`. Let's extract the array dynamically.
    if (data) {
      const keys = Object.keys(data)
      const arrayKey = keys.find(k => Array.isArray(data[k]))
      if (arrayKey) setItems(data[arrayKey])
      else if (Array.isArray(data)) setItems(data) // fallback
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchItems()
  }, [type])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return
    await apiRequest(`/content/${type}/${id}`, { method: 'DELETE' })
    fetchItems()
  }

  const handleEdit = (id: string) => {
    alert(`Edit functionality for ${id} (WIP). This will open a modal or form.`)
  }

  const handleCreate = () => {
    alert(`Create functionality for ${type} (WIP). This will open a modal or form.`)
  }

  const getTitle = () => {
    const titles: Record<string, string> = {
      topic: 'Topics',
      company: 'Companies',
      roadmap: 'Roadmaps',
      testimonial: 'Testimonials',
      faq: 'FAQs'
    }
    return titles[type || ''] || 'Content'
  }

  return (
    <AdminLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold capitalize">Manage {getTitle()}</h2>
          <p className="mt-1 text-sm text-textSecondary">Add, edit, or remove {getTitle().toLowerCase()}.</p>
        </div>
        <button onClick={handleCreate} className="btn-primary flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New
        </button>
      </div>

      <div className="rounded-xl border border-white/10 bg-surface overflow-hidden">
        <table className="w-full text-left text-sm text-textSecondary">
          <thead className="border-b border-white/10 bg-white/5 uppercase">
            <tr>
              <th className="px-6 py-4 font-medium text-white">Slug / ID</th>
              <th className="px-6 py-4 font-medium text-white">Details</th>
              <th className="px-6 py-4 font-medium text-white text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {items.map((item) => (
              <tr key={item._id || item.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-mono text-xs">
                  {item.slug || item.id}
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-white max-w-md truncate">
                    {item.name || item.title || item.question || item.content || 'N/A'}
                  </div>
                  {(item.description || item.answer) && (
                    <div className="text-xs max-w-md truncate mt-0.5">
                      {item.description || item.answer}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(item._id || item.id)}
                      className="p-2 text-textSecondary hover:text-white transition-colors rounded-lg hover:bg-white/5"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id || item.id)}
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
                <td colSpan={3} className="px-6 py-8 text-center">
                  Loading...
                </td>
              </tr>
            )}
            {!loading && items.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center">
                  No items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  )
}
