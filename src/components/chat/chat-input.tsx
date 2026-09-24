"use client"

import type { FormEvent, ChangeEvent } from "react"

type ChatInputProps = {
  input: string
  handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void
  isLoading: boolean
}

export function ChatInput({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
}: ChatInputProps) {
  return (
    <div className="border-t border-gold-200/60 bg-cream-50/80 p-4 backdrop-blur-sm md:p-6">
      <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <label htmlFor="chat-input" className="sr-only">
              Digite sua pergunta
            </label>
            <input
              id="chat-input"
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Pergunte sobre a Torá, Talmud, Shabat, kashrut..."
              disabled={isLoading}
              maxLength={500}
              className="w-full rounded-full border border-gold-300 bg-white px-5 py-3 text-sm text-ink-900 placeholder:text-ink-500/60 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20 disabled:cursor-not-allowed disabled:opacity-50"
              autoComplete="off"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="flex h-12 min-w-[48px] items-center justify-center rounded-full bg-gold-500 px-6 font-medium text-ink-900 transition-all hover:bg-gold-600 focus:outline-none focus:ring-2 focus:ring-gold-500/50 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Enviar pergunta"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>

        <p className="mt-2 text-center text-xs text-ink-500">
          Máximo 500 caracteres por mensagem
        </p>
      </form>
    </div>
  )
}
