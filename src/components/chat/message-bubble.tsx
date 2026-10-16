"use client"

import ReactMarkdown, { type Components } from "react-markdown"
import remarkGfm from "remark-gfm"

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
          <div className="max-w-none">
            <FormattedResponse content={message.content} />
          </div>
        )}
      </div>
    </div>
  )
}

const markdownComponents: Components = {
  h1: ({ children }) => <h3 dir="auto" className="mt-4 mb-2 font-serif text-lg font-semibold text-gold-700 first:mt-0">{children}</h3>,
  h2: ({ children }) => <h3 dir="auto" className="mt-4 mb-2 font-serif text-base font-semibold text-gold-700 first:mt-0">{children}</h3>,
  h3: ({ children }) => <h4 dir="auto" className="mt-3 mb-1 font-semibold text-gold-700 first:mt-0">{children}</h4>,
  h4: ({ children }) => <h4 dir="auto" className="mt-3 mb-1 font-semibold text-ink-900 first:mt-0">{children}</h4>,
  p: ({ children }) => <p dir="auto" className="my-2 leading-relaxed first:mt-0 last:mb-0">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold text-gold-700">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  ul: ({ children }) => <ul className="my-2 list-disc space-y-1 pl-5">{children}</ul>,
  ol: ({ children }) => <ol className="my-2 list-decimal space-y-1 pl-5">{children}</ol>,
  li: ({ children }) => <li dir="auto" className="leading-relaxed">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote dir="auto" className="my-2 border-l-2 border-gold-400 bg-cream-50/80 py-1 pl-3 text-ink-700 italic">
      {children}
    </blockquote>
  ),
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-gold-700 underline underline-offset-2 hover:text-gold-600">
      {children}
    </a>
  ),
  hr: () => <hr className="my-3 border-gold-200" />,
  code: ({ children }) => <code className="rounded bg-gold-50 px-1 text-[0.85em]">{children}</code>,
  table: ({ children }) => (
    <div className="my-2 overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => <th dir="auto" className="border-b border-gold-300 px-2 py-1 font-semibold">{children}</th>,
  td: ({ children }) => <td dir="auto" className="border-b border-gold-100 px-2 py-1">{children}</td>,
}

export function FormattedResponse({ content }: { content: string }) {
  return (
    <div className="text-sm leading-relaxed text-ink-900">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={markdownComponents}
        skipHtml
        disallowedElements={["img"]}
        unwrapDisallowed
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
