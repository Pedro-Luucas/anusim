import { describe, it, expect } from "vitest"
import { verifyCitations } from "../src/lib/rag/citations"
import type { SefariaChunk } from "../src/lib/rag/db"

describe("Citation Verification Filtering", () => {
  const mockChunks: SefariaChunk[] = [
    {
      id: 1,
      ref: "Genesis 1:1",
      he_ref: "בראשית א:א",
      book: "Genesis",
      category: "Tanakh",
      language: "en",
      version_title: "JPS 1985",
      license: "CC-BY",
      sefaria_url: "https://www.sefaria.org/Genesis.1.1",
      text_content: "In the beginning God created heaven and earth",
    },
    {
      id: 2,
      ref: "Talmud Berakhot 2a",
      he_ref: "תלמוד ברכות ב׳ א",
      book: "Berakhot",
      category: "Talmud",
      language: "en",
      version_title: "William Davidson Edition",
      license: "CC-BY-NC",
      sefaria_url: "https://www.sefaria.org/Berakhot.2a",
      text_content: "From what time may one recite the Shema in the evening?",
    },
    {
      id: 3,
      ref: "Exodus 20:1",
      he_ref: "שמות כ:א",
      book: "Exodus",
      category: "Tanakh",
      language: "en",
      version_title: "JPS 1985",
      license: "CC-BY",
      sefaria_url: "https://www.sefaria.org/Exodus.20.1",
      text_content: "And God spoke all these words",
    },
  ]

  it("should filter out hallucinated citations", () => {
    const fullText = "According to Genesis 1:1 and Talmud Berakhot 2a, but also Shulchan Aruch, Orach Chayim 1:1 which is not in chunks"

    const { verified, hallucinated } = verifyCitations(fullText, mockChunks)

    expect(verified).toHaveLength(2)
    expect(verified).toContain("Genesis 1:1")
    expect(verified).toContain("Talmud Berakhot 2a")

    expect(hallucinated.length).toBeGreaterThanOrEqual(1)
  })

  it("should handle case-insensitive matching", () => {
    const fullText = "According to genesis 1:1 and talmud berakhot 2a"

    const { verified, hallucinated } = verifyCitations(fullText, mockChunks)

    expect(verified).toHaveLength(2)
    expect(hallucinated).toHaveLength(0)
  })

  it("should handle Portuguese book names", () => {
    const fullText = "Segundo Gênesis 1:1 e Êxodo 20:1"

    const { verified } = verifyCitations(fullText, mockChunks)

    expect(verified).toHaveLength(2)
  })

  it("should handle reference variations (dash vs colon)", () => {
    const fullText = "According to Genesis 1-1"

    const { verified } = verifyCitations(fullText, mockChunks)

    expect(verified).toHaveLength(1)
  })

  it("should verify empty list when no refs match", () => {
    const fullText = "This text has no citations at all"

    const { verified, hallucinated } = verifyCitations(fullText, mockChunks)

    expect(verified).toHaveLength(0)
    expect(hallucinated).toHaveLength(0)
  })

  it("should return empty arrays when given empty input", () => {
    const { verified, hallucinated } = verifyCitations("", mockChunks)

    expect(verified).toHaveLength(0)
    expect(hallucinated).toHaveLength(0)
  })

  it("should return empty arrays when given empty chunks", () => {
    const { verified, hallucinated } = verifyCitations(
      "According to Genesis 1:1",
      []
    )

    expect(verified).toHaveLength(0)
    expect(hallucinated.length).toBeGreaterThanOrEqual(1)
  })
})
