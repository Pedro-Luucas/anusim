"use client"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
}

type MessageBubbleProps = {
  message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user"

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-gold-500 text-ink-900"
            : "border border-gold-200 bg-cream-50 text-ink-900"
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap text-sm leading-relaxed">
            {message.content}
          </p>
        ) : (
          <div className="prose prose-sm max-w-none">
            <FormattedResponse content={message.content} />
          </div>
        )}
      </div>
    </div>
  )
}

function FormattedResponse({ content }: { content: string }) {
  const parts = content.split(/(\*\*[^*]+\*\*)/g)

  return (
    <div className="space-y-3 text-sm leading-relaxed text-ink-900">
      {parts.map((part, idx) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          const text = part.slice(2, -2)
          return (
            <strong key={idx} className="font-semibold text-gold-700">
              {text}
            </strong>
          )
        }

        const lines = part.split("\n")
        return lines.map((line, lineIdx) =>
          line.trim() ? (
            <p key={`${idx}-${lineIdx}`} className="leading-relaxed">
              {line}
            </p>
          ) : null
        )
      })}
    </div>
  )
}
