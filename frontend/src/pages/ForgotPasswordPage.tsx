import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authService } from '@/services'
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '@/lib/validations'
import { ROUTES } from '@/constants'

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  const onSubmit = handleSubmit(async (values) => {
    const res = await authService.forgotPassword(values.email)
    setMessage(res.message)
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reset password</CardTitle>
        <CardDescription>Enter your email and we&apos;ll send a reset link (mock).</CardDescription>
      </CardHeader>
      {message ? (
        <CardContent className="space-y-4">
          <p className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">{message}</p>
          <Button asChild className="w-full">
            <Link to={ROUTES.LOGIN}>Back to login</Link>
          </Button>
        </CardContent>
      ) : (
        <form onSubmit={onSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" autoComplete="email" {...register('email')} />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send reset link'}
            </Button>
            <Link to={ROUTES.LOGIN} className="text-center text-sm text-muted-foreground hover:text-foreground">
              Back to login
            </Link>
          </CardFooter>
        </form>
      )}
    </Card>
  )
}
