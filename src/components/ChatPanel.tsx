import { useAgent } from '@blinkdotnew/react'
import { useEffect, useRef } from 'react'
import type { Sandbox } from '@blinkdotnew/sdk'
import { codingAgent, askAgent } from '../lib/agent'
import { getPreviewUrl } from '../lib/sandbox'
import { blink } from '../lib/blink'

export default function ChatPanel({ 
  sandbox, 
  mode, 
  onPreviewUpdate 
}: { 
  sandbox: Sandbox
  mode: 'ask' | 'agent'
  onPreviewUpdate: (url: string) => void
}) {
  const agent = mode === 'agent' ? codingAgent : askAgent
  
  const { 
    messages, 
    input, 
    handleInputChange, 
    handleSubmit, 
    isLoading,
    error 
  } = useAgent({
    agent,
    sandbox,
    onFinish: () => {
      if (mode === 'agent') {
        // Port 5173 is standard for Vite
        onPreviewUpdate(getPreviewUrl(sandbox.id, 5173))
      }
    }
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Auth 401 Catch Fallback
    try {
      await handleSubmit(e)
    } catch (err: any) {
      const isAuthError =
        err?.details?.originalError?.name === 'BlinkAuthError' ||
        err?.message?.includes('401') ||
        err?.message?.includes('Unauthorized')
      
      if (isAuthError) {
        blink.auth.login(window.location.href)
      }
    }
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-50">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <p className="text-sm font-medium">What would you like to build today?</p>
            <p className="text-xs">Try: "Build a modern crypto dashboard with GSAP animations"</p>
          </div>
        )}
        
        {messages.map((m) => (
          <div key={m.id} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
              m.role === 'user' 
                ? 'bg-primary text-primary-foreground rounded-tr-none' 
                : 'bg-secondary text-foreground rounded-tl-none'
            }`}>
              {m.content}
              
              {/* Tool Traces */}
              {m.parts?.map((part, i) => (
                part.type === 'tool-invocation' && (
                  <div key={i} className="mt-2 pt-2 border-t border-foreground/10 flex items-center gap-2 opacity-60 text-[10px] font-mono uppercase tracking-wider">
                    <div className={`h-1.5 w-1.5 rounded-full ${part.state === 'pending' ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                    {part.toolName}
                  </div>
                )
              ))}
            </div>
          </div>
        ))}
        
        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs">
            {error.message}
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-background">
        <form onSubmit={onFormSubmit} className="relative group">
          <div className="absolute inset-0 bg-primary/5 rounded-xl blur-xl transition-all group-focus-within:bg-primary/10" />
          <div className="relative bg-secondary/50 border border-border rounded-xl p-2 focus-within:border-primary/50 transition-all shadow-sm">
            <textarea
              value={input}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e as any)
                }
              }}
              placeholder={mode === 'agent' ? "Build me something amazing..." : "Ask a question about your code..."}
              className="w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 resize-none min-h-[60px] max-h-[200px] text-sm px-2 py-1"
              disabled={isLoading}
            />
            <div className="flex items-center justify-between px-2 pb-1">
              <div className="text-[10px] text-muted-foreground font-mono">
                {isLoading ? 'WORKING...' : mode.toUpperCase() + ' MODE'}
              </div>
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 disabled:opacity-30 transition-all shadow-sm"
              >
                {isLoading ? (
                  <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin rounded-full" />
                ) : (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
