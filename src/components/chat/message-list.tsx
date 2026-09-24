"use client"

import { MessageBubble } from "./message-bubble"
import { CitationCard } from "./citation-card"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  citations?: VerifiedCitation[]
}

type VerifiedCitation = {
  ref: string
  heRef?: string
  url: string
  versionTitle: string
  license?: string
  excerpt: string
  heExcerpt?: string
}

type MessageListProps = {
  messages: Message[]
  isLoading: boolean
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  return (
    <div className="flex-1 space-y-6 overflow-y-auto px-4 py-6">
      {messages.map((message) => (
        <div key={message.id} className="space-y-3">
          <MessageBubble message={message} />
          {message.role === "assistant" &&
            message.citations &&
            message.citations.length > 0 && (
              <div className="ml-12 space-y-2">
                <p className="text-xs font-medium uppercase tracking-wide text-ink-500">
                  Fontes
                </p>
                <div className="space-y-2">
                  {message.citations.map((citation, citIdx) => (
                    <CitationCard key={citIdx} citation={citation} />
                  ))}
                </div>
              </div>
            )}
        </div>
      ))}
      {isLoading && (
        <div className="flex items-center space-x-2 text-ink-500">
          <div className="h-2 w-2 animate-bounce rounded-full bg-gold-500 [animation-delay:-0.3s]" />
          <div className="h-2 w-2 animate-bounce rounded-full bg-gold-500 [animation-delay:-0.15s]" />
          <div className="h-2 w-2 animate-bounce rounded-full bg-gold-500" />
        </div>
      )}
    </div>
  )
}
