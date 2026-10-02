import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface DashboardTourProps {
  onComplete: () => void
}

export function DashboardTour({ onComplete }: DashboardTourProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/70 p-4 backdrop-blur-sm sm:items-center">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle>Dashboard tour</CardTitle>
          <CardDescription>
            Solved counts and streaks update when you mark a problem solved. Bookmarks live in the sidebar. The weekly chart fills in as you practice.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" onClick={onComplete}>
            Got it
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
