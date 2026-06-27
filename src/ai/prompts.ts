import type { ConfidantArchetype, HistoricalEvent, Locale, LocalizedText, Persona } from '../lib/types'

export interface Prompt {
  system: string
  user: string
}

const ARCHETYPE_NAME: Record<ConfidantArchetype, LocalizedText> = {
  hermit: { zh: '隐士(道)', en: 'The Hermit (Daoist)' },
  historian: { zh: '太史(儒)', en: 'The Historian (Confucian)' },
  poet: { zh: '词客(文)', en: 'The Poet' },
  strategist: { zh: '谋臣(智)', en: 'The Strategist' },
  monk: { zh: '禅师(佛)', en: 'The Zen Monk' },
}

const LANG: Record<Locale, 'zh' | 'en'> = { zh: 'zh', en: 'en' }

const HISTORY_GUARD_ZH =
  '你必须严格符合该年份的真实历史背景,不得虚构重大史实、不得改变已知历史走向。'
const HISTORY_GUARD_EN =
  'You must strictly fit the real historical setting of that year. Do not invent major facts or alter the known course of history.'

function guard(locale: Locale): string {
  return locale === 'zh' ? HISTORY_GUARD_ZH : HISTORY_GUARD_EN
}

export function buildFateCardPrompt(event: HistoricalEvent, choiceId: string, locale: Locale): Prompt {
  const lang = LANG[locale]
  const choice = event.choices.find((c) => c.id === choiceId)
  const system =
    locale === 'zh'
      ? `你是一位古代史叙事师。根据用户的历史抉择,推演其后30–90天的命运,产出一句结局。${guard(locale)}只输出 JSON。`
      : `You are a narrator of ancient history. Given the user's choice, unfold the next 30–90 days of fate into one outcome sentence. ${guard(locale)} Output JSON only.`
  const user = JSON.stringify({
    year: event.yearCE,
    dynasty: event.dynasty,
    scenario: event.scenario[lang],
    choice: choice?.label[lang],
    footnote: event.footnote[lang],
    format: { outcome: `string in ${lang}`, footnote: `string in ${lang}` },
  })
  return { system, user }
}

export function buildConfidantPrompt(
  event: HistoricalEvent,
  choiceId: string,
  archetype: ConfidantArchetype,
  persona: Persona,
  locale: Locale,
): Prompt {
  const lang = LANG[locale]
  const choice = event.choices.find((c) => c.id === choiceId)
  const system =
    locale === 'zh'
      ? `你是用户的AI知己,原型为「${ARCHETYPE_NAME[archetype].zh}」。用一句话给出克制而睿智的参谋,决策权在用户。${guard(locale)}只输出 JSON。`
      : `You are the user's AI confidant, archetype "${ARCHETYPE_NAME[archetype].en}". Offer one restrained, wise sentence of advice; the decision is the user's. ${guard(locale)} Output JSON only.`
  const user = JSON.stringify({
    personaName: persona.name,
    background: persona.background[lang],
    year: event.yearCE,
    scenario: event.scenario[lang],
    contemplatedChoice: choice?.label[lang],
    format: { advice: `string in ${lang}` },
  })
  return { system, user }
}

export function buildNarrationPrompt(
  event: HistoricalEvent,
  choiceId: string,
  persona: Persona,
  locale: Locale,
): Prompt {
  const lang = LANG[locale]
  const choice = event.choices.find((c) => c.id === choiceId)
  const system =
    locale === 'zh'
      ? `你以分身「${persona.name}」的第一人称写一段日记,记录这次抉择与其后3–6月的命运。${guard(locale)}只输出 JSON。`
      : `Write a first-person journal entry as "${persona.name}", recording this choice and the fate of the following 3–6 months. ${guard(locale)} Output JSON only.`
  const user = JSON.stringify({
    personaName: persona.name,
    background: persona.background[lang],
    year: event.yearCE,
    scenario: event.scenario[lang],
    choice: choice?.label[lang],
    format: { narration: `string in ${lang}` },
  })
  return { system, user }
}
