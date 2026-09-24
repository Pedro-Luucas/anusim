import { describe, it, expect, vi, beforeEach } from "vitest"
import { searchSefaria } from "../src/lib/rag/sefaria"

describe("Sefaria Live Search", () => {
  beforeEach(() => {
    global.fetch = vi.fn()
  })

  it("should send source_proj and field in search-wrapper request", async () => {
    const mockResponse = {
      hits: {
        hits: [
          {
            _source: {
              ref: "Genesis 1:1",
              heRef: "בראשית א:א",
              naive_lemmatizer: "In the beginning God created heaven and earth",
              lang: "en",
            },
          },
        ],
      },
    }

    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response)

    await searchSefaria("shabat", { limit: 5 })

    expect(global.fetch).toHaveBeenCalledWith(
      "https://www.sefaria.org/api/search-wrapper",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: "shabat",
          size: 5,
          type: "text",
          field: "naive_lemmatizer",
          source_proj: true,
        }),
      }
    )
  })

  it("should parse search-wrapper response with _source", async () => {
    const mockResponse = {
      hits: {
        hits: [
          {
            _source: {
              ref: "Mishnah Shabbat 19:4",
              heRef: "משנה שבת י״ט:ד׳",
              naive_lemmatizer: "Aquele que tinha dois bebês... é culpado.",
              lang: "pt",
            },
          },
        ],
      },
    }

    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response)

    const results = await searchSefaria("shabat")

    expect(results).toHaveLength(1)
    expect(results[0].ref).toBe("Mishnah Shabbat 19:4")
    expect(results[0].heRef).toBe("משנה שבת י״ט:ד׳")
    expect(results[0].text).toContain("Aquele que tinha dois bebês")
    expect(results[0].lang).toBe("pt")
  })
})
