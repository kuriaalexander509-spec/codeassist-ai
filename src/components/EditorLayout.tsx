import { useState } from 'react'
import type { Sandbox } from '@blinkdotnew/sdk'
import ChatPanel from './ChatPanel'
import PreviewPanel from './PreviewPanel'
import { codingAgent, askAgent } from '../lib/agent'

export default function EditorLayout({ sandbox }: { sandbox: Sandbox }) {
  const [mode, setMode] = useState<'ask' | 'agent'>('agent')
  const [previewUrl, setPreviewUrl] = useState<string>('')

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="h-12 border-b flex items-center justify-between px-4 bg-secondary/30">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 bg-primary rounded-md flex items-center justify-center text-[10px] font-bold">A</div>
          <span className="font-semibold text-sm">Aether IDE</span>
        </div>
        
        <div className="flex items-center bg-secondary rounded-lg p-1">
          <button
            onClick={() => setMode('ask')}
            className={`px-3 py-1 text-xs rounded-md transition-all ${
              mode === 'ask' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Ask
          </button>
          <button
            onClick={() => setMode('agent')}
            className={`px-3 py-1 text-xs rounded-md transition-all ${
              mode === 'agent' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Agent
          </button>
        </div>

        <div className="w-24"></div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar / Chat */}
        <div className="w-[400px] border-r flex flex-col bg-background">
          <ChatPanel 
            sandbox={sandbox} 
            mode={mode} 
            onPreviewUpdate={setPreviewUrl} 
          />
        </div>

        {/* Preview Area */}
        <div className="flex-1 bg-secondary/10 flex flex-col">
          <PreviewPanel previewUrl={previewUrl} />
        </div>
      </main>
    </div>
  )
}
