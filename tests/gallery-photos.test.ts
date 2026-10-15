import { existsSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

import { ALBUMS, PHOTOS } from "@/lib/photos"
import { LOGIN_LABEL, PRIMARY_NAV } from "@/lib/nav"

describe("gallery photo files", () => {
  it("lists every album photo that exists on disk", () => {
    const publicDir = join(process.cwd(), "public")

    for (const [album, files] of Object.entries(PHOTOS)) {
      expect(files.length).toBeGreaterThan(0)
      for (const file of files) {
        const absolute = join(publicDir, file.replace(/^\//, ""))
        expect(existsSync(absolute), `${album}: missing ${file}`).toBe(true)
      }
    }
  })

  it("includes the Pessach album with 16 photos", () => {
    expect(PHOTOS.pessach).toHaveLength(16)
    expect(ALBUMS.some((album) => album.key === "pessach")).toBe(true)
  })
})

describe("primary navigation", () => {
  it("lists Entrar once, outside the primary links", () => {
    const labels = PRIMARY_NAV.map((link) => link.label)
    expect(labels).not.toContain(LOGIN_LABEL)
    expect(new Set(labels).size).toBe(labels.length)
  })
})
