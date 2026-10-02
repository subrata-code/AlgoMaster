import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  Building2,
  ChevronDown,
  ChevronRight,
  Code2,
  Compass,
  Flame,
  LayoutDashboard,
  Menu,
  Moon,
  Sparkles,
  Sun,
  X
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { APP_NAME, ROUTES } from '@/constants'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  return (
    <button
      className="floating-navbar-link !px-2.5 !py-1.5 transition-transform hover:scale-105"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      {isDark ? <Sun className="h-4 w-4 text-amber-300" /> : <Moon className="h-4 w-4 text-indigo-400" />}
    </button>
  )
}

const EXPLORE_ITEMS = [
  {
    title: '100 Day Challenge',
    desc: 'Structured daily problems to build real consistency',
    href: ROUTES.JOURNEY_100,
    icon: Flame,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10 border-amber-500/20',
    badge: 'Popular'
  },
  {
    title: 'Problems',
    desc: 'Extensive DSA library with tags, hints & solutions',
    href: ROUTES.PROBLEMS,
    icon: Code2,
    color: 'text-[#60A5FA]',
    bgColor: 'bg-[#327CF6]/10 border-[#327CF6]/20'
  },
  {
    title: 'Roadmap',
    desc: 'Visual guided curriculum from beginner to advanced',
    href: ROUTES.ROADMAP,
    icon: Compass,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10 border-purple-500/20'
  },
  {
    title: 'Companies',
    desc: 'Targeted interview archives from FAANG & top tech',
    href: ROUTES.COMPANIES,
    icon: Building2,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10 border-emerald-500/20'
  }
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [exploreHovered, setExploreHovered] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const closeTimeoutRef = useRef<number | null>(null)
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY
          setIsScrolled((prev) => {
            // Hysteresis prevents jitter at the boundary
            if (!prev && y > 35) return true
            if (prev && y < 12) return false
            return prev
          })
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    await logout()
    void navigate(ROUTES.LOGIN)
  }

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
    setExploreHovered(true)
  }

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setExploreHovered(false)
    }, 150)
  }

  return (
    <>
      {/* ─── Desktop Floating & Smooth Morphing Navbar ─── */}
      <div className="fixed top-0 inset-x-0 z-50 hidden md:flex justify-center pointer-events-none pt-3">
        <motion.header
          initial={false}
          animate={{
            width: isScrolled ? 680 : 1060,
            paddingTop: isScrolled ? 6 : 10,
            paddingBottom: isScrolled ? 6 : 10,
            paddingLeft: isScrolled ? 14 : 24,
            paddingRight: isScrolled ? 14 : 24,
            borderRadius: isScrolled ? 9999 : 20,
            y: isScrolled ? 0 : 4,
          }}
          transition={{
            type: 'spring',
            stiffness: 280,
            damping: 30,
            mass: 0.8
          }}
          className={cn(
            'pointer-events-auto flex items-center justify-between max-w-[94vw] border backdrop-blur-2xl transition-colors duration-300',
            isScrolled
              ? 'bg-[#0e0e16]/90 border-white/15 shadow-[0_16px_40px_rgba(0,0,0,0.6)]'
              : 'bg-[#12121c]/60 border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.35)]'
          )}
          role="banner"
        >
          {/* Left: Brand Logo */}
          <Link
            to={ROUTES.HOME}
            className="flex items-center gap-2.5 pl-1 pr-3 font-semibold text-white transition-opacity hover:opacity-90 shrink-0"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-[#2563eb] to-[#60a5fa] text-xs font-bold text-white shadow-md shadow-blue-500/25">
              A
            </span>
            <span className="text-sm tracking-tight font-medium whitespace-nowrap">{APP_NAME}</span>
          </Link>

          {/* Center: Nav (Dashboard, Explore dropdown, About our goal) */}
          <nav className="flex items-center gap-1 shrink-0" aria-label="Main">
            {/* 1. Dashboard */}
            <NavLink
              to={ROUTES.DASHBOARD}
              className={({ isActive }) =>
                cn(
                  'floating-navbar-link !py-1.5 !px-3',
                  isActive && 'bg-white/10 !text-white'
                )
              }
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              <span>Dashboard</span>
            </NavLink>

            {/* 2. Explore Dropdown on Hover */}
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                className={cn(
                  'floating-navbar-link !py-1.5 !px-3 flex items-center gap-1.5 transition-colors',
                  exploreHovered && 'bg-white/10 !text-white'
                )}
                aria-expanded={exploreHovered}
                aria-haspopup="true"
              >
                <span>Explore</span>
                <ChevronDown
                  className={cn(
                    'h-3.5 w-3.5 transition-transform duration-200 text-white/50',
                    exploreHovered && 'rotate-180 text-white'
                  )}
                />
              </button>

              {/* Dropdown panel */}
              <AnimatePresence>
                {exploreHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute left-1/2 -translate-x-1/2 top-full pt-3 z-50 pointer-events-auto"
                  >
                    <div className="w-[420px] rounded-2xl border border-white/15 bg-[#0e0e16]/95 p-3 backdrop-blur-2xl shadow-[0_24px_60px_rgba(0,0,0,0.7)]">
                      <div className="grid grid-cols-2 gap-2">
                        {EXPLORE_ITEMS.map((item) => (
                          <Link
                            key={item.title}
                            to={item.href}
                            onClick={() => setExploreHovered(false)}
                            className="group relative flex flex-col justify-between rounded-xl border border-transparent p-3 transition-all hover:border-white/10 hover:bg-white/[0.05]"
                          >
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <div
                                  className={cn(
                                    'flex h-7 w-7 items-center justify-center rounded-lg border',
                                    item.bgColor
                                  )}
                                >
                                  <item.icon className={cn('h-3.5 w-3.5', item.color)} />
                                </div>
                                {item.badge && (
                                  <span className="rounded-full bg-amber-500/20 border border-amber-500/30 px-1.5 py-0.5 text-[10px] font-semibold text-amber-300">
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              <h4 className="text-xs font-semibold text-white/90 group-hover:text-white flex items-center gap-1">
                                {item.title}
                                <ChevronRight className="h-3 w-3 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0 text-white/50" />
                              </h4>
                              <p className="mt-1 text-[11px] leading-relaxed text-white/50 line-clamp-2">
                                {item.desc}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 3. About our goal */}
            <NavLink
              to={ROUTES.ABOUT}
              className={({ isActive }) =>
                cn(
                  'floating-navbar-link !py-1.5 !px-3',
                  isActive && 'bg-white/10 !text-white'
                )
              }
            >
              <span>About our goal</span>
            </NavLink>
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <ThemeToggle />

            {user ? (
              <div className="flex items-center gap-1.5">
                <NavLink to={ROUTES.PROFILE} className="floating-navbar-link !py-1.5 !px-3">
                  Profile
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="floating-navbar-cta !py-1.5 !px-3 !text-xs !bg-white/10 hover:!bg-white/15 !text-white"
                >
                  Log out
                </button>
              </div>
            ) : (
              <Link
                to={ROUTES.SIGNUP}
                className="floating-navbar-cta !py-1.5 !px-3.5 !text-xs !gap-1"
              >
                Get Started
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        </motion.header>
      </div>

      {/* ─── Mobile Navbar ─── */}
      <header className="fixed top-3 left-4 right-4 z-50 flex md:hidden items-center justify-between rounded-2xl border border-white/10 bg-[#0e0e16]/80 p-2 backdrop-blur-xl shadow-lg">
        <Link to={ROUTES.HOME} className="flex items-center gap-2 pl-1 font-semibold text-white">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-tr from-[#2563eb] to-[#60a5fa] text-[10px] font-bold text-white">
            A
          </span>
          <span className="text-xs">{APP_NAME}</span>
        </Link>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button
            className="floating-navbar-link !px-2 !py-1.5"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {open && (
          <div
            className="fixed inset-0 z-[49] bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setOpen(false)}
          >
            <motion.nav
              initial={{ opacity: 0, y: -16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute left-4 right-4 top-16 rounded-2xl border border-white/10 bg-[#0e0e16]/95 p-4 backdrop-blur-2xl shadow-2xl"
              aria-label="Mobile"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col gap-1">
                {/* Dashboard */}
                <NavLink
                  to={ROUTES.DASHBOARD}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white',
                      isActive && 'bg-white/10 text-white'
                    )
                  }
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </NavLink>

                {/* Explore Section */}
                <div className="pt-2 pb-1 px-3">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-white/40">
                    Explore
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-1 pl-2">
                  {EXPLORE_ITEMS.map((item) => (
                    <NavLink
                      key={item.title}
                      to={item.href}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white',
                          isActive && 'bg-white/10 text-white'
                        )
                      }
                    >
                      <item.icon className={cn('h-4 w-4', item.color)} />
                      <span>{item.title}</span>
                    </NavLink>
                  ))}
                </div>

                {/* About our goal */}
                <NavLink
                  to={ROUTES.ABOUT}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white mt-1 border-t border-white/5 pt-2.5',
                      isActive && 'bg-white/10 text-white'
                    )
                  }
                >
                  <Sparkles className="h-4 w-4 text-[#327CF6]" />
                  About our goal
                </NavLink>
              </div>

              {/* Mobile Auth CTAs */}
              <div className="mt-4 flex gap-2 border-t border-white/10 pt-3">
                {user ? (
                  <>
                    <Link
                      to={ROUTES.PROFILE}
                      onClick={() => setOpen(false)}
                      className="flex-1 rounded-xl border border-white/10 py-2 text-center text-sm font-medium text-white"
                    >
                      Profile
                    </Link>
                    <button
                      className="flex-1 rounded-xl bg-white/10 py-2 text-center text-sm font-medium text-white"
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
                      className="flex-1 rounded-xl border border-white/10 py-2 text-center text-sm font-medium text-white"
                    >
                      Log in
                    </Link>
                    <Link
                      to={ROUTES.SIGNUP}
                      onClick={() => setOpen(false)}
                      className="flex-1 rounded-xl bg-[#327CF6] py-2 text-center text-sm font-medium text-white"
                    >
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            </motion.nav>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
