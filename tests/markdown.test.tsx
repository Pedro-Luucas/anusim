import { describe, it, expect } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import { FormattedResponse } from "../src/components/chat/message-bubble"

describe("FormattedResponse markdown", () => {
  const html = renderToStaticMarkup(
    <FormattedResponse
      content={"## Título\n\nO **Shabat** é o *sétimo* dia, ver [Sefaria](https://www.sefaria.org/Genesis.2.1).\n\n> שבת\n\n- um\n- dois\n\n<script>alert(1)</script>"}
    />
  )
  it("renders headings, quotes and lists without raw markers", () => {
    expect(html).toContain("<h3")
    expect(html).toContain("<blockquote")
    expect(html).toContain("<li")
    expect(html).not.toContain("##")
    expect(html).not.toContain("**")
  })
  it("keeps inline bold inside the same paragraph", () => {
    expect(html).toMatch(/<p[^>]*>O <strong[^>]*>Shabat<\/strong> é o <em[^>]*>sétimo<\/em> dia/)
  })
  it("opens links in a new tab and drops raw HTML", () => {
    expect(html).toContain('target="_blank"')
    expect(html).toContain('rel="noopener noreferrer"')
    expect(html).not.toContain("<script")
  })
  it("sets dir=auto for Hebrew", () => {
    expect(html).toContain('dir="auto"')
  })
})
