import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRounter from './router/index.tsx'
import AuthProvider from './authen/AuthContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <AppRounter />
    </AuthProvider>
  </StrictMode>,
)
