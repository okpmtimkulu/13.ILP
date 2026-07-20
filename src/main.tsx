import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './theme/ThemeProvider'
import { validateBundledCurriculum } from './lib/validateCurriculum'

if (import.meta.env.DEV) {
  const r = validateBundledCurriculum()
  if (!r.success) {
    console.error('[ILP] Curriculum schema mismatch', r.error)
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
