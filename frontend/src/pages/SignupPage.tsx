import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/context/AuthContext'
import { signupSchema, type SignupFormValues } from '@/lib/validations'
import { ROUTES } from '@/constants'
import { toast } from '@/hooks/use-toast'

export default function SignupPage() {
  const navigate = useNavigate()
  const { signup } = useAuth()
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
      await signup(values)
      toast({ title: 'Account created', description: 'Your account is ready.' })
      void navigate(ROUTES.DASHBOARD)
    } catch (error) {
      toast({ title: 'Signup failed', description: error instanceof Error ? error.message : 'Unable to create account.' })
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create account</CardTitle>
        <CardDescription>Start tracking your DSA journey with a real backend account.</CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-4">
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
