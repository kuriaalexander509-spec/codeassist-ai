import { useState, useEffect } from 'react'

export default function PreviewPanel({ previewUrl }: { previewUrl: string }) {
  const [showIframe, setShowIframe] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Trust delay to avoid "Closed Port Error"
  useEffect(() => {
    if (previewUrl) {
      const timer = setTimeout(() => setShowIframe(true), 3000)
      return () => clearTimeout(timer)
    } else {
      setShowIframe(false)
    }
  }, [previewUrl])

  const handleRefresh = () => {
    setIsRefreshing(true)
    const url = previewUrl
    setShowIframe(false)
    setTimeout(() => {
      setShowIframe(true)
      setIsRefreshing(false)
    }, 500)
  }

  if (!previewUrl) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
        <div className="h-16 w-16 rounded-full border-4 border-dashed border-muted flex items-center justify-center mb-6">
          <svg className="h-8 w-8 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">Ready to Build</h3>
        <p className="text-sm max-w-xs">
          Your live preview will appear here once the agent starts the development server.
        </p>
      </div>
    )
  }

  return (
    <div className="h-full w-full flex flex-col relative">
      {/* Controls */}
      <div className="h-10 border-b flex items-center justify-between px-3 bg-secondary/20">
        <div className="flex items-center gap-2 overflow-hidden max-w-[70%]">
          <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <span className="text-[10px] font-mono truncate opacity-60 uppercase tracking-tighter">{previewUrl}</span>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-1.5 hover:bg-secondary rounded-md transition-colors"
          >
            <svg className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <a 
            href={previewUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-1.5 hover:bg-secondary rounded-md transition-colors"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>

      {/* Iframe */}
      <div className="flex-1 bg-white relative">
        {!showIframe && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-secondary/5 backdrop-blur-sm z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary mb-4"></div>
            <p className="text-xs font-mono opacity-50 uppercase tracking-widest">Warming up sandbox...</p>
          </div>
        )}
        {showIframe && (
          <iframe
            src={previewUrl}
            className="h-full w-full border-none"
            title="Preview"
          />
        )}
      </div>
    </div>
  )
}
