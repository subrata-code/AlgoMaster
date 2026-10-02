import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/context/AuthContext'
import { userService } from '@/services'
import { ROUTES } from '@/constants'
import { toast } from '@/hooks/use-toast'

const steps = ['Welcome', 'Profile', 'Difficulty', 'First problem'] as const

export default function OnboardingPage() {
  const navigate = useNavigate()
  const { user, refreshSession } = useAuth()
  const [step, setStep] = useState(0)
  const [name, setName] = useState(user?.name ?? '')
  const [bio, setBio] = useState(user?.bio ?? '')
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner')
  const [saving, setSaving] = useState(false)

  const finishAndSuggest = async () => {
    setSaving(true)
    try {
      await userService.updateProfile({ name, bio })
      await userService.updateOnboarding({
        completed: true,
        difficultyPreference: difficulty,
        tourCompleted: false,
      })
      await refreshSession()
      const problem = await userService.getSuggestedProblem()
      toast({ title: 'You are set', description: 'Here is a first problem matched to your level.' })
      void navigate(problem ? `/problems/${problem.slug || problem.id}` : ROUTES.DASHBOARD)
    } catch (error) {
      toast({
        title: 'Could not finish onboarding',
        description: error instanceof Error ? error.message : 'Please try again.',
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl py-6">
      <p className="mb-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">
        Step {step + 1} of {steps.length}
      </p>
      {step === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Welcome to AlgoJourney</CardTitle>
            <CardDescription>
              Track problems, streaks, and a 100-day path. This short setup personalizes your first problem.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setStep(1)}>Get started</Button>
          </CardContent>
        </Card>
      )}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Set your profile</CardTitle>
            <CardDescription>You can change this later from Profile.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" rows={3} value={bio} onChange={(e) => setBio(e.target.value)} />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(0)}>
                Back
              </Button>
              <Button onClick={() => setStep(2)} disabled={name.trim().length < 2}>
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Pick a starting difficulty</CardTitle>
            <CardDescription>We will suggest the easiest unsolved problem in that band.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {(['Beginner', 'Intermediate', 'Advanced'] as const).map((level) => (
              <Button
                key={level}
                variant={difficulty === level ? 'default' : 'outline'}
                className="w-full justify-start"
                onClick={() => setDifficulty(level)}
              >
                {level}
              </Button>
            ))}
            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={() => setStep(3)}>Continue</Button>
            </div>
          </CardContent>
        </Card>
      )}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Ready for your first problem</CardTitle>
            <CardDescription>
              After this we will open a {difficulty.toLowerCase()} problem. Your dashboard tour starts the next time you visit Dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button variant="outline" onClick={() => setStep(2)}>
              Back
            </Button>
            <Button onClick={() => void finishAndSuggest()} disabled={saving}>
              {saving ? 'Saving...' : 'Take me there'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
