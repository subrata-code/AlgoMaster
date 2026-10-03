import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Code2,
  Bookmark,
  User,
  Settings,
  ChevronDown,
  Brain,
  Database,
  Calculator,
  MessageSquare,
  BookOpen
} from 'lucide-react'
import { ROUTES, APP_NAME } from '@/constants'
import { cn } from '@/lib/utils'

export type NavItem = {
  label: string
  href?: string
  icon: any
  children?: NavItem[]
}

const APP_NAV: NavItem[] = [
  { label: 'Dashboard', href: ROUTES.DASHBOARD, icon: LayoutDashboard },
  {
    label: 'Practice',
    icon: Code2,
    children: [
      { label: 'DSA', href: ROUTES.PROBLEMS, icon: Code2 },
      { label: 'SQL', href: '/sql', icon: Database },
      {
        label: 'Aptitude',
        icon: Brain,
        children: [
          { label: 'Quantitative', href: '/aptitude/quant', icon: Calculator },
          { label: 'Reasoning', href: '/aptitude/reasoning', icon: Brain },
          { label: 'English', href: '/aptitude/english', icon: MessageSquare },
        ]
      },
    ]
  },
  { label: 'Curriculum', href: ROUTES.ROADMAP, icon: BookOpen },
  { label: 'Bookmarks', href: ROUTES.BOOKMARKS, icon: Bookmark },
  { label: 'Profile', href: ROUTES.PROFILE, icon: User },
  { label: 'Settings', href: ROUTES.SETTINGS, icon: Settings },
]

interface SidebarProps {
  isCollapsed: boolean
}

function NavItemComponent({ item, isCollapsed, depth = 0 }: { item: NavItem, isCollapsed: boolean, depth?: number }) {
  const [isOpen, setIsOpen] = useState(false)
  const hasChildren = item.children && item.children.length > 0

  const content = (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all hover:bg-white/5 hover:text-foreground cursor-pointer group",
        depth > 0 && "ml-4"
      )}
      onClick={() => hasChildren && setIsOpen(!isOpen)}
    >
      <item.icon className="h-4 w-4 shrink-0" />
      {!isCollapsed && (
        <>
          <span className="flex-1 truncate">{item.label}</span>
          {hasChildren && (
            <motion.div animate={{ rotate: isOpen ? 180 : 0 }} className="shrink-0 opacity-50 group-hover:opacity-100">
              <ChevronDown className="h-4 w-4" />
            </motion.div>
          )}
        </>
      )}
    </div>
  )

  return (
    <div className="select-none">
      {item.href && !hasChildren ? (
        <NavLink
          to={item.href}
          end={item.href === ROUTES.DASHBOARD}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all hover:bg-white/5 hover:text-foreground",
              depth > 0 && "ml-4",
              isActive && "bg-white/10 text-foreground font-medium"
            )
          }
        >
          <item.icon className={cn("h-4 w-4 shrink-0")} />
          {!isCollapsed && <span className="flex-1 truncate">{item.label}</span>}
        </NavLink>
      ) : (
        content
      )}
      
      {!isCollapsed && hasChildren && (
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="border-l border-white/10 ml-5 mt-1 space-y-1">
                {item.children!.map((child, idx) => (
                  <NavItemComponent key={idx} item={child} isCollapsed={isCollapsed} depth={depth + 1} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}

export function AppSidebar({ isCollapsed }: SidebarProps) {
  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 72 : 260 }}
      className="shrink-0 border-r border-white/10 bg-[#0e0e12] h-full hidden lg:flex flex-col z-20"
    >
      {/* Sidebar Header */}
      <div className="h-16 flex items-center px-4 border-b border-white/5 shrink-0 overflow-hidden">
        <Link to={ROUTES.HOME} className="flex items-center gap-3 shrink-0">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-[#2563eb] to-[#60a5fa] text-sm font-bold text-white shadow-md shadow-blue-500/25">
            A
          </span>
          {!isCollapsed && (
            <motion.span 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-base tracking-tight font-semibold text-white whitespace-nowrap"
            >
              {APP_NAME}
            </motion.span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-hide">
        {APP_NAV.map((item, idx) => (
          <NavItemComponent key={idx} item={item} isCollapsed={isCollapsed} />
        ))}
      </nav>
    </motion.aside>
  )
}
