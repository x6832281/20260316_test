<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
  <main class="min-h-screen flex flex-col items-center justify-center px-6">
    <h1 class="text-3xl md:text-4xl text-center">{{ t('app.title') }}</h1>
    <p class="mt-4 text-center text-ink/70">{{ t('app.tagline') }}</p>
  </main>
</template>
