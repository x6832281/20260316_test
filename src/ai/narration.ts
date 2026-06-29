import type { HistoricalEvent, Locale, LocalizedText, Persona } from '../lib/types'
import { chat, type ChatOptions } from './client'
import { buildNarrationPrompt } from './prompts'

function stripFence(raw: string): string {
  const m = raw.match(/```(?:json)?\s*([\s\S]*?)```/i)
  return m ? m[1].trim() : raw.trim()
}

export function parseNarration(raw: string): LocalizedText {
  const obj = JSON.parse(stripFence(raw))
  if (!obj.narration || typeof obj.narration.zh !== 'string' || typeof obj.narration.en !== 'string') {
    throw new Error('narration missing fields')
  }
  return { zh: obj.narration.zh, en: obj.narration.en }
}

export async function narrateJournalEntry(
  event: HistoricalEvent,
  choiceId: string,
  persona: Persona,
  locale: Locale,
  opts?: ChatOptions,
): Promise<LocalizedText> {
  const { system, user } = buildNarrationPrompt(event, choiceId, persona, locale)
  const raw = await chat(
    [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
    opts,
  )
  return parseNarration(raw)
}
