import type { GroupResult } from '../lib/types'

export const AGGREGATE_BASE =
  (import.meta as any).env?.VITE_AGGREGATE_URL || 'https://yal-aggregate.workers.dev'

async function defaultFetch(input: string, init?: RequestInit): Promise<Response> {
  return fetch(input, init)
}

export async function submitChoice(
  eventId: string,
  choiceId: string,
  deviceId: string,
  fetchFn: (input: string, init?: RequestInit) => Promise<Response> = defaultFetch,
): Promise<{ ok: boolean }> {
  const res = await fetchFn(`${AGGREGATE_BASE}/choice`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ eventId, choiceId, deviceId }),
  })
  return res.json()
}

export async function fetchGroupResult(
  eventId: string,
  fetchFn: (input: string, init?: RequestInit) => Promise<Response> = defaultFetch,
): Promise<GroupResult> {
  const res = await fetchFn(`${AGGREGATE_BASE}/result?eventId=${encodeURIComponent(eventId)}`)
  return res.json()
}
