import { describe, it, expect, beforeEach } from 'vitest'
import { getDeviceId } from '../../src/lib/deviceId'

describe('getDeviceId', () => {
  beforeEach(() => localStorage.clear())

  it('returns a stable id across calls', () => {
    const a = getDeviceId()
    const b = getDeviceId()
    expect(a).toBeTruthy()
    expect(a).toBe(b)
  })

  it('persists in localStorage', () => {
    const id = getDeviceId()
    expect(localStorage.getItem('yal.deviceId')).toBe(id)
  })
})
