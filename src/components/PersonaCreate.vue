<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { createPersona } from '../store/persona'
import type { ConfidantArchetype } from '../lib/types'

const { t } = useI18n()
const emit = defineEmits<{ (e: 'created'): void }>()

const form = reactive({
  name: '', birthplaceZh: '洛阳', birthplaceEn: 'Luoyang',
  backgroundZh: '殷实商贾', backgroundEn: 'Prosperous merchant',
  confidant: 'strategist' as ConfidantArchetype,
})
const archetypes: ConfidantArchetype[] = ['hermit', 'historian', 'poet', 'strategist', 'monk']

function submit() {
  if (!form.name.trim()) return
  createPersona({
    name: form.name.trim(),
    birthYearCE: 735,
    birthplace: { zh: form.birthplaceZh, en: form.birthplaceEn },
    background: { zh: form.backgroundZh, en: form.backgroundEn },
    confidant: form.confidant,
  })
  emit('created')
}
</script>

<template>
  <section class="w-full max-w-xl">
    <h2 class="text-2xl">{{ t('persona.createTitle') }}</h2>
    <div class="mt-6 flex flex-col gap-4">
      <label class="flex flex-col gap-1">
        <span class="text-sm text-ink/60">{{ t('persona.nameLabel') }}</span>
        <input v-model="form.name" class="border border-ink/30 rounded p-2 bg-paper" />
      </label>
      <label class="flex flex-col gap-1">
        <span class="text-sm text-ink/60">{{ t('persona.confidantLabel') }}</span>
        <select v-model="form.confidant" class="border border-ink/30 rounded p-2 bg-paper">
          <option v-for="a in archetypes" :key="a" :value="a">{{ t(`persona.${a}`) }}</option>
        </select>
      </label>
      <button class="mt-2 p-3 bg-accent text-white rounded" @click="submit">{{ t('persona.create') }}</button>
    </div>
  </section>
</template>
