import type { JournalEntry } from '../lib/types'

const KEY = 'yal.journal'

export function loadJournal(): JournalEntry[] {
  const raw = localStorage.getItem(KEY)
  return raw ? (JSON.parse(raw) as JournalEntry[]) : []
}

export function appendJournalEntry(entry: JournalEntry): void {
  const list = loadJournal()
  list.push(entry)
  localStorage.setItem(KEY, JSON.stringify(list))
}

export function getEntryForEvent(eventId: string): JournalEntry | undefined {
  return loadJournal().find((e) => e.eventId === eventId)
}
