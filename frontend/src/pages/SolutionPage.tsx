import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronLeft, Lock, ArrowRight } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { problemService } from '@/services'
import { Loader } from '@/components/EmptyState'
import type { Problem } from '@/types'
import { ROUTES } from '@/constants'
import { useAuth } from '@/context/AuthContext'
import { PremiumModal } from '@/components/PremiumModal'

export default function SolutionPage() {
  const { id } = useParams<{ id: string }>()
  const [problem, setProblem] = useState<Problem | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const [premiumOpen, setPremiumOpen] = useState(false)
  const isPremium = true // Or get it from user subscription

  useEffect(() => {
    async function load() {
      if (!id) return
      try {
        const p = await problemService.getById(id)
        setProblem(p)
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [id])

  if (loading) return <Loader label="Loading solution..." />
  if (!problem) return <div className="p-8 text-center">Problem not found.</div>

  // Ideally, checking if the user actually has a premium subscription.
  // We'll mock it for now.
  const hasAccess = user && isPremium

  return (
    <div className="container mx-auto py-8">
      <Button variant="ghost" asChild className="mb-6 -ml-4">
        <Link to={`/problems/${id}`}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Problem
        </Link>
      </Button>

      <PageHeader 
        title={`Solution: ${problem.name}`} 
        description="Premium walkthrough, code, and complexity analysis."
      />

      {!hasAccess ? (
        <div className="mt-8 rounded-xl border border-border bg-card p-12 text-center shadow-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80" />
          <Lock className="mx-auto mb-4 h-12 w-12 text-muted-foreground relative z-10" />
          <h3 className="mb-2 text-xl font-bold relative z-10">Premium Solution</h3>
          <p className="mx-auto mb-6 max-w-md text-muted-foreground relative z-10">
            Unlock our detailed walkthroughs, optimized code solutions, and big-O analysis.
          </p>
          <Button onClick={() => setPremiumOpen(true)} className="relative z-10">
            Upgrade to Premium
          </Button>
          <PremiumModal open={premiumOpen} onOpenChange={setPremiumOpen} contentType="solution" />
        </div>
      ) : (
        <div className="mt-8 prose prose-invert max-w-none">
          {/* Real solution markdown would be rendered here */}
          <div className="rounded-lg bg-card p-6 border border-border">
            <h3 className="text-xl font-semibold mb-4 mt-0">Approach</h3>
            <p>
              {problem.solution || 'The solution explanation goes here. We will break down the problem into logical steps, discuss edge cases, and present an optimal algorithm.'}
            </p>
            <h3 className="text-xl font-semibold mb-4">Code</h3>
            <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
              <code>
{`// Sample Code Placeholder
function solve(input) {
  // Optimal O(N) approach
  return input;
}`}
              </code>
            </pre>
            <h3 className="text-xl font-semibold mb-4">Complexity</h3>
            <ul className="list-disc pl-5">
              <li><strong>Time:</strong> O(N)</li>
              <li><strong>Space:</strong> O(1)</li>
            </ul>
          </div>
          
          <div className="mt-8 flex justify-between items-center border-t border-border pt-6">
            <Button variant="outline" asChild>
              <Link to={`/problems/${id}`}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Return to Problem
              </Link>
            </Button>
            <Button asChild>
              <Link to={ROUTES.PROBLEMS}>
                Next Problem
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
