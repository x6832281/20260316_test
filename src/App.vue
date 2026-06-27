<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import DailyFork from './components/DailyFork.vue'
import FateCard from './components/FateCard.vue'
import GroupResult from './components/GroupResult.vue'
import type { FateCard } from './lib/types'
import { useDailyEvent } from './composables/useDailyEvent'

const { t, locale } = useI18n()
const { event } = useDailyEvent()
const card = ref<FateCard | null>(null)
const showResult = ref(false)

function toggleLocale() {
  locale.value = locale.value === 'zh' ? 'en' : 'zh'
}
</script>

<template>
  <div class="min-h-screen flex flex-col items-center px-6 py-10">
    <header class="w-full max-w-xl flex justify-between items-center mb-8">
      <h1 class="text-xl">{{ t('app.title') }}</h1>
      <button class="text-sm underline" @click="toggleLocale">{{ t('nav.lang') }}</button>
    </header>

    <DailyFork @card="c => (card = c)" />

    <FateCard v-if="card" :card="card" class="mt-8" />
    <button v-if="card" class="mt-4 text-sm underline" @click="showResult = true">
      {{ locale === 'zh' ? '看看世人如何抉择' : 'See how the world chose' }}
    </button>
    <GroupResult v-if="showResult" :event-id="event.id" class="mt-6" />
  </div>
</template>
