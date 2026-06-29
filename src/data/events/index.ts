import type { HistoricalEvent } from '../../lib/types'
import { TANG_TIANBAO_EVENTS } from './tang-tianbao'

export const EVENTS: HistoricalEvent[] = [...TANG_TIANBAO_EVENTS]

/** Returns the event whose `date` matches `YYYY-MM-DD`. If none, falls back to a stable hash of the date so the world always sees one fork. */
export function getDailyEvent(date: string): HistoricalEvent {
  const exact = EVENTS.find((e) => e.date === date)
  if (exact) return exact
  // Stable fallback: pick by hash so the whole world shares one fork for any date.
  const idx = hashDate(date) % EVENTS.length
  return EVENTS[idx]
}

export function getEventById(id: string): HistoricalEvent | undefined {
  return EVENTS.find((e) => e.id === id)
}

function hashDate(date: string): number {
  let h = 0
  for (let i = 0; i < date.length; i++) {
    h = (h * 31 + date.charCodeAt(i)) >>> 0
  }
  return h
}
