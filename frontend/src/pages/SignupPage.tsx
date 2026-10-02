import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { SocialAuthButtons } from '@/components/SocialAuthButtons'
import { useAuth } from '@/context/AuthContext'
import { signupSchema, type SignupFormValues } from '@/lib/validations'
import { ROUTES } from '@/constants'
import { toast } from '@/hooks/use-toast'

export default function SignupPage() {
  const navigate = useNavigate()
  const { signup, verifyEmail, resendVerification } = useAuth()
  const location = useLocation()
  const [needsOtp, setNeedsOtp] = useState(location.state?.needsOtp || false)
  const [registeredEmail, setRegisteredEmail] = useState(location.state?.email || '')

  useEffect(() => {
    if (location.state?.needsOtp) {
      setNeedsOtp(true)
      setRegisteredEmail(location.state.email)
    }
  }, [location.state])
  const [otp, setOtp] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  })

  const onSubmit = handleSubmit(async (values) => {
    try {
      const response = await signup(values)
      if (response.requiresVerification) {
        setRegisteredEmail(values.email)
        setNeedsOtp(true)
        toast({ title: 'Verification email sent', description: 'Please check your inbox.' })
      } else {
        toast({ title: 'Account created', description: 'Your account is ready.' })
        void navigate(ROUTES.DASHBOARD)
      }
    } catch (error) {
      toast({ title: 'Signup failed', description: error instanceof Error ? error.message : 'Unable to create account.' })
    }
  })

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otp) return
    setIsVerifying(true)
    try {
      await verifyEmail(registeredEmail, otp)
      toast({ title: 'Email verified', description: 'Your account is now active.' })
      void navigate(ROUTES.DASHBOARD)
    } catch (error) {
      toast({ title: 'Verification failed', description: error instanceof Error ? error.message : 'Invalid OTP.' })
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResendOtp = async () => {
    try {
      await resendVerification(registeredEmail)
      toast({ title: 'OTP Resent', description: 'A new verification code has been sent.' })
    } catch (error) {
      toast({ title: 'Failed to resend', description: error instanceof Error ? error.message : 'Unable to resend OTP.' })
    }
  }

  if (needsOtp) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Verify your email</CardTitle>
          <CardDescription>We sent a 6-digit verification code to {registeredEmail}.</CardDescription>
        </CardHeader>
        <form onSubmit={handleVerify}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <Input
                id="otp"
                type="text"
                placeholder="123456"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full" disabled={isVerifying}>
              {isVerifying ? 'Verifying...' : 'Verify Email'}
            </Button>
            <Button type="button" variant="link" className="w-full" onClick={handleResendOtp}>
              Resend verification code
            </Button>
          </CardFooter>
        </form>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create account</CardTitle>
        <CardDescription>Start tracking your DSA journey with a real backend account.</CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-4">
          <SocialAuthButtons />

          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs uppercase tracking-[0.22em] text-muted-foreground">or</span>
            <Separator className="flex-1" />
          </div>

          {(
            [
              ['name', 'Name', 'text', 'name'],
              ['email', 'Email', 'email', 'email'],
              ['password', 'Password', 'password', 'new-password'],
              ['confirmPassword', 'Confirm password', 'password', 'new-password'],
            ] as const
          ).map(([field, label, type, autoComplete]) => (
            <div key={field} className="space-y-2">
              <Label htmlFor={field}>{label}</Label>
              <Input id={field} type={type} autoComplete={autoComplete} {...register(field)} />
              {errors[field] && <p className="text-sm text-destructive">{errors[field]?.message}</p>}
            </div>
          ))}
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Sign up'}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to={ROUTES.LOGIN} className="font-medium text-foreground hover:underline">
              Log in
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
