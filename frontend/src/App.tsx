import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@/context/ThemeContext'
import { Toaster } from '@/components/ui/toaster'
import { AppRoutes } from '@/routes'

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="algojourney-theme">
      <BrowserRouter>
        <AppRoutes />
        <Toaster />
      </BrowserRouter>
    </ThemeProvider>
  )
}
