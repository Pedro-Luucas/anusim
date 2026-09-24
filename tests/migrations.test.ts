import { describe, it, expect } from "vitest"
import { readFileSync } from "fs"
import { resolve } from "path"

describe("Supabase Migrations", () => {
  it("should have correct type casts in search function", () => {
    const migration5 = readFileSync(
      resolve(__dirname, "../supabase/migrations/20260924000005_fix_search_types.sql"),
      "utf-8"
    )

    // Verify migration drops the old function
    expect(migration5).toContain("drop function if exists search_sefaria_chunks")

    // Verify all critical type casts are present
    expect(migration5).toMatch(/similarity float/i)
    expect(migration5).toMatch(/text_rank float/i)
    expect(migration5).toMatch(/combined_score float/i)

    // Verify text_rank has explicit ::float cast
    expect(migration5).toMatch(/\)::float as text_rank/)

    // Verify combined_score has explicit ::float cast
    expect(migration5).toMatch(/\)::float as combined_score/)

    // Verify similarity also has ::float cast for consistency
    expect(migration5).toMatch(/::float as similarity/)
  })

  it("should include all 6 migrations", () => {
    const migrationsDir = resolve(__dirname, "../supabase/migrations")

    const expected = [
      "20260924000000_rag_pgvector.sql",
      "20260924000001_hebrew_fulltext.sql",
      "20260924000002_add_he_text.sql",
      "20260924000003_unique_constraint.sql",
      "20260924000004_search_he_text.sql",
      "20260924000005_fix_search_types.sql",
    ]

    for (const migration of expected) {
      const path = resolve(migrationsDir, migration)
      const content = readFileSync(path, "utf-8")
      expect(content.length).toBeGreaterThan(0)
    }
  })
})
