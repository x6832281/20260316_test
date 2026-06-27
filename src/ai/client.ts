export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface ChatOptions {
  model?: string
  apiKey?: string
  baseUrl?: string
  fetchFn?: (input: string, init?: RequestInit) => Promise<Response>
  temperature?: number
}

const DEFAULT_MODEL = 'gpt-4o-mini'
const DEFAULT_BASE = 'https://api.openai.com/v1'

export async function chat(messages: ChatMessage[], opts: ChatOptions = {}): Promise<string> {
  const apiKey = opts.apiKey || (import.meta as any).env?.VITE_OPENAI_API_KEY || ''
  const baseUrl = opts.baseUrl || (import.meta as any).env?.VITE_OPENAI_BASE_URL || DEFAULT_BASE
  const fetchFn = opts.fetchFn || fetch
  const res = await fetchFn(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: opts.model || DEFAULT_MODEL,
      temperature: opts.temperature ?? 0.8,
      messages,
    }),
  })
  if (!res.ok) throw new Error(`chat failed: ${res.status}`)
  const data = await res.json()
  return data.choices[0].message.content
}
