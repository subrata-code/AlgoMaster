import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@/context/ThemeContext'
import { AuthProvider } from '@/context/AuthContext'
import { Toaster } from '@/components/ui/toaster'
import { AppRoutes } from '@/routes'

import { GoogleOAuthProvider } from '@react-oauth/google'

export default function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'dummy-client-id'

  return (
    <ThemeProvider defaultTheme="dark" storageKey="algojourney-theme">
      <BrowserRouter>
        <GoogleOAuthProvider clientId={googleClientId}>
          <AuthProvider>
            <AppRoutes />
            <Toaster />
          </AuthProvider>
        </GoogleOAuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}
