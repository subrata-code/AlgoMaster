import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ProblemCard } from '@/components/ProblemCard'
import { PremiumModal } from '@/components/PremiumModal'
import { EmptyState, Loader } from '@/components/EmptyState'
import { PageHeader } from '@/components/PageHeader'
import { bookmarkService, problemService } from '@/services'
import { ROUTES } from '@/constants'
import { toast } from '@/hooks/use-toast'
import type { Problem } from '@/types'

export default function BookmarksPage() {
  const navigate = useNavigate()
  const [problems, setProblems] = useState<Problem[]>([])
  const [loading, setLoading] = useState(true)
  const [premiumOpen, setPremiumOpen] = useState(false)
  const [premiumType, setPremiumType] = useState<'solution' | 'video'>('solution')

  useEffect(() => {
    async function load() {
      const bookmarks = await bookmarkService.getAll()
      const resolved = await Promise.all(bookmarks.map((b) => problemService.getById(b.problemId)))
      setProblems(resolved.filter((p): p is Problem => Boolean(p)))
      setLoading(false)
    }
    void load()
  }, [])

  const handleBookmark = async (id: string) => {
    await bookmarkService.toggle(id)
    setProblems((prev) => prev.filter((p) => p.id !== id))
    toast({ title: 'Removed from bookmarks' })
  }

  if (loading) return <Loader />

  return (
    <div>
      <PageHeader title="Bookmarks" description="Problems you saved for later review." />
      {problems.length === 0 ? (
        <EmptyState
          title="No bookmarks yet"
          description="Save problems from the library to revisit them here."
          actionLabel="Browse problems"
          onAction={() => void navigate(ROUTES.PROBLEMS)}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {problems.map((problem) => (
            <ProblemCard
              key={problem.id}
              problem={problem}
              bookmarked
              onBookmark={handleBookmark}
              onLocked={(type) => {
                setPremiumType(type)
                setPremiumOpen(true)
              }}
            />
          ))}
        </div>
      )}
      <PremiumModal open={premiumOpen} onOpenChange={setPremiumOpen} contentType={premiumType} />
    </div>
  )
}
