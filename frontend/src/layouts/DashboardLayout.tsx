import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { AppSidebar } from '@/components/dashboard/AppSidebar'
import { AppHeader } from '@/components/dashboard/AppHeader'
import { MobileNavTabs } from '@/components/Sidebar'

export function DashboardLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  // Close sidebar automatically on smaller screens when navigating
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarCollapsed(true)
      } else {
        setIsSidebarCollapsed(false)
      }
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0a0f] text-white selection:bg-indigo-500/30">
      <AppSidebar isCollapsed={isSidebarCollapsed} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader 
          isSidebarCollapsed={isSidebarCollapsed} 
          toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
        />
        
        <main className="flex-1 overflow-y-auto">
          {/* Mobile nav fallback for small screens if needed */}
          <div className="lg:hidden p-4 pb-0">
             <MobileNavTabs variant="dashboard" />
          </div>
          
          <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
