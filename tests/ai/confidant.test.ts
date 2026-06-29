import { describe, it, expect, vi } from 'vitest'
import { getConfidantAdvice, parseAdvice } from '../../src/ai/confidant'
import { EVENTS } from '../../src/data/events'
import type { Persona } from '../../src/lib/types'
import type { ChatOptions } from '../../src/ai/client'

const event = EVENTS[0]
const persona: Persona = {
  id: 'p1', name: '李沈', birthYearCE: 735,
  birthplace: { zh: '洛阳', en: 'Luoyang' },
  background: { zh: '殷实商贾之家', en: 'A prosperous merchant house' },
  confidant: 'strategist', createdAt: '2026-06-27',
}

describe('confidant', () => {
  it('parseAdvice reads both locales', () => {
    const a = parseAdvice(JSON.stringify({ advice: { zh: '避之。', en: 'Avoid him.' } }))
    expect(a.zh).toBe('避之。')
    expect(a.en).toBe('Avoid him.')
  })

  it('throws on missing fields', () => {
    expect(() => parseAdvice(JSON.stringify({ advice: { zh: 'x' } }))).toThrow()
  })

  it('getConfidantAdvice calls chat and returns parsed advice', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ choices: [{ message: { content: JSON.stringify({ advice: { zh: '宜避', en: 'Best to avoid' } }) } }] }), { status: 200 }),
    )
    const advice = await getConfidantAdvice(event, 'flee-south', persona, 'zh', {
      apiKey: 'k', fetchFn: fetchMock as ChatOptions['fetchFn'],
    })
    expect(advice.en).toBe('Best to avoid')
    expect(fetchMock).toHaveBeenCalled()
  })
})
