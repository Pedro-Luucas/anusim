import { describe, it, expect } from "vitest"
import { parseQueryPlan, isAllowedSource, sourcePriority } from "../src/lib/rag/search"

describe("live fallback helpers", () => {
  it("parses the model query plan JSON", () => {
    const plan = parseQueryPlan('Here: {"terms":"shabbat rest שבת","refs":["Genesis 2:1-3","Exodus 20:8-11", 3]}')
    expect(plan).toEqual({ terms: "shabbat rest שבת", refs: ["Genesis 2:1-3", "Exodus 20:8-11"] })
    expect(parseQueryPlan("no json")).toBeNull()
  })
  it("excludes dictionaries and liturgy", () => {
    expect(isAllowedSource("Klein Dictionary, שְׁבוּת", ["Reference", "Dictionary"])).toBe(false)
    expect(isAllowedSource("Siddur Sefard, Sukkot, Sabbath 7", ["Liturgy", "Siddur"])).toBe(false)
    expect(isAllowedSource("Genesis 2:1-3", ["Tanakh", "Torah"])).toBe(true)
    expect(isAllowedSource("Shulchan Arukh, Orach Chayim 261:1", ["Halakhah", "Shulchan Arukh"])).toBe(true)
  })
  it("prioritizes Tanakh, Sephardic halakha, then Bavli over Yerushalmi", () => {
    const torah = sourcePriority("Exodus 20:8", ["Tanakh", "Torah"])
    const sa = sourcePriority("Shulchan Arukh, Orach Chayim 1:1", ["Halakhah", "Shulchan Arukh"])
    const bavli = sourcePriority("Shabbat 73a:1", ["Talmud", "Bavli", "Seder Moed"])
    const yeru = sourcePriority("Jerusalem Talmud Beitzah 5:2:2", ["Talmud", "Yerushalmi"])
    expect(torah).toBeLessThan(sa)
    expect(sa).toBeLessThan(bavli)
    expect(bavli).toBeLessThan(yeru)
  })
})
