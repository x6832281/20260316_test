import { describe, it, expect, vi } from 'vitest'
import { submitChoice, fetchGroupResult, AGGREGATE_BASE } from '../../src/aggregate/client'

describe('aggregate client', () => {
  it('submitChoice posts to /choice with the right body', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }))
    await submitChoice('fan-yang-755', 'flee-south', 'dev-1', fetchMock)
    expect(fetchMock).toHaveBeenCalledWith(
      `${AGGREGATE_BASE}/choice`,
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }),
    )
    const callBody = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(callBody).toEqual({ eventId: 'fan-yang-755', choiceId: 'flee-south', deviceId: 'dev-1' })
  })

  it('fetchGroupResult returns parsed GroupResult', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ eventId: 'e1', counts: { a: 3, b: 1 }, total: 4, survivalByChoice: {} }), { status: 200 }),
    )
    const r = await fetchGroupResult('e1', fetchMock)
    expect(r.total).toBe(4)
    expect(r.counts.a).toBe(3)
  })
})
