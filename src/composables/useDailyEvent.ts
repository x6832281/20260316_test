import { ref } from 'vue'
import { getDailyEvent } from '../data/events'
import type { HistoricalEvent } from '../lib/types'

export function useDailyEvent() {
  // YYYY-MM-DD in UTC, so the whole world shares one fork per day.
  const today = new Date().toISOString().slice(0, 10)
  const event = ref<HistoricalEvent>(getDailyEvent(today))
  return { event, today }
}
