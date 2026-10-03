import { Link, useLocation, useNavigate } from 'react-router-dom'
import { apiRequest } from '../../lib/api'
import { LayoutDashboard, Users, Code2, BookOpen, LogOut, Quote, Building2, HelpCircle, Map } from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Problems', href: '/problems', icon: Code2 },
  { name: 'Topics', href: '/content/topic', icon: BookOpen },
  { name: 'Companies', href: '/content/company', icon: Building2 },
  { name: 'Roadmaps', href: '/content/roadmap', icon: Map },
  { name: 'Testimonials', href: '/content/testimonial', icon: Quote },
  { name: 'FAQs', href: '/content/faq', icon: HelpCircle },
]

export function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await apiRequest('/auth/logout', { method: 'POST' })
    navigate('/')
  }

  return (
    <div className="flex w-64 flex-col border-r border-white/10 bg-surface">
      <div className="flex h-16 items-center gap-2 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-bold text-white">
          A
        </div>
        <h1 className="text-xl font-bold tracking-tight">AlgoAdmin</h1>
      </div>

      <nav className="flex-1 space-y-1 px-4 py-4">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-textSecondary hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className={`h-5 w-5 ${isActive ? 'text-primary' : 'text-textSecondary'}`} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-textSecondary transition-colors hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  )
}
