import { describe, it, expect } from "vitest"
import { sanitizeDashes } from "../src/lib/rag/sanitize"

describe("Dash Sanitizer", () => {
  it("should replace em dashes with commas (with spacing)", () => {
    expect(sanitizeDashes("text — more")).toBe("text, more")
    expect(sanitizeDashes("texto — outro")).toBe("texto, outro")
  })

  it("should replace em dashes without spaces", () => {
    expect(sanitizeDashes("foo—bar")).toBe("foo, bar")
  })

  it("should replace en dashes with hyphens (with spacing)", () => {
    expect(sanitizeDashes("text – more")).toBe("text - more")
  })

  it("should preserve en-dash between digits as hyphen", () => {
    expect(sanitizeDashes("2020–2021")).toBe("2020-2021")
    expect(sanitizeDashes("pages 10–20")).toBe("pages 10-20")
  })

  it("should handle mixed dash types", () => {
    expect(sanitizeDashes("foo — bar – baz")).toBe("foo, bar - baz")
  })

  it("should leave regular hyphens unchanged", () => {
    expect(sanitizeDashes("well-known")).toBe("well-known")
  })

  it("should handle text with no dashes", () => {
    expect(sanitizeDashes("Normal text")).toBe("Normal text")
  })

  it("should handle empty string", () => {
    expect(sanitizeDashes("")).toBe("")
  })

  it("should handle multiple consecutive dashes", () => {
    expect(sanitizeDashes("a — — b")).toBe("a, , b")
  })
})
