import { Link } from 'react-router-dom'
import { Bookmark, BookmarkCheck, ExternalLink, Lightbulb, Lock, Play } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import type { Difficulty, Problem } from '@/types'
import { cn } from '@/lib/utils'

const difficultyVariant: Record<Difficulty, 'easy' | 'medium' | 'hard'> = {
  Easy: 'easy',
  Medium: 'medium',
  Hard: 'hard',
}

interface ProblemCardProps {
  problem: Problem
  bookmarked?: boolean
  onBookmark?: (id: string) => void
  onHints?: (problem: Problem) => void
  onLocked?: (type: 'solution' | 'video') => void
  className?: string
}

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return <Badge variant={difficultyVariant[difficulty]}>{difficulty}</Badge>
}

export function ProblemCard({
  problem,
  bookmarked,
  onBookmark,
  onHints,
  onLocked,
  className,
}: ProblemCardProps) {
  return (
    <Card className={cn('flex h-full flex-col transition-shadow hover:shadow-md', className)}>
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            {problem.day != null && (
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Day {problem.day}</p>
            )}
            <CardTitle className="text-base leading-snug">
              <Link to={`/problems/${problem.id}`} className="hover:underline">
                {problem.name}
              </Link>
            </CardTitle>
          </div>
          <DifficultyBadge difficulty={problem.difficulty} />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">{problem.platform}</Badge>
          {problem.companies.slice(0, 2).map((c) => (
            <Badge key={c} variant="secondary">
              {c}
            </Badge>
          ))}
          {problem.companies.length > 2 && (
            <Badge variant="secondary">+{problem.companies.length - 2}</Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="flex flex-wrap gap-1.5">
          {problem.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex flex-wrap gap-2 border-t border-border pt-4">
        <Button size="sm" variant="outline" asChild>
          <a href={problem.link} target="_blank" rel="noreferrer">
            <ExternalLink className="h-3.5 w-3.5" />
            Open
          </a>
        </Button>
        <Button size="sm" variant="ghost" onClick={() => onHints?.(problem)}>
          <Lightbulb className="h-3.5 w-3.5" />
          Hints
        </Button>
        <Button size="sm" variant="ghost" onClick={() => onLocked?.('solution')}>
          <Lock className="h-3.5 w-3.5" />
          Solution
        </Button>
        <Button size="sm" variant="ghost" onClick={() => onLocked?.('video')}>
          <Play className="h-3.5 w-3.5" />
          Video
        </Button>
        <Button
          size="sm"
          variant="ghost"
          aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark problem'}
          onClick={() => onBookmark?.(problem.id)}
          className="ml-auto"
        >
          {bookmarked ? (
            <BookmarkCheck className="h-3.5 w-3.5 text-primary" />
          ) : (
            <Bookmark className="h-3.5 w-3.5" />
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
