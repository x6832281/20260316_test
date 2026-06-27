<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { FateCard } from '../lib/types'

const props = defineProps<{ card: FateCard }>()
const { t, locale } = useI18n()
const copied = ref(false)

async function share() {
  const text = `${props.card.outcome[locale.value]}\n\n— ${props.card.footnote[locale.value]}`
  if (navigator.share) {
    try { await navigator.share({ text }) } catch {}
  } else {
    await navigator.clipboard.writeText(text)
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
  }
}
</script>

<template>
  <article class="w-full max-w-xl border border-ink/30 rounded p-6 bg-paper shadow-sm">
    <h3 class="text-sm text-ink/60">{{ t('card.title') }}</h3>
    <p class="mt-3 text-lg leading-relaxed">{{ card.outcome[locale] }}</p>
    <p class="mt-4 text-xs text-ink/50 border-t border-ink/10 pt-3">{{ t('card.footnote') }}: {{ card.footnote[locale] }}</p>
    <button class="mt-4 text-sm underline text-accent" @click="share">
      {{ copied ? t('card.copied') : t('card.share') }}
    </button>
  </article>
</template>
