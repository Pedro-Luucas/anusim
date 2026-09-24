"use client"

import { useState, useRef } from "react"
import { MessageList } from "./message-list"
import { ChatInput } from "./chat-input"

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

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    }

    const newMessages = [...messages, userMessage]
    const messagesToSend = newMessages.slice(-9)
    
    setMessages(newMessages)
    setInput("")
    setIsLoading(true)
    setError(null)

    abortControllerRef.current = new AbortController()

    try {
              const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  messages: messagesToSend.map((m) => ({
                    role: m.role,
                    content: m.content,
                  })),
                }),
                signal: abortControllerRef.current.signal,
              })

              if (!response.ok) {
                let errorMessage = "Erro ao processar sua pergunta. Tente novamente."
                
                if (response.status === 503) {
                  errorMessage = "O assistente ainda não está configurado."
                } else {
                  try {
                    const errorData = await response.json()
                    errorMessage = errorData.error || errorMessage
                  } catch {
                    // Keep default message if JSON parse fails
                  }
                }

                throw new Error(errorMessage)
              }

      if (!response.body) {
        throw new Error("No response body")
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
      }

      setMessages([...newMessages, assistantMessage])

      let buffer = ""
      let done = false

      while (!done) {
        const { value, done: readerDone } = await reader.read()
        done = readerDone

        if (value) {
          buffer += decoder.decode(value, { stream: true })

          const lines = buffer.split("\n")
          buffer = lines.pop() || ""

          for (const line of lines) {
            if (!line.trim()) continue

            try {
              const event = JSON.parse(line)

              if (event.type === "text") {
                assistantMessage.content += event.delta
                setMessages((prev) => {
                  const updated = [...prev]
                  updated[updated.length - 1] = { ...assistantMessage }
                  return updated
                })
              } else if (event.type === "citations") {
                assistantMessage.citations = event.items
                setMessages((prev) => {
                  const updated = [...prev]
                  updated[updated.length - 1] = { ...assistantMessage }
                  return updated
                })
              } else if (event.type === "error") {
                throw new Error(event.message)
              }
            } catch (err) {
              console.error("[Chat] Failed to parse event:", line, err)
            }
          }
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        setError(
          err.message || "Erro ao processar sua pergunta. Tente novamente."
        )
        console.error("[Chat] Error:", err)
      }
    } finally {
      setIsLoading(false)
      abortControllerRef.current = null
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setInput(e.target.value)
  }

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto flex h-full max-w-4xl flex-col">
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {isLoading ? "Assistente está respondendo" : ""}
      </div>

      <MessageList messages={messages} isLoading={isLoading} />

      {error && (
        <div className="mx-4 mb-4 rounded-lg border border-wine-500/30 bg-wine-500/5 p-4">
          <p className="text-sm text-wine-500">{error}</p>
        </div>
      )}

      <ChatInput
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        onStop={handleStop}
      />
    </div>
  )
}
