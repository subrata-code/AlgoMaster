import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/PageHeader'
import { useTheme } from '@/context/ThemeContext'
import { toast } from '@/hooks/use-toast'

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [emailNotifs, setEmailNotifs] = useState(true)
  const [streakReminders, setStreakReminders] = useState(true)
  const [weeklyDigest, setWeeklyDigest] = useState(false)
  const [publicProfile, setPublicProfile] = useState(true)
  const [showActivity, setShowActivity] = useState(true)
  const [deleteOpen, setDeleteOpen] = useState(false)

  return (
    <div>
      <PageHeader title="Settings" description="Manage theme, notifications, privacy, and account." />

      <Tabs defaultValue="theme">
        <TabsList className="mb-4">
          <TabsTrigger value="theme">Theme</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="danger">Danger Zone</TabsTrigger>
        </TabsList>

        <TabsContent value="theme">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Appearance</CardTitle>
              <CardDescription>Choose light, dark, or system preference.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {(['light', 'dark', 'system'] as const).map((t) => (
                <Button
                  key={t}
                  variant={theme === t ? 'default' : 'outline'}
                  onClick={() => setTheme(t)}
                  className="capitalize"
                >
                  {t}
                </Button>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Notifications</CardTitle>
              <CardDescription>UI-only preferences — not persisted to a backend yet.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <SettingRow
                id="email"
                label="Email notifications"
                description="Product updates and important account alerts"
                checked={emailNotifs}
                onCheckedChange={setEmailNotifs}
              />
              <SettingRow
                id="streak"
                label="Streak reminders"
                description="Get nudged when your streak is at risk"
                checked={streakReminders}
                onCheckedChange={setStreakReminders}
              />
              <SettingRow
                id="digest"
                label="Weekly digest"
                description="A summary of your progress every Monday"
                checked={weeklyDigest}
                onCheckedChange={setWeeklyDigest}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Privacy</CardTitle>
              <CardDescription>Control what others can see on your profile.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <SettingRow
                id="public"
                label="Public profile"
                description="Allow others to view your journey stats"
                checked={publicProfile}
                onCheckedChange={setPublicProfile}
              />
              <SettingRow
                id="activity"
                label="Show activity"
                description="Display recent solves on your profile"
                checked={showActivity}
                onCheckedChange={setShowActivity}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="danger">
          <Card className="border-destructive/40">
            <CardHeader>
              <CardTitle className="text-base text-destructive">Danger Zone</CardTitle>
              <CardDescription>Irreversible actions. This is UI-only for now.</CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive">Delete account</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete account?</DialogTitle>
                    <DialogDescription>
                      This would permanently delete your account and data. In this phase, nothing is actually deleted.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDeleteOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setDeleteOpen(false)
                        toast({
                          title: 'Not available yet',
                          description: 'Account deletion will be wired to the API later.',
                          variant: 'destructive',
                        })
                      }}
                    >
                      Confirm delete
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function SettingRow({
  id,
  label,
  description,
  checked,
  onCheckedChange,
}: {
  id: string
  label: string
  description: string
  checked: boolean
  onCheckedChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="space-y-0.5">
        <Label htmlFor={id}>{label}</Label>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  )
}
