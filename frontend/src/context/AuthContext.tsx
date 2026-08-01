import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { authService } from '@/services'
import type { AuthCredentials, SignupData } from '@/services/authService'
import type { User } from '@/types'

interface AuthContextValue {
  user: User | null
  loading: boolean
  login: (credentials: AuthCredentials) => Promise<{ user: User; token: string }>
  signup: (data: SignupData) => Promise<{ user: User; token: string }>
  forgotPassword: (email: string) => Promise<{ message: string }>
  resetPassword: (token: string, password: string) => Promise<{ user: User; token: string }>
  logout: () => Promise<void>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshSession = useCallback(async () => {
    try {
      const currentUser = await authService.getCurrentUser()
      setUser(currentUser)
    } catch {
      setUser(null)
    }
  }, [])

  useEffect(() => {
    let mounted = true

    async function bootstrap() {
      try {
        const currentUser = await authService.getCurrentUser()
        if (mounted) setUser(currentUser)
      } catch {
        if (mounted) setUser(null)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    void bootstrap()

    return () => {
      mounted = false
    }
  }, [])

  const login = useCallback(async (credentials: AuthCredentials) => {
    const response = await authService.login(credentials)
    setUser(response.user)
    return response
  }, [])

  const signup = useCallback(async (data: SignupData) => {
    const response = await authService.signup(data)
    setUser(response.user)
    return response
  }, [])

  const forgotPassword = useCallback(async (email: string) => {
    return authService.forgotPassword(email)
  }, [])

  const resetPassword = useCallback(async (token: string, password: string) => {
    const response = await authService.resetPassword(token, password)
    setUser(response.user)
    return response
  }, [])

  const logout = useCallback(async () => {
    await authService.logout()
    setUser(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      login,
      signup,
      forgotPassword,
      resetPassword,
      logout,
      refreshSession,
    }),
    [loading, login, logout, refreshSession, resetPassword, signup, forgotPassword, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
