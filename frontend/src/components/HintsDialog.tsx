import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Lightbulb } from 'lucide-react'
import type { Problem } from '@/types'

interface HintsDialogProps {
  problem: Problem | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function HintsDialog({ problem, open, onOpenChange }: HintsDialogProps) {
  if (!problem) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Hints — {problem.name}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          {problem.hints.length === 0 ? (
            <p className="text-sm text-muted-foreground">No hints available for this problem yet.</p>
          ) : (
            problem.hints.map((hint, i) => (
              <p key={i} className="rounded-lg bg-muted/60 p-3 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Hint {i + 1}:</span> {hint}
              </p>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
