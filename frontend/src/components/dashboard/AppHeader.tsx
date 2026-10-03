import { Menu, PanelLeftClose, PanelLeft, Flame, Calendar, Medal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'
import { NotificationBell } from '@/components/NotificationBell'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LogOut, User, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/constants'

interface AppHeaderProps {
  isSidebarCollapsed: boolean
  toggleSidebar: () => void
}

export function AppHeader({ isSidebarCollapsed, toggleSidebar }: AppHeaderProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="h-16 shrink-0 flex items-center justify-between px-4 lg:px-6 border-b border-white/5 bg-[#0e0e12]/80 backdrop-blur-xl sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="hidden lg:flex text-muted-foreground hover:text-white"
        >
          {isSidebarCollapsed ? <PanelLeft className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="lg:hidden text-muted-foreground hover:text-white"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex items-center gap-4 lg:gap-6">
        {/* App-like Stats */}
        <div className="hidden sm:flex items-center gap-4 text-sm font-medium">
          <div className="flex items-center gap-1.5 text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
            <Flame className="h-4 w-4" />
            <span>12 Day Streak</span>
          </div>
          <div className="flex items-center gap-1.5 text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
            <Calendar className="h-4 w-4" />
            <span>POTD Done</span>
          </div>
          <div className="flex items-center gap-1.5 text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
            <Medal className="h-4 w-4" />
            <span>Master</span>
          </div>
        </div>

        <div className="h-6 w-px bg-white/10 hidden sm:block" />

        <NotificationBell />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 outline-none">
              <Avatar className="h-8 w-8 ring-2 ring-transparent transition-all hover:ring-white/20">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-medium text-xs">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mt-2 border-white/10 bg-[#12121a]/95 backdrop-blur-xl">
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                {user?.name && <p className="font-medium text-sm text-white">{user.name}</p>}
                {user?.email && (
                  <p className="w-[200px] truncate text-xs text-muted-foreground">
                    {user.email}
                  </p>
                )}
              </div>
            </div>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem className="cursor-pointer focus:bg-white/10" onClick={() => navigate(ROUTES.PROFILE)}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer focus:bg-white/10" onClick={() => navigate(ROUTES.SETTINGS)}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem className="cursor-pointer text-red-400 focus:bg-red-400/10 focus:text-red-400" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
