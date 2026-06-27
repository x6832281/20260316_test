export type Locale = 'zh' | 'en'

export type ConfidantArchetype = 'hermit' | 'historian' | 'poet' | 'strategist' | 'monk'

export interface LocalizedText {
  zh: string
  en: string
}

export interface EventChoice {
  id: string
  label: LocalizedText
}

export interface HistoricalEvent {
  id: string
  /** ISO date the event is scheduled for, e.g. "2026-06-28". Determines global same-day fork. */
  date: string
  yearCE: number
  dynasty: string
  title: LocalizedText
  scenario: LocalizedText
  choices: [EventChoice, EventChoice, EventChoice]
  footnote: LocalizedText
}

export type ChoiceId = string

export interface Persona {
  id: string
  name: string
  birthYearCE: number
  birthplace: LocalizedText
  background: LocalizedText
  confidant: ConfidantArchetype
  createdAt: string
}

export interface JournalEntry {
  id: string
  date: string
  eventId: string
  choiceId: ChoiceId
  narration: LocalizedText
  confidantAdvice: LocalizedText
  createdAt: string
}

export interface FateCard {
  eventId: string
  choiceId: ChoiceId
  outcome: LocalizedText
  footnote: LocalizedText
}

export interface GroupResult {
  eventId: string
  counts: Record<ChoiceId, number>
  total: number
  survivalByChoice: Record<ChoiceId, number>
}
