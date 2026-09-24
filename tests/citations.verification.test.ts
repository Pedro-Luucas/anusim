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
      created_at: new Date().toISOString(),
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
      created_at: new Date().toISOString(),
    },
    {
      id: 3,
      ref: "Mishneh Torah, Laws of Shabbat 1:1",
      he_ref: "משנה תורה, הלכות שבת א:א",
      book: "Mishneh Torah",
      category: "Halakhah",
      language: "en",
      version_title: "Sefaria Community Translation",
      license: "CC0",
      sefaria_url: "https://www.sefaria.org/Mishneh_Torah,_Laws_of_Shabbat.1.1",
      text_content: "Resting on the seventh day is a positive commandment",
      created_at: new Date().toISOString(),
    },
  ]

  it("should filter out hallucinated citations", () => {
    const generatedRefs = [
      "Genesis 1:1",
      "Genesis 2:1", // not in retrieved chunks
      "Talmud Berakhot 2a",
      "Shulchan Aruch, Orach Chayim 1:1", // not in retrieved chunks
    ]

    const { verified, hallucinated } = verifyCitations(generatedRefs, mockChunks)

    expect(verified).toHaveLength(2)
    expect(verified).toContain("Genesis 1:1")
    expect(verified).toContain("Talmud Berakhot 2a")

    expect(hallucinated).toHaveLength(2)
    expect(hallucinated).toContain("Genesis 2:1")
    expect(hallucinated).toContain("Shulchan Aruch, Orach Chayim 1:1")
  })

  it("should handle case-insensitive matching", () => {
    const generatedRefs = ["genesis 1:1", "talmud berakhot 2a"]

    const { verified, hallucinated } = verifyCitations(generatedRefs, mockChunks)

    expect(verified).toHaveLength(2)
    expect(hallucinated).toHaveLength(0)
  })

  it("should handle reference variations (dash vs colon)", () => {
    const generatedRefs = ["Genesis 1-1", "Talmud Berakhot 2a"]

    const { verified } = verifyCitations(generatedRefs, mockChunks)

    expect(verified).toHaveLength(2)
  })

  it("should handle partial book name matches", () => {
    const generatedRefs = ["Talmud Berakhot 2a"]

    const { verified } = verifyCitations(generatedRefs, mockChunks)

    expect(verified).toHaveLength(1)
    expect(verified[0]).toMatch(/berakhot.*2a/i)
  })

  it("should not match when book prefix is missing", () => {
    const generatedRefs = ["Berakhot 2a"]

    const { verified, hallucinated } = verifyCitations(generatedRefs, mockChunks)

    expect(verified).toHaveLength(0)
    expect(hallucinated).toHaveLength(1)
  })

  it("should verify empty list when no refs match", () => {
    const generatedRefs = [
      "Exodus 20:1",
      "Shulchan Aruch, Yoreh Deah 1:1",
      "Zohar 1:1a",
    ]

    const { verified, hallucinated } = verifyCitations(generatedRefs, mockChunks)

    expect(verified).toHaveLength(0)
    expect(hallucinated).toHaveLength(3)
  })

  it("should handle complex Mishneh Torah references", () => {
    const generatedRefs = [
      "Mishneh Torah, Laws of Shabbat 1:1",
    ]

    const { verified, hallucinated } = verifyCitations(generatedRefs, mockChunks)

    expect(verified).toHaveLength(1)
    expect(hallucinated).toHaveLength(0)
  })

  it("should return empty arrays when given empty input", () => {
    const { verified, hallucinated } = verifyCitations([], mockChunks)

    expect(verified).toHaveLength(0)
    expect(hallucinated).toHaveLength(0)
  })

  it("should return empty arrays when given empty chunks", () => {
    const { verified, hallucinated } = verifyCitations(
      ["Genesis 1:1"],
      []
    )

    expect(verified).toHaveLength(0)
    expect(hallucinated).toHaveLength(1)
  })
})
