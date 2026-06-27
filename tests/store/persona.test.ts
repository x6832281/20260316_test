import { describe, it, expect, beforeEach } from 'vitest'
import { createPersona, loadPersona, hasPersona, savePersona } from '../../src/store/persona'

describe('persona store', () => {
  beforeEach(() => localStorage.clear())

  it('creates and persists a persona', () => {
    const p = createPersona({
      name: '李沈',
      birthYearCE: 735,
      birthplace: { zh: '洛阳', en: 'Luoyang' },
      background: { zh: '商贾', en: 'Merchant' },
      confidant: 'strategist',
    })
    expect(p.id).toBeTruthy()
    expect(hasPersona()).toBe(true)
    expect(loadPersona()?.name).toBe('李沈')
  })

  it('savePersona overwrites', () => {
    const p = createPersona({ name: 'A', birthYearCE: 735, birthplace: { zh: 'x', en: 'y' }, background: { zh: 'x', en: 'y' }, confidant: 'poet' })
    p.name = 'B'
    savePersona(p)
    expect(loadPersona()?.name).toBe('B')
  })
})
