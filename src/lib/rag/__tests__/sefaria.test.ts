import { describe, test, expect } from 'vitest'
import { buildSefariaUrl } from '../sefaria'

describe('buildSefariaUrl', () => {
  test('converts basic book reference', () => {
    expect(buildSefariaUrl('Genesis 1:1')).toBe('https://www.sefaria.org/Genesis.1.1')
  })

  test('converts reference with spaces', () => {
    expect(buildSefariaUrl('Pirkei Avot 1:1')).toBe('https://www.sefaria.org/Pirkei_Avot.1.1')
  })

  test('converts Talmud reference', () => {
    expect(buildSefariaUrl('Berakhot 2a')).toBe('https://www.sefaria.org/Berakhot.2a')
  })

  test('converts reference with multiple spaces', () => {
    expect(buildSefariaUrl('Shulchan Arukh, Orach Chayim 1:1')).toBe(
      'https://www.sefaria.org/Shulchan_Arukh,_Orach_Chayim.1.1'
    )
  })

  test('converts reference with colons', () => {
    expect(buildSefariaUrl('Exodus 20:8-11')).toBe('https://www.sefaria.org/Exodus.20.8-11')
  })

  test('handles reference with range', () => {
    expect(buildSefariaUrl('Genesis 1:1-3')).toBe('https://www.sefaria.org/Genesis.1.1-3')
  })

  test('handles Rashi commentary', () => {
    expect(buildSefariaUrl('Rashi on Genesis 1:1')).toBe(
      'https://www.sefaria.org/Rashi_on_Genesis.1.1'
    )
  })
})
