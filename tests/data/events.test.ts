import { describe, it, expect } from 'vitest'
import { EVENTS, getDailyEvent, getEventById } from '../../src/data/events'

describe('event library', () => {
  it('returns the exact event for a scheduled date', () => {
    expect(getDailyEvent('2026-06-28').id).toBe('fan-yang-755')
  })

  it('returns a stable fallback for an unscheduled date', () => {
    const a = getDailyEvent('2030-01-01')
    const b = getDailyEvent('2030-01-01')
    expect(a.id).toBe(b.id)
    expect(EVENTS.map((e) => e.id)).toContain(a.id)
  })

  it('getEventById finds and misses', () => {
    expect(getEventById('mawei-756')?.yearCE).toBe(756)
    expect(getEventById('nope')).toBeUndefined()
  })

  it('every event has exactly 3 choices', () => {
    for (const e of EVENTS) expect(e.choices).toHaveLength(3)
  })
})
