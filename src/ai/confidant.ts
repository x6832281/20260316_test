import type { ConfidantArchetype, HistoricalEvent, Locale, LocalizedText, Persona } from '../lib/types'
import { chat, type ChatOptions } from './client'
import { buildConfidantPrompt } from './prompts'

function stripFence(raw: string): string {
  const m = raw.match(/```(?:json)?\s*([\s\S]*?)```/i)
  return m ? m[1].trim() : raw.trim()
}

export function parseAdvice(raw: string): LocalizedText {
  const obj = JSON.parse(stripFence(raw))
  if (!obj.advice || typeof obj.advice.zh !== 'string' || typeof obj.advice.en !== 'string') {
    throw new Error('advice missing fields')
  }
  return { zh: obj.advice.zh, en: obj.advice.en }
}

export async function getConfidantAdvice(
  event: HistoricalEvent,
  choiceId: string,
  persona: Persona,
  locale: Locale,
  opts?: ChatOptions,
): Promise<LocalizedText> {
  const { system, user } = buildConfidantPrompt(event, choiceId, persona.confidant, persona, locale)
  const raw = await chat(
    [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
    opts,
  )
  return parseAdvice(raw)
}
