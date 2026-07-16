import { Link } from 'react-router-dom'
import { APP_NAME, ROUTES } from '@/constants'

const footerLinks = {
  Product: [
    { label: 'Problems', href: ROUTES.PROBLEMS },
    { label: 'Roadmap', href: ROUTES.ROADMAP },
    { label: '100 Days', href: ROUTES.JOURNEY_100 },
    { label: 'Topics', href: ROUTES.TOPICS },
  ],
  Company: [
    { label: 'About', href: ROUTES.ABOUT },
    { label: 'Dashboard', href: ROUTES.DASHBOARD },
    { label: 'Settings', href: ROUTES.SETTINGS },
  ],
  Account: [
    { label: 'Log in', href: ROUTES.LOGIN },
    { label: 'Sign up', href: ROUTES.SIGNUP },
    { label: 'Profile', href: ROUTES.PROFILE },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/40">
      <div className="container-page py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <Link to={ROUTES.HOME} className="flex items-center gap-2 font-semibold">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-sm text-background">
                A
              </span>
              {APP_NAME}
            </Link>
            <p className="max-w-xs text-sm text-muted-foreground">
              Document your DSA journey. Learn with structure. Master interviews with confidence.
            </p>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              GitHub
            </a>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="mb-3 text-sm font-semibold">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link to={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
          <p>Frontend foundation — mock data only.</p>
        </div>
      </div>
    </footer>
  )
}
