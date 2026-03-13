import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BlinkProvider, BlinkAuthProvider } from '@blinkdotnew/react'
import { getProjectId } from './lib/blink'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BlinkProvider 
      projectId={getProjectId()}
      publishableKey={import.meta.env.VITE_BLINK_PUBLISHABLE_KEY}
    >
      <BlinkAuthProvider>
        <App />
      </BlinkAuthProvider>
    </BlinkProvider>
  </StrictMode>
)
