import { describe, it, expect } from "vitest"
import { readFileSync } from "fs"
import { isNearBottom } from "../src/components/chat/message-list"

describe("chat auto-scroll", () => {
  it("treats within 100px of the bottom as near bottom", () => {
    expect(isNearBottom({ scrollHeight: 1000, scrollTop: 500, clientHeight: 400 })).toBe(true)
    expect(isNearBottom({ scrollHeight: 1000, scrollTop: 450, clientHeight: 400 })).toBe(false)
  })
  it("never scrolls the page via scrollIntoView or window.scrollTo", () => {
    for (const f of ["chat-interface.tsx", "message-list.tsx", "message-bubble.tsx", "chat-input.tsx"]) {
      const src = readFileSync(`src/components/chat/${f}`, "utf8")
      expect(src).not.toMatch(/scrollIntoView|window\.scroll/)
    }
  })
})
