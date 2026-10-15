import { describe, it, expect } from "vitest"
import { stripHtml } from "../src/lib/rag/sefaria"

describe("stripHtml entity decoding", () => {
  it("decodes &thinsp; and &nbsp; in Hebrew text", () => {
    expect(stripHtml("שָׁמ֛וֹר&thinsp;אֶת&nbsp;י֥וֹם")).toBe("שָׁמ֛וֹר אֶת י֥וֹם")
  })
  it("decodes named and numeric entities in English", () => {
    expect(stripHtml("Observe&mdash;the day &amp; keep it &#8220;holy&#x201D; &hellip;")).toBe(
      "Observe\u2014the day & keep it \u201Choly\u201D \u2026"
    )
  })
  it("decodes after stripping tags so escaped markup stays literal", () => {
    expect(stripHtml("<b>a</b> &lt;i&gt; b")).toBe("a <i> b")
  })
  it("leaves unknown entities and bare ampersands alone", () => {
    expect(stripHtml("Tom & Jerry &notanentity;")).toBe("Tom & Jerry &notanentity;")
  })
  it("still removes footnotes", () => {
    expect(stripHtml('text<sup class="footnote-marker">1</sup><i class="footnote">note</i> end')).toBe("text end")
  })
})
