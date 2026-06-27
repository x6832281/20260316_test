<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDailyEvent } from '../composables/useDailyEvent'
import { loadPersona } from '../store/persona'
import { getEntryForEvent, appendJournalEntry } from '../store/destiny'
import { getConfidantAdvice } from '../ai/confidant'
import { narrateJournalEntry } from '../ai/narration'
import ConfidantAdvice from './ConfidantAdvice.vue'
import type { JournalEntry, LocalizedText } from '../lib/types'

const { t, locale } = useI18n()
const { event, today } = useDailyEvent()
const persona = loadPersona()!

const existing = ref<JournalEntry | undefined>(getEntryForEvent(event.value.id))
const chosen = ref<string | null>(existing.value?.choiceId ?? null)
const advice = ref<LocalizedText | null>(null)
const narration = ref<LocalizedText | null>(existing.value?.narration ?? null)
const loading = ref(false)

async function decide(choiceId: string) {
  if (chosen.value || !persona) return
  chosen.value = choiceId
  loading.value = true
  try {
    const [adv, nar] = await Promise.all([
      getConfidantAdvice(event.value, choiceId, persona, locale.value as 'zh' | 'en'),
      narrateJournalEntry(event.value, choiceId, persona, locale.value as 'zh' | 'en'),
    ])
    advice.value = adv
    narration.value = nar
    const entry: JournalEntry = {
      id: crypto.randomUUID(),
      date: today,
      eventId: event.value.id,
      choiceId,
      narration: nar,
      confidantAdvice: adv,
      createdAt: new Date().toISOString(),
    }
    appendJournalEntry(entry)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="w-full max-w-xl">
    <h2 class="text-2xl">{{ t('journal.title') }}</h2>
    <p class="mt-1 text-sm text-ink/60">{{ event.dynasty }} · {{ event.yearCE }} CE</p>
    <p class="mt-4 text-sm text-ink/60">{{ t('journal.todayQuestion') }}</p>
    <h3 class="text-xl mt-1">{{ event.title[locale] }}</h3>
    <p class="mt-3 leading-relaxed">{{ event.scenario[locale] }}</p>

    <div class="mt-6 flex flex-col gap-3">
      <button
        v-for="c in event.choices"
        :key="c.id"
        :disabled="!!chosen"
        :class="[
          'p-4 border rounded text-left',
          chosen === c.id ? 'border-seal bg-seal/10' : 'border-ink/20 hover:border-accent',
          chosen && chosen !== c.id ? 'opacity-40' : '',
        ]"
        @click="decide(c.id)"
      >
        {{ c.label[locale] }}
      </button>
    </div>

    <p v-if="chosen" class="mt-4 text-sm text-seal">{{ loading ? t('fork.generating') : t('journal.sealed') }}</p>

    <div v-if="advice" class="mt-6">
      <p class="text-sm text-ink/60">{{ t('journal.adviceTitle') }}</p>
      <ConfidantAdvice :advice="advice" class="mt-2" />
    </div>

    <div v-if="narration" class="mt-6">
      <p class="text-sm text-ink/60">{{ t('journal.entryTitle') }}</p>
      <p class="mt-2 leading-relaxed whitespace-pre-line">{{ narration[locale] }}</p>
    </div>

    <div v-if="existing && !chosen" class="mt-6">
      <p class="text-sm text-ink/60">{{ t('journal.entryTitle') }}</p>
      <p class="mt-2 leading-relaxed whitespace-pre-line">{{ existing.narration[locale] }}</p>
    </div>
  </section>
</template>
