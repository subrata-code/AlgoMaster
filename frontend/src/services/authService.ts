import { apiRequest } from '@/lib/api'
import type { User } from '@/types'

export interface AuthCredentials {
  email: string
  password: string
}

export interface SignupData extends AuthCredentials {
  name: string
}

interface RawBackendUser {
  _id?: string
  id?: string
  name: string
  username?: string
  email: string
  role?: 'user' | 'admin'
  bio?: string
  location?: string
  github?: string
  linkedin?: string
  profileImage?: string
  avatar?: string
  createdAt?: string
  joinedAt?: string
}

function normalizeUser(user: RawBackendUser): User {
  return {
    id: user._id ?? user.id ?? user.email,
    name: user.name,
    username: user.username ?? user.email.split('@')[0],
    email: user.email,
    avatar: user.profileImage ?? user.avatar,
    bio: user.bio ?? '',
    role: user.role ?? 'user',
    joinedAt: user.createdAt ?? user.joinedAt ?? new Date().toISOString(),
    location: user.location,
    github: user.github,
    linkedin: user.linkedin,
  }
}

export const authService = {
  async login(credentials: AuthCredentials): Promise<{ user: User; token: string }> {
    const response = await apiRequest<{ user: RawBackendUser; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })

    return {
      user: normalizeUser(response.data!.user),
      token: response.data!.token,
    }
  },

  async signup(data: SignupData): Promise<{ user: User; token: string }> {
    const response = await apiRequest<{ user: RawBackendUser; token: string }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    })

    return {
      user: normalizeUser(response.data!.user),
      token: response.data!.token,
    }
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiRequest<{ user: RawBackendUser }>('/auth/me')
    return normalizeUser(response.data!.user)
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await apiRequest<{ resetToken?: string; resetUrl?: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })

    return {
      message: response.message ?? 'If an account exists with that email, a reset link has been sent.',
    }
  },

  async resetPassword(token: string, password: string): Promise<{ user: User; token: string }> {
    const response = await apiRequest<{ user: RawBackendUser; token: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    })

    return {
      user: normalizeUser(response.data!.user),
      token: response.data!.token,
    }
  },

  async logout(): Promise<void> {
    await apiRequest('/auth/logout', {
      method: 'POST',
    })
  },
}
