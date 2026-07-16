import { Link } from 'react-router-dom'
import { Lock, Sparkles } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants'

interface PremiumModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contentType?: 'solution' | 'video'
}

export function PremiumModal({ open, onOpenChange, contentType = 'solution' }: PremiumModalProps) {
  const label = contentType === 'video' ? 'Concept Video' : 'Solution'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Lock className="h-5 w-5 text-muted-foreground" aria-hidden />
          </div>
          <DialogTitle className="text-center">Login Required</DialogTitle>
          <DialogDescription className="text-center">
            Unlock the premium {label.toLowerCase()} and continue your learning journey on AlgoJourney.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
          <div className="mb-2 flex items-center gap-2 font-medium text-foreground">
            <Sparkles className="h-4 w-4" />
            Continue Learning
          </div>
          Create a free account to access solutions, concept videos, and personalized progress tracking.
        </div>

        <DialogFooter className="sm:justify-center">
          <Button variant="outline" asChild>
            <Link to={ROUTES.LOGIN} onClick={() => onOpenChange(false)}>
              Log in
            </Link>
          </Button>
          <Button asChild>
            <Link to={ROUTES.SIGNUP} onClick={() => onOpenChange(false)}>
              Sign up
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
