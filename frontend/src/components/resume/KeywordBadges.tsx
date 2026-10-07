import React from 'react'
import { Check, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface KeywordBadgesProps {
  matched?: string[]
  missed?: string[]
}

export const KeywordBadges: React.FC<KeywordBadgesProps> = ({ matched = [], missed = [] }) => {
  return (
    <div className="space-y-4">
      {/* Matched Keywords */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
            <Check className="h-3 w-3" />
          </span>
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            Matched Keywords ({matched.length})
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {matched.length > 0 ? (
            matched.map((kw, i) => (
              <Badge
                key={i}
                className="bg-emerald-500/10 border-emerald-500/30 text-emerald-300 text-xs px-2.5 py-0.5 font-normal"
              >
                {kw}
              </Badge>
            ))
          ) : (
            <span className="text-xs text-muted-foreground italic">No keywords matched yet</span>
          )}
        </div>
      </div>

      {/* Missing Keywords */}
      {missed.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
              <X className="h-3 w-3" />
            </span>
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              Keywords to Add ({missed.length})
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {missed.map((kw, i) => (
              <Badge
                key={i}
                className="bg-amber-500/10 border-amber-500/30 text-amber-300 text-xs px-2.5 py-0.5 font-normal"
              >
                + {kw}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
