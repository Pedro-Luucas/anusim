import { describe, test, expect } from 'vitest'
import { verifyCitations, extractRefsFromText } from '../citations'
import type { SefariaChunk } from '../db'

describe('verifyCitations', () => {
  const mockChunks: SefariaChunk[] = [
    {
      id: 1,
      ref: 'Genesis 1:1',
      he_ref: 'בראשית א:א',
      book: 'Genesis',
      category: 'Torah',
      language: 'en',
      version_title: 'JPS 1985',
      license: 'Public Domain',
      sefaria_url: 'https://www.sefaria.org/Genesis.1.1',
      text_content: 'In the beginning...',
    },
    {
      id: 2,
      ref: 'Berakhot 2a',
      he_ref: 'ברכות ב׳ א',
      book: 'Berakhot',
      category: 'Talmud',
      language: 'en',
      version_title: 'William Davidson Talmud',
      license: 'CC-BY-NC',
      sefaria_url: 'https://www.sefaria.org/Berakhot.2a',
      text_content: 'From what time...',
    },
  ]

  test('verifies existing citations', () => {
    const fullText = 'According to Genesis 1:1 and Berakhot 2a'
    const { verified, hallucinated } = verifyCitations(fullText, mockChunks)

    expect(verified).toContain('Genesis 1:1')
    expect(verified).toContain('Berakhot 2a')
    expect(hallucinated).toEqual([])
  })

  test('detects hallucinated citations', () => {
    const fullText = 'According to Genesis 1:1, Exodus 20:1, and Berakhot 2a'
    const { verified, hallucinated } = verifyCitations(fullText, mockChunks)

    expect(verified).toContain('Genesis 1:1')
    expect(verified).toContain('Berakhot 2a')
    expect(hallucinated).toContain('Exodus 20:1')
  })

  test('handles normalized references', () => {
    const fullText = 'According to Genesis 1.1 and Berakhot 2a'
    const { verified, hallucinated } = verifyCitations(fullText, mockChunks)

    expect(verified).toContain('Genesis 1:1')
    expect(verified).toContain('Berakhot 2a')
    expect(hallucinated).toEqual([])
  })

  test('handles empty generated refs', () => {
    const fullText = 'This text has no citations'
    const { verified, hallucinated } = verifyCitations(fullText, mockChunks)

    expect(verified).toEqual([])
    expect(hallucinated).toEqual([])
  })

  test('handles all hallucinated refs', () => {
    const fullText = 'According to Exodus 1:1 and Leviticus 1:1'
    const { verified, hallucinated } = verifyCitations(fullText, mockChunks)

    expect(verified).toEqual([])
    expect(hallucinated.length).toBeGreaterThanOrEqual(2)
  })
})

describe('extractRefsFromText', () => {
  test('extracts basic Torah references', () => {
    const text = 'According to Genesis 1:1 and Exodus 20:8, we learn...'
    const refs = extractRefsFromText(text)

    expect(refs).toContain('Genesis 1:1')
    expect(refs).toContain('Exodus 20:8')
  })

  test('extracts Talmud references', () => {
    const text = 'As stated in Berakhot 2a and Shabbat 31b...'
    const refs = extractRefsFromText(text)

    expect(refs).toContain('Berakhot 2a')
    expect(refs).toContain('Shabbat 31b')
  })

  test('extracts Portuguese book names', () => {
    const text = 'Segundo Gênesis 1:1 e Êxodo 20:8...'
    const refs = extractRefsFromText(text)

    expect(refs).toContain('Gênesis 1:1')
    expect(refs).toContain('Êxodo 20:8')
  })

  test('extracts Mishneh Torah references', () => {
    const text = 'See Mishneh Torah, Laws of Repentance 2:1...'
    const refs = extractRefsFromText(text)

    expect(refs.length).toBeGreaterThan(0)
    expect(refs[0]).toMatch(/Mishneh Torah/)
  })

  test('returns empty array when no refs found', () => {
    const text = 'This text has no biblical or talmudic references.'
    const refs = extractRefsFromText(text)

    expect(refs).toEqual([])
  })

  test('removes duplicate refs', () => {
    const text = 'Genesis 1:1 says... and Genesis 1:1 also mentions...'
    const refs = extractRefsFromText(text)

    expect(refs).toEqual(['Genesis 1:1'])
  })
})
