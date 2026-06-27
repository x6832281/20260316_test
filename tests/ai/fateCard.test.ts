import { describe, it, expect } from 'vitest'
import { parseFateCardJSON } from '../../src/ai/fateCard'
import { EVENTS } from '../../src/data/events'

const event = EVENTS[0]

describe('parseFateCardJSON', () => {
  it('parses well-formed JSON', () => {
    const raw = JSON.stringify({ outcome: { zh: '你南渡江淮,家业得存。', en: 'You fled south; your house survived.' }, footnote: { zh: '注', en: 'note' } })
    const card = parseFateCardJSON(raw, event, 'flee-south')
    expect(card.choiceId).toBe('flee-south')
    expect(card.outcome.zh).toContain('南渡')
    expect(card.eventId).toBe(event.id)
  })

  it('tolerates a markdown code fence', () => {
    const raw = '```json\n{"outcome":{"zh":"x","en":"y"},"footnote":{"zh":"f","en":"g"}}\n```'
    const card = parseFateCardJSON(raw, event, 'flee-south')
    expect(card.outcome.en).toBe('y')
  })

  it('throws on unparseable input', () => {
    expect(() => parseFateCardJSON('not json', event, 'flee-south')).toThrow()
  })
})
