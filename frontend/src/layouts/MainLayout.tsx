import { Outlet, useLocation } from 'react-router-dom'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { cn } from '@/lib/utils'

export function MainLayout() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className={cn("flex-1", !isHomePage && "pt-24")}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
