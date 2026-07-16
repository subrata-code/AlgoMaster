import { Outlet, Link } from 'react-router-dom'
import { APP_NAME, ROUTES } from '@/constants'
import { ThemeToggle } from '@/components/Navbar'

export function AuthLayout() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="absolute right-4 top-4 z-10">
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
