import type { ConfidantArchetype, LocalizedText, Persona } from '../lib/types'

const KEY = 'yal.persona'

export interface CreatePersonaInput {
  name: string
  birthYearCE: number
  birthplace: LocalizedText
  background: LocalizedText
  confidant: ConfidantArchetype
}

export function createPersona(input: CreatePersonaInput): Persona {
  const persona: Persona = {
    id: crypto.randomUUID(),
    name: input.name,
    birthYearCE: input.birthYearCE,
    birthplace: input.birthplace,
    background: input.background,
    confidant: input.confidant,
    createdAt: new Date().toISOString(),
  }
  savePersona(persona)
  return persona
}

export function savePersona(persona: Persona): void {
  localStorage.setItem(KEY, JSON.stringify(persona))
}

export function loadPersona(): Persona | null {
  const raw = localStorage.getItem(KEY)
  return raw ? (JSON.parse(raw) as Persona) : null
}

export function hasPersona(): boolean {
  return !!localStorage.getItem(KEY)
}
