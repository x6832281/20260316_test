<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { FateCard } from '../lib/types'
import { submitChoice } from '../aggregate/client'
import { getDeviceId } from '../lib/deviceId'
import { generateFateCard } from '../ai/fateCard'
import { useDailyEvent } from '../composables/useDailyEvent'

const { t, locale } = useI18n()
const { event } = useDailyEvent()

const lockedChoice = ref<string | null>(null)
const loading = ref(false)
const error = ref(false)
const card = ref<FateCard | null>(null)
const emit = defineEmits<{ (e: 'card', card: FateCard): void }>()

async function choose(choiceId: string) {
  if (lockedChoice.value || loading.value) return
  loading.value = true
  error.value = false
  try {
    await submitChoice(event.value.id, choiceId, getDeviceId())
    const c = await generateFateCard(event.value, choiceId, locale.value as 'zh' | 'en')
    card.value = c
    emit('card', c)
    lockedChoice.value = choiceId
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="w-full max-w-xl">
    <p class="text-sm text-ink/60">{{ event.dynasty }} · {{ event.yearCE }} CE</p>
    <h2 class="mt-1 text-2xl">{{ event.title[locale] }}</h2>
    <p class="mt-4 leading-relaxed">{{ event.scenario[locale] }}</p>

    <div class="mt-6 flex flex-col gap-3">
      <button
        v-for="c in event.choices"
        :key="c.id"
        :disabled="!!lockedChoice"
        :class="[
          'p-4 border rounded text-left transition',
          lockedChoice === c.id ? 'border-seal bg-seal/10' : 'border-ink/20 hover:border-accent',
          lockedChoice && lockedChoice !== c.id ? 'opacity-40' : '',
        ]"
        @click="choose(c.id)"
      >
        {{ c.label[locale] }}
      </button>
    </div>

    <p v-if="loading" class="mt-4 text-sm text-seal">{{ t('fork.generating') }}</p>
    <p v-else-if="lockedChoice" class="mt-4 text-sm text-seal">{{ t('fork.locked') }}</p>
    <p v-else-if="error" class="mt-4 text-sm text-seal">{{ t('fork.error') }}</p>
  </section>
</template>
