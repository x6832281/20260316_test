import { describe, it, expect } from 'vitest'
import { buildFateCardPrompt, buildConfidantPrompt, buildNarrationPrompt } from '../../src/ai/prompts'
import { EVENTS } from '../../src/data/events'
import type { Persona } from '../../src/lib/types'

const event = EVENTS[0]
const persona: Persona = {
  id: 'p1', name: '李沈', birthYearCE: 735,
  birthplace: { zh: '洛阳', en: 'Luoyang' },
  background: { zh: '殷实商贾之家', en: 'A prosperous merchant house' },
  confidant: 'strategist', createdAt: '2026-06-27',
}

describe('prompt builders', () => {
  it('fate card prompt embeds the chosen label and year, in zh', () => {
    const p = buildFateCardPrompt(event, 'flee-south', 'zh')
    expect(p.system).toContain('古代史叙事师')
    expect(p.user).toContain('755')
    expect(p.user).toContain('举家南逃江淮')
  })

  it('confidant prompt names the archetype in en', () => {
    const p = buildConfidantPrompt(event, 'flee-south', 'strategist', persona, 'en')
    expect(p.system).toContain('Strategist')
    expect(p.user).toContain(persona.name)
  })

  it('narration prompt is first-person and localized', () => {
    const p = buildNarrationPrompt(event, 'stay-luoyang', persona, 'zh')
    expect(p.system).toContain('第一人称')
    expect(p.user).toContain('据守洛阳祖宅')
  })
})
