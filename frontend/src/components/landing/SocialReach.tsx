import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants'
import type { HomeStats } from '@/types'

/* ─── Social platform SVG icons ─── */
function YoutubeIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M11.023.003c2.374-.02 4.749.107 7.143.231a7.4 7.4 0 011.61.332c.826.29 1.39.87 1.691 1.698.242.642.342 1.305.383 1.988.1 2.07.22 4.14.1 6.211a18.5 18.5 0 01-.322 2.733c-.241 1.304-1.026 2.07-2.254 2.381a10.3 10.3 0 01-2.656.29c-2.616.103-5.232.186-7.868.103-1.59-.02-3.18-.103-4.77-.207a7.5 7.5 0 01-1.267-.166C1.323 15.262.579 14.496.317 12.923c-.322-1.946-.362-3.913-.282-5.88.02-1.035.08-2.07.14-3.106.02-.393.101-.787.201-1.18C.677 1.39 1.545.645 2.853.376 3.658.21 4.483.21 5.288.169 7.179.065 9.111-.018 11.023.003zM8.789 4.62v6.543l6.196-3.165-6.196-3.378z" fill="#DE323B"/>
      <path d="M8.789 4.62l6.196 3.354-6.196 3.189V4.62z" fill="#fff"/>
    </svg>
  )
}

function LinkedinIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M10.102 11.905h1.6v-3.6c0-1.768-.38-3.127-2.447-3.127-.785-.03-1.526.375-1.925 1.05v-.669H5.78v6.346h1.6V8.657c0-.856.163-1.685 1.224-1.685 1.046 0 1.06.98 1.06 1.741v3.192zM2.078 3.261a1.183 1.183 0 102.366 0 1.183 1.183 0 00-2.366 0zm.38 8.644h1.603V5.56H2.46v6.345z" fill="#377AE8"/>
    </svg>
  )
}

function InstagramIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path fill="currentColor" d="M12 7.175A4.825 4.825 0 1012 16.825 4.825 4.825 0 0012 7.175zm0 7.825a3 3 0 110-6 3 3 0 010 6z"/>
      <path fill="currentColor" d="M16.806 2H7.194A5.2 5.2 0 002 7.194v9.612A5.2 5.2 0 007.194 22h9.612A5.2 5.2 0 0022 16.806V7.194A5.2 5.2 0 0016.806 2zm3.319 14.806a3.325 3.325 0 01-3.319 3.319H7.194a3.325 3.325 0 01-3.319-3.319V7.194a3.325 3.325 0 013.319-3.319h9.612a3.325 3.325 0 013.319 3.319v9.612z"/>
      <path fill="currentColor" d="M17.525 6.975a1.2 1.2 0 11-2.4 0 1.2 1.2 0 012.4 0z"/>
    </svg>
  )
}

const socialLinks = [
  {
    platform: 'youtube',
    label: 'YouTube',
    href: 'https://www.youtube.com/@AlgoJourney',
    icon: YoutubeIcon,
    stat: '10K+',
    statLabel: 'Subscribers',
    handle: '@AlgoJourney',
    cardClass: 'social-card-youtube',
  },
  {
    platform: 'linkedin',
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/algojourney',
    icon: LinkedinIcon,
    stat: '5K+',
    statLabel: 'Followers',
    handle: 'AlgoJourney',
    cardClass: 'social-card-linkedin',
  },
  {
    platform: 'instagram',
    label: 'Instagram',
    href: 'https://www.instagram.com/algojourney',
    icon: InstagramIcon,
    stat: '3K+',
    statLabel: 'Followers',
    handle: '@algojourney',
    cardClass: 'social-card-instagram',
  },
]

interface SocialReachProps {
  stats: HomeStats | null
}

export function SocialReach({ stats }: SocialReachProps) {
  return (
    <section className="relative py-20 sm:py-28 overflow-hidden" aria-labelledby="social-heading">
      <div className="container-page relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          {/* ─── Left: Laptop Mockup with Instagram Reel ─── */}
          <motion.div
            initial={{ opacity: 0, x: -30, rotate: -2 }}
            whileInView={{ opacity: 1, x: 0, rotate: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            {/* Decorative X lines */}
            <div className="reach-x" aria-hidden="true">
              <span className="reach-x-bar reach-x-bar-a" />
              <span className="reach-x-bar reach-x-bar-b" />
            </div>

            {/* Glow behind laptop */}
            <div className="absolute left-1/2 top-1/2 -z-10 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#EC4899]/15 blur-[120px]" aria-hidden="true" />

            {/* CSS Phone Mockup */}
            <div className="phone-mockup">
              <div className="phone-bezel">
                <div className="phone-notch">
                  <div className="phone-speaker" />
                  <div className="phone-camera" />
                </div>
                <div className="phone-screen">
                  <div className="ig-iframe-wrapper">
                    <iframe
                      src="https://www.instagram.com/reel/DZF-Kt0iuDM/embed/"
                      scrolling="no"
                      allowTransparency={true}
                      allow="encrypted-media"
                      loading="lazy"
                      title="Instagram Reel"
                    />
                  </div>
                </div>
                <div className="phone-buttons-left" />
                <div className="phone-buttons-right" />
              </div>
            </div>
          </motion.div>

          {/* ─── Right: Text + Social Cards Row + CTA ─── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col"
          >
            {stats && (
              <p className="text-4xl font-bold tabular-nums text-white sm:text-5xl lg:text-6xl" aria-label={`${stats.learners.toLocaleString()}+`}>
                {stats.learners.toLocaleString()}+
              </p>
            )}

            <h2 id="social-heading" className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Engineers learning on{' '}
              <span className="font-accent italic text-[#327CF6]">AlgoJourney</span>
            </h2>

            <p className="mt-4 max-w-md text-base leading-relaxed text-white/55">
              From YouTube to LinkedIn, our global community keeps growing every
              day. AlgoJourney is the go-to place for engineers preparing for tech
              interviews.
            </p>

            {/* Compact Horizontal Social Cards */}
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {socialLinks.map((social, i) => (
                <motion.a
                  key={social.platform}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                  className={`social-card !p-3 ${social.cardClass} ${social.platform === 'instagram' ? 'sm:col-span-2' : ''}`}
                  aria-label={`${social.label}: ${social.stat} ${social.statLabel}`}
                >
                  <social.icon className="h-5 w-5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">
                      {social.stat} <span className="font-normal text-white/50 dark:text-white/50">{social.statLabel}</span>
                    </p>
                    <p className="text-xs text-white/40 dark:text-white/40">{social.handle}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-white/30 transition-transform group-hover:translate-x-1" />
                </motion.a>
              ))}
            </div>

            <div className="mt-8 pt-4 border-t border-white/10 dark:border-white/10">
              <Link
                to={ROUTES.ABOUT}
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-transparent px-5 py-2.5 text-sm font-medium text-white/80 transition-all hover:border-white/25 hover:bg-white/5 hover:text-white"
              >
                Join Our Community
                <ArrowRight className="h-4 w-4 transition-transform hover:translate-x-0.5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
