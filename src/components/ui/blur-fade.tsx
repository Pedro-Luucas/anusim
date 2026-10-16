"use client"

import { type CSSProperties, type ReactNode } from "react"

import { cn } from "@/lib/utils"

type BlurFadeProps = {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  offset?: number
  direction?: "up" | "down" | "left" | "right"
  inView?: boolean
  inViewMargin?: string
  blur?: string
}

export function BlurFade({
  children,
  className,
  delay = 0,
}: BlurFadeProps) {
  return (
    <div
      className={cn("magic-fade", className)}
      style={{ animationDelay: `${0.04 + delay}s` } as CSSProperties}
    >
      {children}
    </div>
  )
}
