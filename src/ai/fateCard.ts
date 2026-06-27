import type { FateCard, HistoricalEvent, Locale } from '../lib/types'
import { chat, type ChatOptions } from './client'
import { buildFateCardPrompt } from './prompts'

function stripFence(raw: string): string {
  const m = raw.match(/```(?:json)?\s*([\s\S]*?)```/i)
  return m ? m[1].trim() : raw.trim()
}

export function parseFateCardJSON(raw: string, event: HistoricalEvent, choiceId: string): FateCard {
  const obj = JSON.parse(stripFence(raw))
  if (!obj.outcome || typeof obj.outcome.zh !== 'string' || typeof obj.outcome.en !== 'string') {
    throw new Error('fate card missing outcome')
  }
  return {
    eventId: event.id,
    choiceId,
    outcome: { zh: obj.outcome.zh, en: obj.outcome.en },
    footnote: { zh: obj.footnote?.zh ?? event.footnote.zh, en: obj.footnote?.en ?? event.footnote.en },
  }
}

export async function generateFateCard(
  event: HistoricalEvent,
  choiceId: string,
  locale: Locale,
  opts?: ChatOptions,
): Promise<FateCard> {
  const { system, user } = buildFateCardPrompt(event, choiceId, locale)
  const raw = await chat(
    [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
    opts,
  )
  return parseFateCardJSON(raw, event, choiceId)
}
