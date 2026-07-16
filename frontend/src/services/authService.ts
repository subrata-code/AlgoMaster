import { delay } from '@/lib/utils'
import type { User } from '@/types'
import { currentUser } from '@/data'

export interface AuthCredentials {
  email: string
  password: string
}

export interface SignupData extends AuthCredentials {
  name: string
  username: string
}

/** UI-only auth service. No real authentication — returns mock responses. */
export const authService = {
  async login(_credentials: AuthCredentials): Promise<{ user: User; token: string }> {
    await delay(600)
    return { user: currentUser, token: 'mock-jwt-token' }
  },

  async signup(_data: SignupData): Promise<{ user: User; token: string }> {
    await delay(700)
    return {
      user: { ...currentUser, name: _data.name, username: _data.username, email: _data.email },
      token: 'mock-jwt-token',
    }
  },

  async forgotPassword(_email: string): Promise<{ success: boolean; message: string }> {
    await delay(500)
    return {
      success: true,
      message: 'If an account exists with that email, a reset link has been sent.',
    }
  },

  async logout(): Promise<void> {
    await delay(200)
  },
}
