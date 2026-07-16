import { Outlet } from 'react-router-dom'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { MobileNavTabs, Sidebar } from '@/components/Sidebar'

export function DashboardLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="container-page flex flex-1 gap-0 py-6 lg:gap-8">
        <Sidebar variant="dashboard" />
        <div className="min-w-0 flex-1">
          <MobileNavTabs variant="dashboard" />
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  )
}
