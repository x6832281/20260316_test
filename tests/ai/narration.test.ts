import { describe, it, expect } from 'vitest'
import { parseNarration } from '../../src/ai/narration'

describe('narration', () => {
  it('parseNarration reads both locales', () => {
    const n = parseNarration(JSON.stringify({ narration: { zh: '余南渡。', en: 'I went south.' } }))
    expect(n.zh).toBe('余南渡。')
    expect(n.en).toBe('I went south.')
  })

  it('throws on missing fields', () => {
    expect(() => parseNarration(JSON.stringify({ narration: { zh: 'x' } }))).toThrow()
  })
})
