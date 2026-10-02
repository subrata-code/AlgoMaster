import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ChevronRight, LayoutDashboard, Menu, Moon, Sun, Tag, X } from 'lucide-react'
import { useState } from 'react'
import { APP_NAME, NAV_LINKS, ROUTES } from '@/constants'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  return (
    <button
      className="floating-navbar-link !px-2"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  )
}

export function Navbar() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    void navigate(ROUTES.LOGIN)
  }

  return (
    <>
      {/* ─── Floating Pill Navbar (desktop) ─── */}
      <header className="floating-navbar hidden md:flex" role="banner">
        {/* Logo */}
        <Link
          to={ROUTES.HOME}
          className="floating-navbar-link !gap-2 !pl-1 !pr-3 font-semibold"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#327CF6] text-xs font-bold text-white">
            A
          </span>
          <span className="text-sm">{APP_NAME}</span>
        </Link>

        {/* Divider */}
        <div className="mx-1 h-5 w-px bg-white/10 dark:bg-white/10" style={{ background: 'currentColor', opacity: 0.1 }} />

        {/* Nav links */}
        <nav className="flex items-center gap-0.5" aria-label="Main">
          <NavLink to={ROUTES.DASHBOARD} className="floating-navbar-link">
            <LayoutDashboard className="h-3.5 w-3.5" />
            Dashboard
          </NavLink>

          {NAV_LINKS.slice(0, 3).map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              className={({ isActive }) =>
                cn('floating-navbar-link', isActive && 'bg-white/10 !text-white dark:!text-white')
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Divider */}
        <div className="mx-1 h-5 w-px" style={{ background: 'currentColor', opacity: 0.1 }} />

        {/* Theme toggle */}
        <ThemeToggle />

        {/* CTA */}
        {user ? (
          <div className="flex items-center gap-1">
            <NavLink to={ROUTES.PROFILE} className="floating-navbar-link">
              Profile
            </NavLink>
            <button onClick={handleLogout} className="floating-navbar-cta">
              Log out
            </button>
          </div>
        ) : (
          <Link to={ROUTES.SIGNUP} className="floating-navbar-cta">
            Get Started
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </header>

      {/* ─── Mobile Navbar ─── */}
      <header className="floating-navbar flex md:hidden !rounded-2xl !p-2">
        <Link to={ROUTES.HOME} className="floating-navbar-link !gap-1.5 !pl-0.5 !pr-2 font-semibold">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#327CF6] text-[10px] font-bold text-white">
            A
          </span>
          <span className="text-xs">{APP_NAME}</span>
        </Link>

        <div className="ml-auto flex items-center gap-1">
          <ThemeToggle />
          <button
            className="floating-navbar-link !px-2"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {open && (
        <div className="fixed inset-0 z-[49] bg-black/50 backdrop-blur-sm md:hidden" onClick={() => setOpen(false)}>
          <nav
            className="absolute left-4 right-4 top-20 rounded-2xl border border-white/10 bg-background/95 p-4 backdrop-blur-2xl dark:bg-[rgba(18,18,28,0.95)]"
            aria-label="Mobile"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-1">
              <NavLink
                to={ROUTES.DASHBOARD}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground',
                    isActive && 'bg-accent text-foreground',
                  )
                }
              >
                Dashboard
              </NavLink>
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.href}
                  to={link.href}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground',
                      isActive && 'bg-accent text-foreground',
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
            <div className="mt-3 flex gap-2 border-t border-border pt-3">
              {user ? (
                <>
                  <Link
                    to={ROUTES.PROFILE}
                    onClick={() => setOpen(false)}
                    className="flex-1 rounded-lg border border-border px-3 py-2 text-center text-sm font-medium"
                  >
                    Profile
                  </Link>
                  <button
                    className="flex-1 rounded-lg bg-[#327CF6] px-3 py-2 text-center text-sm font-medium text-white"
                    onClick={() => {
                      setOpen(false)
                      void handleLogout()
                    }}
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to={ROUTES.LOGIN}
                    onClick={() => setOpen(false)}
                    className="flex-1 rounded-lg border border-border px-3 py-2 text-center text-sm font-medium"
                  >
                    Log in
                  </Link>
                  <Link
                    to={ROUTES.SIGNUP}
                    onClick={() => setOpen(false)}
                    className="flex-1 rounded-lg bg-[#327CF6] px-3 py-2 text-center text-sm font-medium text-white"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </>
  )
}
