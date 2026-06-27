export interface Env {
  COUNTS: KVNamespace
}

interface ChoiceBody {
  eventId: string
  choiceId: string
  deviceId: string
}

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  })
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    if (req.method === 'OPTIONS') return new Response(null, { headers: CORS })

    const url = new URL(req.url)

    if (req.method === 'POST' && url.pathname === '/choice') {
      const body = (await req.json()) as ChoiceBody
      if (!body.eventId || !body.choiceId || !body.deviceId) {
        return json({ ok: false, error: 'missing fields' }, 400)
      }
      // One counted choice per device per event: store the chosen id under a device key.
      const deviceKey = `dev:${body.eventId}:${body.deviceId}`
      const prior = await env.COUNTS.get(deviceKey)
      if (prior && prior === body.choiceId) {
        return json({ ok: true, deduped: true })
      }
      // Decrement prior count if the device switched (rare; irreversibility is enforced client-side).
      if (prior) {
        const oldCount = parseInt((await env.COUNTS.get(`cnt:${body.eventId}:${prior}`)) || '0', 10)
        await env.COUNTS.put(`cnt:${body.eventId}:${prior}`, String(Math.max(0, oldCount - 1)))
      }
      const newCount = parseInt((await env.COUNTS.get(`cnt:${body.eventId}:${body.choiceId}`)) || '0', 10) + 1
      await env.COUNTS.put(`cnt:${body.eventId}:${body.choiceId}`, String(newCount))
      await env.COUNTS.put(deviceKey, body.choiceId)
      return json({ ok: true })
    }

    if (req.method === 'GET' && url.pathname === '/result') {
      const eventId = url.searchParams.get('eventId')
      if (!eventId) return json({ ok: false, error: 'missing eventId' }, 400)
      const list = await env.COUNTS.list({ prefix: `cnt:${eventId}:` })
      const counts: Record<string, number> = {}
      let total = 0
      for (const k of list.keys) {
        const choiceId = k.name.split(':')[2]
        const v = parseInt((await env.COUNTS.get(k.name)) || '0', 10)
        counts[choiceId] = v
        total += v
      }
      return json({ eventId, counts, total, survivalByChoice: {} })
    }

    return json({ ok: false, error: 'not found' }, 404)
  },
}
