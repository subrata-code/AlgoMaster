import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { SocialAuthButtons } from '@/components/SocialAuthButtons'
import { useAuth } from '@/context/AuthContext'
import { loginSchema, type LoginFormValues } from '@/lib/validations'
import { ROUTES } from '@/constants'
import { toast } from '@/hooks/use-toast'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = handleSubmit(async (values) => {
    try {
      await login(values)
      toast({ title: 'Welcome back', description: 'Signed in successfully.' })
      void navigate(ROUTES.DASHBOARD)
    } catch (error) {
      toast({ title: 'Login failed', description: error instanceof Error ? error.message : 'Unable to sign in.' })
    }
  })

  const handleSocialAuth = (provider: 'Google' | 'GitHub' | 'LinkedIn') => {
    toast({
      title: `${provider} auth is not configured yet`,
      description: 'Enable the backend OAuth provider first, then wire it to this button.',
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log in</CardTitle>
        <CardDescription>Continue your DSA journey with your real account.</CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-4">
          <SocialAuthButtons onSelect={handleSocialAuth} />

          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs uppercase tracking-[0.22em] text-muted-foreground">or</span>
            <Separator className="flex-1" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" autoComplete="email" {...register('email')} />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link to={ROUTES.FORGOT_PASSWORD} className="text-xs text-muted-foreground hover:text-foreground">
                Forgot password?
              </Link>
            </div>
            <Input id="password" type="password" autoComplete="current-password" {...register('password')} />
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Log in'}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            No account?{' '}
            <Link to={ROUTES.SIGNUP} className="font-medium text-foreground hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
