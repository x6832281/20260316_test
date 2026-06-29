<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { fetchGroupResult } from '../aggregate/client'
import { getEventById } from '../data/events'
import type { GroupResult } from '../lib/types'

const props = defineProps<{ eventId: string }>()
const { t, locale } = useI18n()

const result = ref<GroupResult | null>(null)
const error = ref(false)
const event = computed(() => getEventById(props.eventId))

onMounted(async () => {
  try {
    result.value = await fetchGroupResult(props.eventId)
  } catch {
    error.value = true
  }
})

const hasData = computed(() => !!result.value && result.value.total > 0)
</script>

<template>
  <section class="w-full max-w-xl">
    <h3 class="text-lg">{{ t('group.title') }}</h3>
    <p v-if="error || !hasData" class="mt-2 text-sm text-ink/60">{{ t('group.pending') }}</p>
    <div v-else class="mt-4 flex flex-col gap-3">
      <div v-for="c in event?.choices" :key="c.id" class="border border-ink/20 rounded p-3">
        <div class="flex justify-between text-sm">
          <span>{{ c.label[locale] }}</span>
          <span>{{ t('group.pct', { p: result!.total ? Math.round((result!.counts[c.id] || 0) / result!.total * 100) : 0 }) }}</span>
        </div>
        <div class="mt-2 h-2 bg-ink/10 rounded">
          <div class="h-2 bg-accent rounded" :style="{ width: (result!.total ? (result!.counts[c.id] || 0) / result!.total * 100 : 0) + '%' }" />
        </div>
      </div>
      <p class="text-xs text-ink/50">{{ t('group.total', { n: result!.total }) }}</p>
    </div>
  </section>
</template>
