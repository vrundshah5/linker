import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.tsx'
import queryClient from './lib/queryClient.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster position="top-right" toastOptions={{ className: 'text-sm' }} />
      </QueryClientProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
