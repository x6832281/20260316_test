import { describe, it, expect, beforeEach } from 'vitest'
import { appendJournalEntry, loadJournal, getEntryForEvent } from '../../src/store/destiny'
import type { JournalEntry } from '../../src/lib/types'

function mk(eventId: string, choiceId: string): JournalEntry {
  return {
    id: 'j1', date: '2026-06-28', eventId, choiceId,
    narration: { zh: 'n', en: 'n' }, confidantAdvice: { zh: 'a', en: 'a' }, createdAt: '2026-06-27',
  }
}

describe('destiny store', () => {
  beforeEach(() => localStorage.clear())

  it('appends and loads entries', () => {
    appendJournalEntry(mk('fan-yang-755', 'flee-south'))
    expect(loadJournal()).toHaveLength(1)
  })

  it('getEntryForEvent finds by event', () => {
    appendJournalEntry(mk('fan-yang-755', 'flee-south'))
    expect(getEntryForEvent('fan-yang-755')?.choiceId).toBe('flee-south')
    expect(getEntryForEvent('nope')).toBeUndefined()
  })
})
