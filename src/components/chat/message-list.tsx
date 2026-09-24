"use client"

import { useEffect, useRef } from "react"
import { MessageBubble } from "./message-bubble"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
}

type MessageListProps = {
  messages: Message[]
  isLoading: boolean
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="max-w-md text-center">
          <div className="mb-4 text-5xl font-hebrew text-gold-500" dir="rtl">
            תּוֹרָה
          </div>
          <h2 className="mb-3 font-display text-2xl font-medium text-ink-900">
            Pergunte sobre a Torá
          </h2>
          <p className="text-sm leading-relaxed text-ink-500">
            Faça perguntas sobre textos sagrados judaicos. O assistente responde
            com base em fontes da Torá, Talmud, Mishná, Shulchan Aruch e
            comentaristas clássicos.
          </p>
          <div className="mt-6 space-y-2">
            <p className="text-xs text-ink-500">Exemplos de perguntas:</p>
            <div className="flex flex-wrap gap-2">
              {[
                "O que é Shabat?",
                "Como acender velas de Shabat?",
                "O que diz a Torá sobre caridade?",
              ].map((example) => (
                <span
                  key={example}
                  className="rounded-full bg-gold-50 px-3 py-1.5 text-xs text-ink-700"
                >
                  {example}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="flex-1 space-y-6 overflow-y-auto px-4 py-6 md:px-6"
      role="log"
      aria-live="polite"
      aria-label="Conversa"
    >
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-ink-500">
          <div className="flex gap-1">
            <span className="h-2 w-2 animate-bounce rounded-full bg-gold-500 [animation-delay:-0.3s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-gold-500 [animation-delay:-0.15s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-gold-500" />
          </div>
          <span>Consultando fontes...</span>
        </div>
      )}

      <div ref={endRef} />
    </div>
  )
}
