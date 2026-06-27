<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import DailyFork from './components/DailyFork.vue'
import FateCard from './components/FateCard.vue'
import GroupResult from './components/GroupResult.vue'
import PersonaCreate from './components/PersonaCreate.vue'
import DestinyJournal from './components/DestinyJournal.vue'
import type { FateCard as FateCardType } from './lib/types'
import { useDailyEvent } from './composables/useDailyEvent'
import { hasPersona } from './store/persona'

const { t, locale } = useI18n()
const { event } = useDailyEvent()
const card = ref<FateCardType | null>(null)
const showResult = ref(false)
const view = ref<'today' | 'life'>('today')
const personaExists = ref(hasPersona())

function toggleLocale() {
  locale.value = locale.value === 'zh' ? 'en' : 'zh'
}
function onPersonaCreated() {
  personaExists.value = true
  view.value = 'today'
}
</script>

<template>
  <div class="min-h-screen flex flex-col items-center px-6 py-10">
    <header class="w-full max-w-xl flex justify-between items-center mb-8">
      <h1 class="text-xl">{{ t('app.title') }}</h1>
      <nav class="flex gap-4 text-sm">
        <button :class="view==='today' ? 'underline' : 'text-ink/50'" @click="view='today'">{{ t('nav.recall') }}</button>
        <button :class="view==='life' ? 'underline' : 'text-ink/50'" @click="view='life'">{{ t('nav.depth') }}</button>
        <button class="underline" @click="toggleLocale">{{ t('nav.lang') }}</button>
      </nav>
    </header>

    <template v-if="view==='today'">
      <DailyFork @card="c => (card = c)" />
      <FateCard v-if="card" :card="card" class="mt-8" />
      <button v-if="card" class="mt-4 text-sm underline" @click="showResult = true">
        {{ locale === 'zh' ? '看看世人如何抉择' : 'See how the world chose' }}
      </button>
      <GroupResult v-if="showResult" :event-id="event.id" class="mt-6" />
    </template>

    <template v-else>
      <PersonaCreate v-if="!personaExists" @created="onPersonaCreated" />
      <DestinyJournal v-else />
    </template>
  </div>
</template>
