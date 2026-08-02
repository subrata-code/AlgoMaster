import { Button } from '@/components/ui/button'

export type SocialProvider = 'Google' | 'GitHub' | 'LinkedIn'

interface SocialAuthButtonsProps {
  onSelect: (provider: SocialProvider) => void
}

function SocialIcon({ provider }: { provider: SocialProvider }) {
  if (provider === 'Google') {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
        <path
          d="M21.6 12.23c0-.74-.07-1.45-.2-2.13H12v4.03h5.39a4.6 4.6 0 0 1-2 3.02v2.5h3.23c1.89-1.74 2.98-4.31 2.98-7.42Z"
          fill="#4285F4"
        />
        <path
          d="M12 21.6c2.7 0 4.97-.9 6.63-2.43l-3.23-2.5c-.9.6-2.04.96-3.4.96-2.61 0-4.82-1.76-5.61-4.13H1.08v2.64A9.6 9.6 0 0 0 12 21.6Z"
          fill="#34A853"
        />
        <path
          d="M6.39 13.5A5.75 5.75 0 0 1 6.1 11c0-.63.11-1.24.3-1.82V6.54H3.13A9.6 9.6 0 0 0 1.08 11c0 1.52.36 2.96.99 4.24l4.32-1.74Z"
          fill="#FBBC05"
        />
        <path
          d="M12 3.55c1.48 0 2.81.51 3.86 1.51l2.87-2.87C16.97.9 14.7 0 12 0A9.6 9.6 0 0 0 3.13 6.54l4.27 3.29C8.18 5.31 9.99 3.55 12 3.55Z"
          fill="#EA4335"
        />
      </svg>
    )
  }

  if (provider === 'GitHub') {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
        <path d="M12 1.5a10.5 10.5 0 0 0-3.32 20.45c.52.1.72-.23.72-.5v-1.77c-2.95.64-3.57-1.42-3.57-1.42-.48-1.22-1.18-1.55-1.18-1.55-.97-.66.07-.65.07-.65 1.08.08 1.64 1.12 1.64 1.12.95 1.64 2.49 1.17 3.1.9.09-.7.37-1.18.68-1.45-2.36-.27-4.84-1.18-4.84-5.27 0-1.17.42-2.12 1.1-2.87-.11-.27-.48-1.36.1-2.84 0 0 .9-.29 2.95 1.1A10.2 10.2 0 0 1 12 6.94c.9 0 1.82.12 2.67.35 2.04-1.4 2.94-1.1 2.94-1.1.59 1.48.22 2.57.11 2.84.69.75 1.1 1.7 1.1 2.87 0 4.1-2.49 5-4.87 5.27.39.33.74 1 .74 2.03v3c0 .28.2.62.73.5A10.5 10.5 0 0 0 12 1.5Z" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
      <rect x="2.5" y="2.5" width="19" height="19" rx="4" fill="#0A66C2" />
      <path d="M8 8.95h2.75v7.1H8V8.95Zm1.37-2.28A1.48 1.48 0 1 1 8.9 7.9a1.47 1.47 0 0 1 1.47-1.47Zm3.03 2.28H15.1v1.02h.05c.46-.88 1.59-1.8 3.27-1.8 3.5 0 4.15 2.3 4.15 5.3v3.58h-2.75v-3.36c0-1.26-.03-2.88-1.75-2.88-1.75 0-2.02 1.37-2.02 2.78v3.46H12.4V8.95Z" fill="white" />
    </svg>
  )
}

export function SocialAuthButtons({ onSelect }: SocialAuthButtonsProps) {
  const providers: SocialProvider[] = ['Google', 'GitHub', 'LinkedIn']

  const providerStyles: Record<SocialProvider, string> = {
    Google: 'border-[#ea4335]/30 bg-[#ea4335]/5 text-[#ea4335] hover:bg-[#ea4335]/10',
    GitHub: 'border-white/10 bg-muted/50 hover:bg-muted',
    LinkedIn: 'border-[#0a66c2]/30 bg-[#0a66c2]/5 text-[#0a66c2] hover:bg-[#0a66c2]/10',
  }

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
      {providers.map((provider) => (
        <Button
          key={provider}
          type="button"
          variant="outline"
          className={`w-full justify-center gap-2 rounded-xl border ${providerStyles[provider]}`}
          onClick={() => onSelect(provider)}
        >
          <SocialIcon provider={provider} />
          {provider}
        </Button>
      ))}
    </div>
  )
}
