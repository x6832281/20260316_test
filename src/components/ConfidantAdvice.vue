<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { LocalizedText } from '../lib/types'

defineProps<{ advice: LocalizedText }>()
const { locale } = useI18n()
</script>

<template>
  <blockquote class="border-l-2 border-seal pl-4 italic text-ink/80">
    {{ advice[locale] }}
  </blockquote>
</template>
