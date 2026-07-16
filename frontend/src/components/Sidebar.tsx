import { NavLink } from 'react-router-dom'
import {
  Bookmark,
  Code2,
  LayoutDashboard,
  Plus,
  Settings,
  User,
} from 'lucide-react'
import { ADMIN_NAV, DASHBOARD_NAV } from '@/constants'
import { cn } from '@/lib/utils'

const iconMap = {
  LayoutDashboard,
  Code2,
  Bookmark,
  User,
  Settings,
  Plus,
} as const

interface SidebarProps {
  variant?: 'dashboard' | 'admin'
}

export function Sidebar({ variant = 'dashboard' }: SidebarProps) {
  const items = variant === 'admin' ? ADMIN_NAV : DASHBOARD_NAV

  return (
    <aside className="hidden w-56 shrink-0 border-r border-border lg:block">
      <nav className="sticky top-20 space-y-1 p-4" aria-label={variant === 'admin' ? 'Admin' : 'Dashboard'}>
        {items.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap]
          return (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === '/admin' || item.href === '/dashboard'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground',
                  isActive && 'bg-accent font-medium text-foreground',
                )
              }
            >
              {Icon && <Icon className="h-4 w-4" aria-hidden />}
              {item.label}
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}

export function MobileNavTabs({ variant = 'dashboard' }: SidebarProps) {
  const items = variant === 'admin' ? ADMIN_NAV : DASHBOARD_NAV

  return (
    <nav
      className="mb-6 flex gap-1 overflow-x-auto rounded-lg border border-border bg-card p-1 lg:hidden"
      aria-label={variant === 'admin' ? 'Admin mobile' : 'Dashboard mobile'}
    >
      {items.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          end={item.href === '/admin' || item.href === '/dashboard'}
          className={({ isActive }) =>
            cn(
              'whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground',
              isActive && 'bg-background text-foreground shadow-sm',
            )
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}
