import { describe, it, expect } from "vitest"
import { sanitizeDashes } from "../src/lib/rag/sanitize"

describe("Dash Sanitizer", () => {
  it("should replace em dashes with commas", () => {
    expect(sanitizeDashes("Text before—text after")).toBe("Text before,text after")
    expect(sanitizeDashes("One—two—three")).toBe("One,two,three")
  })

  it("should replace en dashes with hyphens", () => {
    expect(sanitizeDashes("Text before–text after")).toBe("Text before-text after")
    expect(sanitizeDashes("One–two–three")).toBe("One-two-three")
  })

  it("should handle mixed dash types", () => {
    expect(sanitizeDashes("Em dash—and en dash–together")).toBe(
      "Em dash,and en dash-together"
    )
  })

  it("should leave regular hyphens unchanged", () => {
    expect(sanitizeDashes("well-known")).toBe("well-known")
    expect(sanitizeDashes("test-case-example")).toBe("test-case-example")
  })

  it("should handle text with no dashes", () => {
    expect(sanitizeDashes("Normal text without any dashes")).toBe(
      "Normal text without any dashes"
    )
  })

  it("should handle empty string", () => {
    expect(sanitizeDashes("")).toBe("")
  })

  it("should handle multiple consecutive dashes", () => {
    expect(sanitizeDashes("Text——more——text")).toBe("Text,,more,,text")
    expect(sanitizeDashes("Text––more––text")).toBe("Text--more--text")
  })
})
