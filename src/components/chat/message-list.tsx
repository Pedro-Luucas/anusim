"use client"

import { useEffect, useRef } from "react"

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

export const STICK_TO_BOTTOM_THRESHOLD_PX = 100

export function isNearBottom(
  el: { scrollHeight: number; scrollTop: number; clientHeight: number },
  threshold = STICK_TO_BOTTOM_THRESHOLD_PX
): boolean {
  return el.scrollHeight - el.scrollTop - el.clientHeight <= threshold
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  // Whether the user is following the conversation at the bottom. Updated only
  // by user scrolls, so scrolling up during streaming stops auto-scroll.
  const stickToBottomRef = useRef(true)

  const handleScroll = () => {
    const el = containerRef.current
    if (el) stickToBottomRef.current = isNearBottom(el)
  }

  useEffect(() => {
    const el = containerRef.current
    // Never scroll on initial load / empty state, and only scroll the
    // messages container (never the window).
    if (!el || messages.length === 0) return
    // A question just sent by the user always brings the view down.
    if (messages[messages.length - 1].role === "user") stickToBottomRef.current = true
    if (!stickToBottomRef.current) return
    el.scrollTop = el.scrollHeight
  }, [messages, isLoading])

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 space-y-6 overflow-y-auto px-4 py-6"
    >
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
