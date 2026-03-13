import { useBlinkAuth } from '@blinkdotnew/react'
import { useEffect, useState } from 'react'
import { blink } from './lib/blink'
import EditorLayout from './components/EditorLayout'
import type { Sandbox } from '@blinkdotnew/sdk'

export default function App() {
  const { isAuthenticated, isLoading: authLoading } = useBlinkAuth()
  const [sandbox, setSandbox] = useState<Sandbox | null>(null)
  const [isInitializing, setIsInitializing] = useState(false)

  useEffect(() => {
    if (!isAuthenticated || sandbox || isInitializing) return

    setIsInitializing(true)
    blink.sandbox.create({ template: 'devtools-base', metadata: { type: 'code-editor' } })
      .then(setSandbox)
      .catch(err => console.error('Failed to create sandbox:', err))
      .finally(() => setIsInitializing(false))
  }, [isAuthenticated, sandbox, isInitializing])

  if (authLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-background p-4 text-center">
        <h1 className="text-4xl font-bold mb-4 tracking-tight">Aether IDE</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          The intelligent coding assistant that builds and executes code in real-time.
        </p>
        <button
          onClick={() => blink.auth.login(window.location.href)}
          className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-all shadow-lg shadow-primary/20"
        >
          Sign In to Start Coding
        </button>
      </div>
    )
  }

  if (!sandbox) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-background p-4 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-primary/20 rounded-full mb-4 flex items-center justify-center">
            <div className="h-6 w-6 bg-primary rounded-full"></div>
          </div>
          <p className="text-muted-foreground">Initializing your development sandbox...</p>
        </div>
      </div>
    )
  }

  return <EditorLayout sandbox={sandbox} />
}
