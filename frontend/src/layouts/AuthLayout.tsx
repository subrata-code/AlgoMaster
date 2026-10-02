import { Outlet, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { APP_NAME, ROUTES } from '@/constants'
import { ThemeToggle } from '@/components/Navbar'

export function AuthLayout() {
  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Top bar: Back to Home + Theme Toggle */}
      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 py-4 sm:px-6">
        <Link
          to={ROUTES.HOME}
          className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-medium text-white/70 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          Back to Home
        </Link>
        <ThemeToggle />
      </div>

      <div className="gradient-mesh flex flex-1 flex-col items-center justify-center px-4 py-12">
        <Link to={ROUTES.HOME} className="mb-8 flex items-center gap-2 font-semibold">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground text-background">A</span>
          {APP_NAME}
        </Link>
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
