# Your Ancient Life v4 — MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the dual-layer MVP — a daily global historical fork (recall layer) whose same question also writes into the user's private Tang-dynasty life with an AI confidant (depth layer), bilingual zh/en.

**Architecture:** Vite + Vue 3 + TS + Tailwind + vue-i18n single-page app, local storage for private life, a single Cloudflare Worker + KV for global aggregate counts only. One shared historical event library feeds both layers. AI (OpenAI-compatible) drives fate-card generation, confidant advice, and private narration; pure logic (event selection, aggregation math, prompt building, response parsing) is unit-tested with Vitest.

**Tech Stack:** Vite 6, Vue 3 (`<script setup>` + TS), Tailwind CSS, vue-i18n, Vitest, Cloudflare Workers + KV, OpenAI-compatible chat API.

## Global Constraints

- Bilingual zh/en structure reserved in ALL user-facing copy. Chinese 古雅, English literary (no thou/thee).
- Static hosting, relative paths: `base: './'` in Vite config.
- No UGC, no real-time multiplayer, no account system (anonymous device id only).
- Local storage (LocalStorage/IndexedDB) holds private life; the only backend is the aggregate-count Worker.
- Event library is the source of truth; AI generation is constrained to "must fit year X, no inventing major historical facts."
- First dynasty = Tang 天宝年间 (742–756 CE).
- Daily event selection is deterministic by date (UTC date), so the whole world sees the same fork.
- Tests run via `npm test` (Vitest). No linter.
- Commit after each task; commit messages follow `feat:`/`fix:`/`chore:`/`docs:`/`test:` convention.

---

## File Structure

```
package.json                         # modify: add deps + scripts
vite.config.ts                       # replace vite.config.mjs
tsconfig.json                        # new
tsconfig.node.json                   # new
vitest.config.ts                     # new
index.html                           # rewrite: mount #app
postcss.config.cjs                   # new (tailwind)
tailwind.config.cjs                  # new
src/main.ts                          # Vue app entry
src/App.vue                          # shell: nav + <router-view>-like view switch
src/styles/main.css                  # tailwind directives + tokens
src/i18n/index.ts                    # vue-i18n setup
src/i18n/locales/zh.ts               # zh strings
src/i18n/locales/en.ts               # en strings
src/lib/types.ts                     # shared TS types
src/lib/deviceId.ts                  # stable anonymous device id
src/data/events/tang-tianbao.ts      # 天宝年间 event library
src/data/events/index.ts             # getDailyEvent(date) + types
src/store/persona.ts                 # 分身 state + localStorage
src/store/destiny.ts                 # 私人人生日记/卷轴 state + localStorage
src/aggregate/client.ts              # submitChoice / fetchGroupResult
src/ai/client.ts                     # injectable OpenAI-compatible chat call
src/ai/prompts.ts                    # prompt builders (pure)
src/ai/fateCard.ts                   # AI → fate card (pure parse + inject)
src/ai/confidant.ts                  # confidant one-line advice
src/ai/narration.ts                  # private fate narration → journal entry
src/components/DailyFork.vue         # recall layer: 三选一
src/components/FateCard.vue          # 命运卡 + 分享
src/components/GroupResult.vue       # 群体揭晓
src/components/PersonaCreate.vue     # 分身生成
src/components/ConfidantAdvice.vue   # 知己参谋
src/components/DestinyJournal.vue    # 分身日记
src/composables/useDailyEvent.ts     # load today's event
src/composables/useLocale.ts         # locale toggle
workers/aggregate/wrangler.toml      # CF Worker config
workers/aggregate/src/index.ts       # Worker: count choices in KV
tests/data/events.test.ts
tests/store/persona.test.ts
tests/ai/fateCard.test.ts
tests/ai/prompts.test.ts
tests/aggregate/client.test.ts
tests/ai/confidant.test.ts
tests/ai/narration.test.ts
```

---

## Task 1: Scaffold Vue 3 + TS + Vite + Tailwind + vue-i18n + Vitest

Migrate the repo from vanilla JS to the target stack. Existing `script.js`/`styles.css`/`index.html` are replaced; the old search feature is dropped (it is not part of the forward product).

**Files:**
- Modify: `package.json`
- Create: `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `vitest.config.ts`, `postcss.config.cjs`, `tailwind.config.cjs`, `src/main.ts`, `src/App.vue`, `src/styles/main.css`, `index.html`
- Delete: `vite.config.mjs`, `script.js`, `styles.css`

**Interfaces:**
- Produces: a running `npm run dev` showing a Vue app with the title "你的古代人生 / Your Ancient Life", and a working `npm test` (Vitest, 0 tests passing).

- [ ] **Step 1: Rewrite `package.json`**

```json
{
  "name": "your-ancient-life",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc --noEmit && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "vue": "^3.4.0",
    "vue-i18n": "^9.13.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.0",
    "@vue/test-utils": "^2.4.0",
    "autoprefixer": "^10.4.0",
    "jsdom": "^24.0.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.4.0",
    "vite": "^6.0.0",
    "vitest": "^1.6.0",
    "vue-tsc": "^2.0.0"
  }
}
```

- [ ] **Step 2: Create `vite.config.ts`**

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  root: '.',
  base: './',
  plugins: [vue()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
```

- [ ] **Step 3: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "preserve",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "lib": ["ESNext", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "noEmit": true,
    "types": ["vitest/globals"]
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- [ ] **Step 4: Create `tsconfig.node.json`**

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts", "vitest.config.ts"]
}
```

- [ ] **Step 5: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
```

- [ ] **Step 6: Create `tailwind.config.cjs`**

```cjs
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,ts}'],
  theme: {
    extend: {
      colors: {
        ink: '#1a1a1a',
        paper: '#f5f1e8',
        accent: '#37A',
        seal: '#9a2a2a',
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 7: Create `postcss.config.cjs`**

```cjs
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 8: Create `src/styles/main.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color-scheme: light;
}

body {
  @apply bg-paper text-ink font-serif;
}
```

- [ ] **Step 9: Create `src/App.vue`**

```vue
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
```

- [ ] **Step 10: Create `src/i18n/index.ts`**

```ts
import { createI18n } from 'vue-i18n'
import zh from './locales/zh'
import en from './locales/en'

export const i18n = createI18n({
  legacy: false,
  locale: 'zh',
  fallbackLocale: 'en',
  messages: { zh, en },
})
```

- [ ] **Step 11: Create `src/i18n/locales/zh.ts`**

```ts
export default {
  app: { title: '你的古代人生', tagline: '每天,全人类一起走进中国历史的同一个岔路口。' },
}
```

- [ ] **Step 12: Create `src/i18n/locales/en.ts`**

```ts
export default {
  app: { title: 'Your Ancient Life', tagline: 'Every day, the world steps into the same fork of Chinese history.' },
}
```

- [ ] **Step 13: Create `src/main.ts`**

```ts
import { createApp } from 'vue'
import App from './App.vue'
import { i18n } from './i18n'
import './styles/main.css'

createApp(App).use(i18n).mount('#app')
```

- [ ] **Step 14: Create `src/env.d.ts`** (so TS understands `.vue` imports)

```ts
/// <reference types="vite/client" />
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
```

- [ ] **Step 15: Rewrite `index.html`**

```html
<!DOCTYPE html>
<html lang="zh">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>你的古代人生 / Your Ancient Life</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

- [ ] **Step 16: Delete old files**

```bash
rm vite.config.mjs script.js styles.css
```

- [ ] **Step 17: Install and verify dev server**

```bash
npm install
npm run dev
```
Expected: Vite dev server starts; browser shows the title and tagline.

- [ ] **Step 18: Verify test runner**

```bash
npm test
```
Expected: Vitest runs, 0 tests, exit 0.

- [ ] **Step 19: Commit**

```bash
git add -A
git commit -m "chore: scaffold Vue3+TS+Tailwind+i18n+Vitest, drop search-page"
```

---

## Task 2: Shared types and anonymous device id

**Files:**
- Create: `src/lib/types.ts`, `src/lib/deviceId.ts`
- Test: `tests/lib/deviceId.test.ts`

**Interfaces:**
- Produces: types `HistoricalEvent`, `EventChoice`, `Choice`, `Persona`, `JournalEntry`, `FateCard`, `GroupResult`, `ConfidantArchetype`; function `getDeviceId(): string`.

- [ ] **Step 1: Create `src/lib/types.ts`**

```ts
export type Locale = 'zh' | 'en'

export type ConfidantArchetype = 'hermit' | 'historian' | 'poet' | 'strategist' | 'monk'

export interface LocalizedText {
  zh: string
  en: string
}

export interface EventChoice {
  id: string
  label: LocalizedText
}

export interface HistoricalEvent {
  id: string
  /** ISO date the event is scheduled for, e.g. "2026-06-28". Determines global same-day fork. */
  date: string
  yearCE: number
  dynasty: string
  title: LocalizedText
  scenario: LocalizedText
  choices: [EventChoice, EventChoice, EventChoice]
  footnote: LocalizedText
}

export type ChoiceId = string

export interface Persona {
  id: string
  name: string
  birthYearCE: number
  birthplace: LocalizedText
  background: LocalizedText
  confidant: ConfidantArchetype
  createdAt: string
}

export interface JournalEntry {
  id: string
  date: string
  eventId: string
  choiceId: ChoiceId
  narration: LocalizedText
  confidantAdvice: LocalizedText
  createdAt: string
}

export interface FateCard {
  eventId: string
  choiceId: ChoiceId
  outcome: LocalizedText
  footnote: LocalizedText
}

export interface GroupResult {
  eventId: string
  counts: Record<ChoiceId, number>
  total: number
  survivalByChoice: Record<ChoiceId, number>
}
```

- [ ] **Step 2: Write failing test `tests/lib/deviceId.test.ts`**

```ts
import { describe, it, expect, beforeEach } from 'vitest'
import { getDeviceId } from '../../src/lib/deviceId'

describe('getDeviceId', () => {
  beforeEach(() => localStorage.clear())

  it('returns a stable id across calls', () => {
    const a = getDeviceId()
    const b = getDeviceId()
    expect(a).toBeTruthy()
    expect(a).toBe(b)
  })

  it('persists in localStorage', () => {
    const id = getDeviceId()
    expect(localStorage.getItem('yal.deviceId')).toBe(id)
  })
})
```

- [ ] **Step 3: Run test to verify it fails**

```bash
npm test -- tests/lib/deviceId.test.ts
```
Expected: FAIL — module not found.

- [ ] **Step 4: Create `src/lib/deviceId.ts`**

```ts
const KEY = 'yal.deviceId'

export function getDeviceId(): string {
  let id = localStorage.getItem(KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(KEY, id)
  }
  return id
}
```

- [ ] **Step 5: Run test to verify it passes**

```bash
npm test -- tests/lib/deviceId.test.ts
```
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib tests/lib
git commit -m "feat: shared types and stable anonymous device id"
```

---

## Task 3: Historical event library — Tang 天宝年间

**Files:**
- Create: `src/data/events/tang-tianbao.ts`, `src/data/events/index.ts`
- Test: `tests/data/events.test.ts`

**Interfaces:**
- Produces: `EVENTS: HistoricalEvent[]`, `getDailyEvent(date: string): HistoricalEvent`, `getEventById(id: string): HistoricalEvent | undefined`.

- [ ] **Step 1: Create `src/data/events/tang-tianbao.ts`**

```ts
import type { HistoricalEvent } from '../../lib/types'

export const TANG_TIANBAO_EVENTS: HistoricalEvent[] = [
  {
    id: 'fan-yang-755',
    date: '2026-06-28',
    yearCE: 755,
    dynasty: '唐 · 天宝十四载',
    title: { zh: '范阳鼙鼓', en: 'Drums at Fanyang' },
    scenario: {
      zh: '天宝十四载冬,范阳节度使安禄山起兵。你是洛阳一户殷实人家的当家人,消息传来,城中已有人开始南逃。三日内,你必须定夺。',
      en: 'Winter, 755 CE. An Lushan, military governor of Fanyang, has raised his banner. You are the head of a prosperous Luoyang household. Rumors fly; some are already fleeing south. You have three days to decide.',
    },
    choices: [
      { id: 'flee-south', label: { zh: '举家南逃江淮', en: 'Flee south with your household to Jianghuai' } },
      { id: 'stay-luoyang', label: { zh: '据守洛阳祖宅', en: 'Hold your ancestral home in Luoyang' } },
      { id: 'join-loyalist', label: { zh: '投军平叛', en: 'Join the imperial army to suppress the rebellion' } },
    ],
    footnote: {
      zh: '安史之乱(755–763)使中原人口锐减,洛阳两度陷落。',
      en: 'The An Lushan Rebellion (755–763) devastated the Central Plains; Luoyang fell twice.',
    },
  },
  {
    id: 'mawei-756',
    date: '2026-06-29',
    yearCE: 756,
    dynasty: '唐 · 至德元载',
    title: { zh: '马嵬之变', en: 'The Incident at Mawei' },
    scenario: {
      zh: '至德元载,玄宗西幸至马嵬驿,六军不发,请诛杨国忠与贵妃。你是一名随驾禁军小校,被同袍推作代表上前陈情。',
      en: '756 CE. Emperor Xuanzong’s flight halts at Mawei Station. The guards refuse to march, demanding the lives of Yang Guozhong and the imperial consort. You are a junior officer, pushed forward by your comrades to speak.',
    },
    choices: [
      { id: 'speak-for-guards', label: { zh: '陈请诛杨', en: 'Voice the guards’ demand' } },
      { id: 'shield-consort', label: { zh: '护驾贵妃', en: 'Shield the consort' } },
      { id: 'stay-silent', label: { zh: '缄默退后', en: 'Stay silent, step back' } },
    ],
    footnote: {
      zh: '马嵬之变中杨贵妃赐死,玄宗入蜀,太子北上灵武即位。',
      en: 'At Mawei, Consort Yang was ordered to die; Xuanzong fled to Shu while the crown prince marched north to Lingwu and took the throne.',
    },
  },
  {
    id: 'shu-scholar-753',
    date: '2026-06-30',
    yearCE: 753,
    dynasty: '唐 · 天宝十二载',
    title: { zh: '蜀中征辟', en: 'A Summons in Shu' },
    scenario: {
      zh: '天宝十二载,剑南节度使征辟你为幕府掌书记。同期,长安李林甫当国,株连之风甚烈。',
      en: '753 CE. The military governor of Jiannan offers you the post of secretary in his staff. In Chang’an, the chancellor Li Linfu’s purges are at their cruelest.',
    },
    choices: [
      { id: 'accept-shu', label: { zh: '赴蜀就任', en: 'Accept, go to Shu' } },
      { id: 'decline-changan', label: { zh: '婉拒,留待长安', en: 'Decline, bide your time in Chang’an' } },
      { id: 'retire-mountain', label: { zh: '辞官归隐山林', en: 'Refuse and retire to the mountains' } },
    ],
    footnote: {
      zh: '天宝末年党争激烈,入幕与归隐皆为士人常见出路。',
      en: 'In the late Tianbao era, factional strife made both staff posts and mountain retirement common paths for scholars.',
    },
  },
]
```

- [ ] **Step 2: Create `src/data/events/index.ts`**

```ts
import type { HistoricalEvent } from '../../lib/types'
import { TANG_TIANBAO_EVENTS } from './tang-tianbao'

export const EVENTS: HistoricalEvent[] = [...TANG_TIANBAO_EVENTS]

/** Returns the event whose `date` matches `yyyymmdd` (YYYY-MM-DD). If none, falls back to a stable hash of the date so the world always sees one fork. */
export function getDailyEvent(date: string): HistoricalEvent {
  const exact = EVENTS.find((e) => e.date === date)
  if (exact) return exact
  // Stable fallback: pick by hash so the whole world shares one fork for any date.
  const idx = hashDate(date) % EVENTS.length
  return EVENTS[idx]
}

export function getEventById(id: string): HistoricalEvent | undefined {
  return EVENTS.find((e) => e.id === id)
}

function hashDate(date: string): number {
  let h = 0
  for (let i = 0; i < date.length; i++) {
    h = (h * 31 + date.charCodeAt(i)) >>> 0
  }
  return h
}
```

- [ ] **Step 3: Write test `tests/data/events.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { EVENTS, getDailyEvent, getEventById } from '../../src/data/events'

describe('event library', () => {
  it('returns the exact event for a scheduled date', () => {
    expect(getDailyEvent('2026-06-28').id).toBe('fan-yang-755')
  })

  it('returns a stable fallback for an unscheduled date', () => {
    const a = getDailyEvent('2030-01-01')
    const b = getDailyEvent('2030-01-01')
    expect(a.id).toBe(b.id)
    expect(EVENTS.map((e) => e.id)).toContain(a.id)
  })

  it('getEventById finds and misses', () => {
    expect(getEventById('mawei-756')?.yearCE).toBe(756)
    expect(getEventById('nope')).toBeUndefined()
  })

  it('every event has exactly 3 choices', () => {
    for (const e of EVENTS) expect(e.choices).toHaveLength(3)
  })
})
```

- [ ] **Step 4: Run tests**

```bash
npm test -- tests/data/events.test.ts
```
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/data tests/data
git commit -m "feat: Tang Tianbao event library with deterministic daily selection"
```

---

## Task 4: Aggregate Worker (Cloudflare Workers + KV) — counts only

**Files:**
- Create: `workers/aggregate/wrangler.toml`, `workers/aggregate/src/index.ts`
- Create: `src/aggregate/client.ts`
- Test: `tests/aggregate/client.test.ts`

**Interfaces:**
- Produces: Worker routes `POST /choice` (body `{eventId, choiceId, deviceId}`) → `{ok:true}`, and `GET /result?eventId=...` → `GroupResult` (without survival — survival is enriched client-side or by AI; here counts only). Client functions `submitChoice(eventId, choiceId, deviceId)`, `fetchGroupResult(eventId): Promise<GroupResult>`. For tests, the client takes an injectable `fetch` so no network is needed.

- [ ] **Step 1: Create `workers/aggregate/wrangler.toml`**

```toml
name = "yal-aggregate"
main = "src/index.ts"
compatibility_date = "2024-09-01"

[[kv_namespaces]]
binding = "COUNTS"
id = "REPLACE_WITH_KV_ID"
```

- [ ] **Step 2: Create `workers/aggregate/src/index.ts`**

```ts
export interface Env {
  COUNTS: KVNamespace
}

interface ChoiceBody {
  eventId: string
  choiceId: string
  deviceId: string
}

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  })
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    if (req.method === 'OPTIONS') return new Response(null, { headers: CORS })

    const url = new URL(req.url)

    if (req.method === 'POST' && url.pathname === '/choice') {
      const body = (await req.json()) as ChoiceBody
      if (!body.eventId || !body.choiceId || !body.deviceId) {
        return json({ ok: false, error: 'missing fields' }, 400)
      }
      // One counted choice per device per event: store the chosen id under a device key.
      const deviceKey = `dev:${body.eventId}:${body.deviceId}`
      const prior = await env.COUNTS.get(deviceKey)
      if (prior && prior === body.choiceId) {
        return json({ ok: true, deduped: true })
      }
      // Decrement prior count if the device switched (rare; irreversibility is enforced client-side).
      if (prior) {
        const oldCount = parseInt((await env.COUNTS.get(`cnt:${body.eventId}:${prior}`)) || '0', 10)
        await env.COUNTS.put(`cnt:${body.eventId}:${prior}`, String(Math.max(0, oldCount - 1)))
      }
      const newCount = parseInt((await env.COUNTS.get(`cnt:${body.eventId}:${body.choiceId}`)) || '0', 10) + 1
      await env.COUNTS.put(`cnt:${body.eventId}:${body.choiceId}`, String(newCount))
      await env.COUNTS.put(deviceKey, body.choiceId)
      return json({ ok: true })
    }

    if (req.method === 'GET' && url.pathname === '/result') {
      const eventId = url.searchParams.get('eventId')
      if (!eventId) return json({ ok: false, error: 'missing eventId' }, 400)
      const list = await env.COUNTS.list({ prefix: `cnt:${eventId}:` })
      const counts: Record<string, number> = {}
      let total = 0
      for (const k of list.keys) {
        const choiceId = k.name.split(':')[2]
        const v = parseInt((await env.COUNTS.get(k.name)) || '0', 10)
        counts[choiceId] = v
        total += v
      }
      return json({ eventId, counts, total, survivalByChoice: {} })
    }

    return json({ ok: false, error: 'not found' }, 404)
  },
}
```

- [ ] **Step 3: Write failing test `tests/aggregate/client.test.ts`**

```ts
import { describe, it, expect, vi } from 'vitest'
import { submitChoice, fetchGroupResult, AGGREGATE_BASE } from '../../src/aggregate/client'

describe('aggregate client', () => {
  it('submitChoice posts to /choice with the right body', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }))
    await submitChoice('fan-yang-755', 'flee-south', 'dev-1', fetchMock)
    expect(fetchMock).toHaveBeenCalledWith(
      `${AGGREGATE_BASE}/choice`,
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }),
    )
    const callBody = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(callBody).toEqual({ eventId: 'fan-yang-755', choiceId: 'flee-south', deviceId: 'dev-1' })
  })

  it('fetchGroupResult returns parsed GroupResult', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ eventId: 'e1', counts: { a: 3, b: 1 }, total: 4, survivalByChoice: {} }), { status: 200 }),
    )
    const r = await fetchGroupResult('e1', fetchMock)
    expect(r.total).toBe(4)
    expect(r.counts.a).toBe(3)
  })
})
```

- [ ] **Step 4: Run test to verify it fails**

```bash
npm test -- tests/aggregate/client.test.ts
```
Expected: FAIL — module not found.

- [ ] **Step 5: Create `src/aggregate/client.ts`**

```ts
import type { GroupResult } from '../lib/types'

export const AGGREGATE_BASE =
  (import.meta as any).env?.VITE_AGGREGATE_URL || 'https://yal-aggregate.workers.dev'

async function defaultFetch(input: string, init?: RequestInit): Promise<Response> {
  return fetch(input, init)
}

export async function submitChoice(
  eventId: string,
  choiceId: string,
  deviceId: string,
  fetchFn: (input: string, init?: RequestInit) => Promise<Response> = defaultFetch,
): Promise<{ ok: boolean }> {
  const res = await fetchFn(`${AGGREGATE_BASE}/choice`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ eventId, choiceId, deviceId }),
  })
  return res.json()
}

export async function fetchGroupResult(
  eventId: string,
  fetchFn: (input: string, init?: RequestInit) => Promise<Response> = defaultFetch,
): Promise<GroupResult> {
  const res = await fetchFn(`${AGGREGATE_BASE}/result?eventId=${encodeURIComponent(eventId)}`)
  return res.json()
}
```

- [ ] **Step 6: Run test to verify it passes**

```bash
npm test -- tests/aggregate/client.test.ts
```
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add workers src/aggregate tests/aggregate
git commit -m "feat: aggregate-count Worker (KV) and injectable client"
```

---

## Task 5: AI client + prompt builders (pure, injectable)

**Files:**
- Create: `src/ai/client.ts`, `src/ai/prompts.ts`
- Test: `tests/ai/prompts.test.ts`

**Interfaces:**
- Produces: `chat(messages, opts?)` — OpenAI-compatible call, takes injectable fetch + model + apiKey from env. Pure builders: `buildFateCardPrompt(event, choiceId, locale)`, `buildConfidantPrompt(event, choiceId, archetype, persona, locale)`, `buildNarrationPrompt(event, choiceId, persona, locale)`. All return `{ system: string, user: string }`.

- [ ] **Step 1: Create `src/ai/client.ts`**

```ts
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface ChatOptions {
  model?: string
  apiKey?: string
  baseUrl?: string
  fetchFn?: (input: string, init?: RequestInit) => Promise<Response>
  temperature?: number
}

const DEFAULT_MODEL = 'gpt-4o-mini'
const DEFAULT_BASE = 'https://api.openai.com/v1'

export async function chat(messages: ChatMessage[], opts: ChatOptions = {}): Promise<string> {
  const apiKey = opts.apiKey || (import.meta as any).env?.VITE_OPENAI_API_KEY || ''
  const baseUrl = opts.baseUrl || (import.meta as any).env?.VITE_OPENAI_BASE_URL || DEFAULT_BASE
  const fetchFn = opts.fetchFn || fetch
  const res = await fetchFn(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: opts.model || DEFAULT_MODEL,
      temperature: opts.temperature ?? 0.8,
      messages,
    }),
  })
  if (!res.ok) throw new Error(`chat failed: ${res.status}`)
  const data = await res.json()
  return data.choices[0].message.content
}
```

- [ ] **Step 2: Create `src/ai/prompts.ts`**

```ts
import type { ConfidantArchetype, HistoricalEvent, Locale, LocalizedText, Persona } from '../lib/types'

export interface Prompt {
  system: string
  user: string
}

const ARCHETYPE_NAME: Record<ConfidantArchetype, LocalizedText> = {
  hermit: { zh: '隐士(道)', en: 'The Hermit (Daoist)' },
  historian: { zh: '太史(儒)', en: 'The Historian (Confucian)' },
  poet: { zh: '词客(文)', en: 'The Poet' },
  strategist: { zh: '谋臣(智)', en: 'The Strategist' },
  monk: { zh: '禅师(佛)', en: 'The Zen Monk' },
}

const LANG: Record<Locale, 'zh' | 'en'> = { zh: 'zh', en: 'en' }

const HISTORY_GUARD_ZH =
  '你必须严格符合该年份的真实历史背景,不得虚构重大史实、不得改变已知历史走向。'
const HISTORY_GUARD_EN =
  'You must strictly fit the real historical setting of that year. Do not invent major facts or alter the known course of history.'

function guard(locale: Locale): string {
  return locale === 'zh' ? HISTORY_GUARD_ZH : HISTORY_GUARD_EN
}

export function buildFateCardPrompt(event: HistoricalEvent, choiceId: string, locale: Locale): Prompt {
  const lang = LANG[locale]
  const choice = event.choices.find((c) => c.id === choiceId)
  const system =
    locale === 'zh'
      ? `你是一位古代史叙事师。根据用户的历史抉择,推演其后30–90天的命运,产出一句结局。${guard(locale)}只输出 JSON。`
      : `You are a narrator of ancient history. Given the user's choice, unfold the next 30–90 days of fate into one outcome sentence. ${guard(locale)} Output JSON only.`
  const user = JSON.stringify({
    year: event.yearCE,
    dynasty: event.dynasty,
    scenario: event.scenario[lang],
    choice: choice?.label[lang],
    footnote: event.footnote[lang],
    format: { outcome: `string in ${lang}`, footnote: `string in ${lang}` },
  })
  return { system, user }
}

export function buildConfidantPrompt(
  event: HistoricalEvent,
  choiceId: string,
  archetype: ConfidantArchetype,
  persona: Persona,
  locale: Locale,
): Prompt {
  const lang = LANG[locale]
  const choice = event.choices.find((c) => c.id === choiceId)
  const system =
    locale === 'zh'
      ? `你是用户的AI知己,原型为「${ARCHETYPE_NAME[archetype].zh}」。用一句话给出克制而睿智的参谋,决策权在用户。${guard(locale)}只输出 JSON。`
      : `You are the user's AI confidant, archetype "${ARCHETYPE_NAME[archetype].en}". Offer one restrained, wise sentence of advice; the decision is the user's. ${guard(locale)} Output JSON only.`
  const user = JSON.stringify({
    personaName: persona.name,
    background: persona.background[lang],
    year: event.yearCE,
    scenario: event.scenario[lang],
    contemplatedChoice: choice?.label[lang],
    format: { advice: `string in ${lang}` },
  })
  return { system, user }
}

export function buildNarrationPrompt(
  event: HistoricalEvent,
  choiceId: string,
  persona: Persona,
  locale: Locale,
): Prompt {
  const lang = LANG[locale]
  const choice = event.choices.find((c) => c.id === choiceId)
  const system =
    locale === 'zh'
      ? `你以分身「${persona.name}」的第一人称写一段日记,记录这次抉择与其后3–6月的命运。${guard(locale)}只输出 JSON。`
      : `Write a first-person journal entry as "${persona.name}", recording this choice and the fate of the following 3–6 months. ${guard(locale)} Output JSON only.`
  const user = JSON.stringify({
    personaName: persona.name,
    background: persona.background[lang],
    year: event.yearCE,
    scenario: event.scenario[lang],
    choice: choice?.label[lang],
    format: { narration: `string in ${lang}` },
  })
  return { system, user }
}
```

- [ ] **Step 3: Write test `tests/ai/prompts.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { buildFateCardPrompt, buildConfidantPrompt, buildNarrationPrompt } from '../../src/ai/prompts'
import { EVENTS } from '../../src/data/events'
import type { Persona } from '../../src/lib/types'

const event = EVENTS[0]
const persona: Persona = {
  id: 'p1', name: '李沈', birthYearCE: 735,
  birthplace: { zh: '洛阳', en: 'Luoyang' },
  background: { zh: '殷实商贾之家', en: 'A prosperous merchant house' },
  confidant: 'strategist', createdAt: '2026-06-27',
}

describe('prompt builders', () => {
  it('fate card prompt embeds the chosen label and year, in zh', () => {
    const p = buildFateCardPrompt(event, 'flee-south', 'zh')
    expect(p.system).toContain('古代史叙事师')
    expect(p.user).toContain('755')
    expect(p.user).toContain('举家南逃江淮')
  })

  it('confidant prompt names the archetype in en', () => {
    const p = buildConfidantPrompt(event, 'flee-south', 'strategist', persona, 'en')
    expect(p.system).toContain('Strategist')
    expect(p.user).toContain('Li Shen'.replace('Li Shen', persona.name))
  })

  it('narration prompt is first-person and localized', () => {
    const p = buildNarrationPrompt(event, 'stay-luoyang', persona, 'zh')
    expect(p.system).toContain('第一人称')
    expect(p.user).toContain('据守洛阳祖宅')
  })
})
```

- [ ] **Step 4: Run tests**

```bash
npm test -- tests/ai/prompts.test.ts
```
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/ai tests/ai/prompts.test.ts
git commit -m "feat: injectable AI chat client and pure prompt builders"
```

---

## Task 6: Fate-card generation (AI → typed card)

**Files:**
- Create: `src/ai/fateCard.ts`
- Test: `tests/ai/fateCard.test.ts`

**Interfaces:**
- Consumes: `chat` from `src/ai/client`, `buildFateCardPrompt` from `src/ai/prompts`.
- Produces: `generateFateCard(event, choiceId, locale, opts?) => Promise<FateCard>` and a pure `parseFateCardJSON(raw, event, choiceId): FateCard` used both by the generator and tests.

- [ ] **Step 1: Write failing test `tests/ai/fateCard.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { parseFateCardJSON } from '../../src/ai/fateCard'
import { EVENTS } from '../../src/data/events'

const event = EVENTS[0]

describe('parseFateCardJSON', () => {
  it('parses well-formed JSON', () => {
    const raw = JSON.stringify({ outcome: { zh: '你南渡江淮,家业得存。', en: 'You fled south; your house survived.' }, footnote: { zh: '注', en: 'note' } })
    const card = parseFateCardJSON(raw, event, 'flee-south')
    expect(card.choiceId).toBe('flee-south')
    expect(card.outcome.zh).toContain('南渡')
    expect(card.eventId).toBe(event.id)
  })

  it('tolerates a markdown code fence', () => {
    const raw = '```json\n{"outcome":{"zh":"x","en":"y"},"footnote":{"zh":"f","en":"g"}}\n```'
    const card = parseFateCardJSON(raw, event, 'flee-south')
    expect(card.outcome.en).toBe('y')
  })

  it('throws on unparseable input', () => {
    expect(() => parseFateCardJSON('not json', event, 'flee-south')).toThrow()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- tests/ai/fateCard.test.ts
```
Expected: FAIL — module not found.

- [ ] **Step 3: Create `src/ai/fateCard.ts`**

```ts
import type { FateCard, HistoricalEvent, Locale } from '../lib/types'
import { chat, type ChatOptions } from './client'
import { buildFateCardPrompt } from './prompts'

function stripFence(raw: string): string {
  const m = raw.match(/```(?:json)?\s*([\s\S]*?)```/i)
  return m ? m[1].trim() : raw.trim()
}

export function parseFateCardJSON(raw: string, event: HistoricalEvent, choiceId: string): FateCard {
  const obj = JSON.parse(stripFence(raw))
  if (!obj.outcome || typeof obj.outcome.zh !== 'string' || typeof obj.outcome.en !== 'string') {
    throw new Error('fate card missing outcome')
  }
  return {
    eventId: event.id,
    choiceId,
    outcome: { zh: obj.outcome.zh, en: obj.outcome.en },
    footnote: { zh: obj.footnote?.zh ?? event.footnote.zh, en: obj.footnote?.en ?? event.footnote.en },
  }
}

export async function generateFateCard(
  event: HistoricalEvent,
  choiceId: string,
  locale: Locale,
  opts?: ChatOptions,
): Promise<FateCard> {
  const { system, user } = buildFateCardPrompt(event, choiceId, locale)
  const raw = await chat(
    [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
    opts,
  )
  return parseFateCardJSON(raw, event, choiceId)
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- tests/ai/fateCard.test.ts
```
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/ai/fateCard.ts tests/ai/fateCard.test.ts
git commit -m "feat: AI fate-card generation with tolerant JSON parsing"
```

---

## Task 7: Confidant advice + private narration (AI → typed outputs)

**Files:**
- Create: `src/ai/confidant.ts`, `src/ai/narration.ts`
- Test: `tests/ai/confidant.test.ts`, `tests/ai/narration.test.ts`

**Interfaces:**
- Produces: `getConfidantAdvice(event, choiceId, persona, locale, opts?) => Promise<LocalizedText>` and `narrateJournalEntry(event, choiceId, persona, locale, opts?) => Promise<LocalizedText>`, plus pure parsers `parseAdvice(raw)`, `parseNarration(raw)`.

- [ ] **Step 1: Create `src/ai/confidant.ts`**

```ts
import type { ConfidantArchetype, HistoricalEvent, Locale, LocalizedText, Persona } from '../lib/types'
import { chat, type ChatOptions } from './client'
import { buildConfidantPrompt } from './prompts'

function stripFence(raw: string): string {
  const m = raw.match(/```(?:json)?\s*([\s\S]*?)```/i)
  return m ? m[1].trim() : raw.trim()
}

export function parseAdvice(raw: string): LocalizedText {
  const obj = JSON.parse(stripFence(raw))
  if (!obj.advice || typeof obj.advice.zh !== 'string' || typeof obj.advice.en !== 'string') {
    throw new Error('advice missing fields')
  }
  return { zh: obj.advice.zh, en: obj.advice.en }
}

export async function getConfidantAdvice(
  event: HistoricalEvent,
  choiceId: string,
  persona: Persona,
  locale: Locale,
  opts?: ChatOptions,
): Promise<LocalizedText> {
  const { system, user } = buildConfidantPrompt(event, choiceId, persona.confidant, persona, locale)
  const raw = await chat(
    [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
    opts,
  )
  return parseAdvice(raw)
}
```

- [ ] **Step 2: Create `src/ai/narration.ts`**

```ts
import type { HistoricalEvent, Locale, LocalizedText, Persona } from '../lib/types'
import { chat, type ChatOptions } from './client'
import { buildNarrationPrompt } from './prompts'

function stripFence(raw: string): string {
  const m = raw.match(/```(?:json)?\s*([\s\S]*?)```/i)
  return m ? m[1].trim() : raw.trim()
}

export function parseNarration(raw: string): LocalizedText {
  const obj = JSON.parse(stripFence(raw))
  if (!obj.narration || typeof obj.narration.zh !== 'string' || typeof obj.narration.en !== 'string') {
    throw new Error('narration missing fields')
  }
  return { zh: obj.narration.zh, en: obj.narration.en }
}

export async function narrateJournalEntry(
  event: HistoricalEvent,
  choiceId: string,
  persona: Persona,
  locale: Locale,
  opts?: ChatOptions,
): Promise<LocalizedText> {
  const { system, user } = buildNarrationPrompt(event, choiceId, persona, locale)
  const raw = await chat(
    [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
    opts,
  )
  return parseNarration(raw)
}
```

- [ ] **Step 3: Write test `tests/ai/confidant.test.ts`**

```ts
import { describe, it, expect, vi } from 'vitest'
import { getConfidantAdvice, parseAdvice } from '../../src/ai/confidant'
import { EVENTS } from '../../src/data/events'
import type { Persona } from '../../src/lib/types'

const event = EVENTS[0]
const persona: Persona = {
  id: 'p1', name: '李沈', birthYearCE: 735,
  birthplace: { zh: '洛阳', en: 'Luoyang' },
  background: { zh: '殷实商贾之家', en: 'A prosperous merchant house' },
  confidant: 'strategist', createdAt: '2026-06-27',
}

describe('confidant', () => {
  it('parseAdvice reads both locales', () => {
    const a = parseAdvice(JSON.stringify({ advice: { zh: '避之。', en: 'Avoid him.' } }))
    expect(a.zh).toBe('避之。')
    expect(a.en).toBe('Avoid him.')
  })

  it('getConfidantAdvice calls chat and returns parsed advice', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ choices: [{ message: { content: JSON.stringify({ advice: { zh: '宜避', en: 'Best to avoid' } } }) }] }), { status: 200 }),
    )
    const advice = await getConfidantAdvice(event, 'flee-south', persona, 'zh', {
      apiKey: 'k', fetchFn: fetchMock as any,
    })
    expect(advice.en).toBe('Best to avoid')
    expect(fetchMock).toHaveBeenCalled()
  })
})
```

- [ ] **Step 4: Write test `tests/ai/narration.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { parseNarration } from '../../src/ai/narration'

describe('narration', () => {
  it('parseNarration reads both locales', () => {
    const n = parseNarration(JSON.stringify({ narration: { zh: '余南渡。', en: 'I went south.' } }))
    expect(n.zh).toBe('余南渡。')
    expect(n.en).toBe('I went south.')
  })

  it('throws on missing fields', () => {
    expect(() => parseNarration(JSON.stringify({ narration: { zh: 'x' } }))).toThrow()
  })
})
```

- [ ] **Step 5: Run tests**

```bash
npm test -- tests/ai/confidant.test.ts tests/ai/narration.test.ts
```
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/ai/confidant.ts src/ai/narration.ts tests/ai/confidant.test.ts tests/ai/narration.test.ts
git commit -m "feat: confidant advice and private narration generators"
```

---

## Task 8: Persona store + Destiny store (localStorage)

**Files:**
- Create: `src/store/persona.ts`, `src/store/destiny.ts`
- Test: `tests/store/persona.test.ts`, `tests/store/destiny.test.ts`

**Interfaces:**
- Produces: `createPersona(input)`, `loadPersona()`, `savePersona(p)`, `hasPersona()`. Destiny: `appendJournalEntry(entry)`, `loadJournal()`, `getEntryForEvent(eventId)`.

- [ ] **Step 1: Write failing test `tests/store/persona.test.ts`**

```ts
import { describe, it, expect, beforeEach } from 'vitest'
import { createPersona, loadPersona, hasPersona, savePersona } from '../../src/store/persona'

describe('persona store', () => {
  beforeEach(() => localStorage.clear())

  it('creates and persists a persona', () => {
    const p = createPersona({
      name: '李沈',
      birthYearCE: 735,
      birthplace: { zh: '洛阳', en: 'Luoyang' },
      background: { zh: '商贾', en: 'Merchant' },
      confidant: 'strategist',
    })
    expect(p.id).toBeTruthy()
    expect(hasPersona()).toBe(true)
    expect(loadPersona()?.name).toBe('李沈')
  })

  it('savePersona overwrites', () => {
    const p = createPersona({ name: 'A', birthYearCE: 735, birthplace: { zh: 'x', en: 'y' }, background: { zh: 'x', en: 'y' }, confidant: 'poet' })
    p.name = 'B'
    savePersona(p)
    expect(loadPersona()?.name).toBe('B')
  })
})
```

- [ ] **Step 2: Run to verify fail**

```bash
npm test -- tests/store/persona.test.ts
```
Expected: FAIL — module not found.

- [ ] **Step 3: Create `src/store/persona.ts`**

```ts
import type { ConfidantArchetype, LocalizedText, Persona } from '../lib/types'

const KEY = 'yal.persona'

export interface CreatePersonaInput {
  name: string
  birthYearCE: number
  birthplace: LocalizedText
  background: LocalizedText
  confidant: ConfidantArchetype
}

export function createPersona(input: CreatePersonaInput): Persona {
  const persona: Persona = {
    id: crypto.randomUUID(),
    name: input.name,
    birthYearCE: input.birthYearCE,
    birthplace: input.birthplace,
    background: input.background,
    confidant: input.confidant,
    createdAt: new Date().toISOString(),
  }
  savePersona(persona)
  return persona
}

export function savePersona(persona: Persona): void {
  localStorage.setItem(KEY, JSON.stringify(persona))
}

export function loadPersona(): Persona | null {
  const raw = localStorage.getItem(KEY)
  return raw ? (JSON.parse(raw) as Persona) : null
}

export function hasPersona(): boolean {
  return !!localStorage.getItem(KEY)
}
```

- [ ] **Step 4: Run test to verify pass**

```bash
npm test -- tests/store/persona.test.ts
```
Expected: PASS.

- [ ] **Step 5: Write failing test `tests/store/destiny.test.ts`**

```ts
import { describe, it, expect, beforeEach } from 'vitest'
import { appendJournalEntry, loadJournal, getEntryForEvent } from '../../src/store/destiny'
import type { JournalEntry } from '../../src/lib/types'

function mk(eventId: string, choiceId: string): JournalEntry {
  return {
    id: 'j1', date: '2026-06-28', eventId, choiceId,
    narration: { zh: 'n', en: 'n' }, confidantAdvice: { zh: 'a', en: 'a' }, createdAt: '2026-06-27',
  }
}

describe('destiny store', () => {
  beforeEach(() => localStorage.clear())

  it('appends and loads entries', () => {
    appendJournalEntry(mk('fan-yang-755', 'flee-south'))
    expect(loadJournal()).toHaveLength(1)
  })

  it('getEntryForEvent finds by event', () => {
    appendJournalEntry(mk('fan-yang-755', 'flee-south'))
    expect(getEntryForEvent('fan-yang-755')?.choiceId).toBe('flee-south')
    expect(getEntryForEvent('nope')).toBeUndefined()
  })
})
```

- [ ] **Step 6: Run to verify fail**

```bash
npm test -- tests/store/destiny.test.ts
```
Expected: FAIL — module not found.

- [ ] **Step 7: Create `src/store/destiny.ts`**

```ts
import type { JournalEntry } from '../lib/types'

const KEY = 'yal.journal'

export function loadJournal(): JournalEntry[] {
  const raw = localStorage.getItem(KEY)
  return raw ? (JSON.parse(raw) as JournalEntry[]) : []
}

export function appendJournalEntry(entry: JournalEntry): void {
  const list = loadJournal()
  list.push(entry)
  localStorage.setItem(KEY, JSON.stringify(list))
}

export function getEntryForEvent(eventId: string): JournalEntry | undefined {
  return loadJournal().find((e) => e.eventId === eventId)
}
```

- [ ] **Step 8: Run test to verify pass**

```bash
npm test -- tests/store/destiny.test.ts
```
Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add src/store tests/store
git commit -m "feat: persona and journal local-storage stores"
```

---

## Task 9: Recall-layer UI — DailyFork (三选一, irreversible)

**Files:**
- Create: `src/components/DailyFork.vue`, `src/composables/useDailyEvent.ts`
- Modify: `src/App.vue`, `src/i18n/locales/zh.ts`, `src/i18n/locales/en.ts`

**Interfaces:**
- Consumes: `getDailyEvent`, `submitChoice`, `generateFateCard`, `getDeviceId`.
- Produces: a view that shows today's event, three choice buttons; on click, locks the choice, submits to aggregate, generates a fate card, and emits the card upward for display.

- [ ] **Step 1: Create `src/composables/useDailyEvent.ts`**

```ts
import { ref } from 'vue'
import { getDailyEvent } from '../data/events'
import type { HistoricalEvent } from '../lib/types'

export function useDailyEvent() {
  // YYYY-MM-DD in UTC, so the whole world shares one fork per day.
  const today = new Date().toISOString().slice(0, 10)
  const event = ref<HistoricalEvent>(getDailyEvent(today))
  return { event, today }
}
```

- [ ] **Step 2: Add i18n keys to `src/i18n/locales/zh.ts`**

```ts
export default {
  app: { title: '你的古代人生', tagline: '每天,全人类一起走进中国历史的同一个岔路口。' },
  fork: {
    today: '今日岔路口',
    choose: '你的抉择',
    locked: '已落定,不可撤回',
    generating: '命运正在展开…',
  },
  nav: { recall: '今日', depth: '我的人生', lang: 'EN' },
}
```

- [ ] **Step 3: Add i18n keys to `src/i18n/locales/en.ts`**

```ts
export default {
  app: { title: 'Your Ancient Life', tagline: 'Every day, the world steps into the same fork of Chinese history.' },
  fork: {
    today: "Today's Fork",
    choose: 'Your choice',
    locked: 'Sealed — irreversible',
    generating: 'Fate is unfolding…',
  },
  nav: { recall: 'Today', depth: 'My Life', lang: '中文' },
}
```

- [ ] **Step 4: Create `src/components/DailyFork.vue`**

```vue
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
const card = ref<FateCard | null>(null)
const emit = defineEmits<{ (e: 'card', card: FateCard): void }>()

async function choose(choiceId: string) {
  if (lockedChoice.value) return
  lockedChoice.value = choiceId
  loading.value = true
  try {
    await submitChoice(event.value.id, choiceId, getDeviceId())
    const c = await generateFateCard(event.value, choiceId, locale.value as 'zh' | 'en')
    card.value = c
    emit('card', c)
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

    <p v-if="lockedChoice" class="mt-4 text-sm text-seal">{{ loading ? t('fork.generating') : t('fork.locked') }}</p>
  </section>
</template>
```

- [ ] **Step 5: Rewrite `src/App.vue` to host the recall view + locale toggle**

```vue
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
```

- [ ] **Step 6: Verify in dev**

```bash
npm run dev
```
Expected: Today's fork renders; clicking a choice locks the buttons and (with `VITE_OPENAI_API_KEY` set) generates a card. Without a key, the network call errors gracefully (acceptable for now — UI still locks).

- [ ] **Step 7: Commit**

```bash
git add src
git commit -m "feat: recall layer — daily fork, irreversible choice, fate-card trigger"
```

> Note: `FateCard.vue` and `GroupResult.vue` are referenced in App.vue and created in the next two tasks. The app won't fully build until Task 11; that's expected. Run `npm run dev` (no type-check) to view.

---

## Task 10: Fate-card UI + share

**Files:**
- Create: `src/components/FateCard.vue`
- Modify: `src/i18n/locales/zh.ts`, `src/i18n/locales/en.ts`

**Interfaces:**
- Consumes: `FateCard` prop.

- [ ] **Step 1: Add i18n keys**

Append to `src/i18n/locales/zh.ts` (merge into the `default` object):

```ts
  card: { title: '命运卡', share: '分享', copied: '已复制', footnote: '史实注脚' },
```

Append to `src/i18n/locales/en.ts`:

```ts
  card: { title: 'Fate Card', share: 'Share', copied: 'Copied', footnote: 'Historical note' },
```

- [ ] **Step 2: Create `src/components/FateCard.vue`**

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { FateCard } from '../lib/types'

const props = defineProps<{ card: FateCard }>()
const { t, locale } = useI18n()
const copied = ref(false)

async function share() {
  const text = `${props.card.outcome[locale]}\n\n— ${props.card.footnote[locale]}`
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
```

- [ ] **Step 3: Verify in dev**

```bash
npm run dev
```
Expected: After choosing, the fate card renders with share button.

- [ ] **Step 4: Commit**

```bash
git add src/components/FateCard.vue src/i18n
git commit -m "feat: fate-card component with share/copy"
```

---

## Task 11: Group-result UI + next-day reveal logic

**Files:**
- Create: `src/components/GroupResult.vue`
- Modify: `src/i18n/locales/zh.ts`, `src/i18n/locales/en.ts`

**Interfaces:**
- Consumes: `fetchGroupResult`, `getDailyEvent`.

- [ ] **Step 1: Add i18n keys**

Append to zh:
```ts
  group: { title: '世人抉择', total: '共 {n} 人', pct: '{p}%', pending: '群体结果次日揭晓' },
```
Append to en:
```ts
  group: { title: 'How the World Chose', total: '{n} people', pct: '{p}%', pending: 'Group results revealed tomorrow' },
```

- [ ] **Step 2: Create `src/components/GroupResult.vue`**

```vue
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
```

- [ ] **Step 3: Verify build now type-checks**

```bash
npm run build
```
Expected: `vue-tsc --noEmit && vite build` succeeds and `vite build` produces `dist/`. (This is the first task where all referenced components — `FateCard`, `GroupResult` — exist, so a full build passes here for the first time.)

- [ ] **Step 4: Commit**

```bash
git add src/components/GroupResult.vue src/i18n
git commit -m "feat: group-result view with next-day reveal fallback"
```

---

## Task 12: Depth-layer UI — persona creation

**Files:**
- Create: `src/components/PersonaCreate.vue`
- Modify: `src/App.vue` (add view switch Today / My Life), `src/i18n/locales/zh.ts`, `src/i18n/locales/en.ts`

**Interfaces:**
- Consumes: `createPersona`, `hasPersona`, `loadPersona`.

- [ ] **Step 1: Add i18n keys**

Append to zh:
```ts
  persona: {
    createTitle: '降生', nameLabel: '名', birthplaceLabel: '出生地', backgroundLabel: '出身',
    confidantLabel: '知己原型', create: '开启此生', hermit: '隐士', historian: '太史', poet: '词客', strategist: '谋臣', monk: '禅师',
  },
```
Append to en:
```ts
  persona: {
    createTitle: 'Be Born', nameLabel: 'Name', birthplaceLabel: 'Birthplace', backgroundLabel: 'Background',
    confidantLabel: 'Confidant archetype', create: 'Begin this life', hermit: 'Hermit', historian: 'Historian', poet: 'Poet', strategist: 'Strategist', monk: 'Monk',
  },
```

- [ ] **Step 2: Create `src/components/PersonaCreate.vue`**

```vue
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
```

- [ ] **Step 3: Update `src/App.vue` to switch views**

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import DailyFork from './components/DailyFork.vue'
import FateCard from './components/FateCard.vue'
import GroupResult from './components/GroupResult.vue'
import PersonaCreate from './components/PersonaCreate.vue'
import DestinyJournal from './components/DestinyJournal.vue'
import type { FateCard } from './lib/types'
import { useDailyEvent } from './composables/useDailyEvent'
import { hasPersona } from './store/persona'

const { t, locale } = useI18n()
const { event } = useDailyEvent()
const card = ref<FateCard | null>(null)
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
```

- [ ] **Step 4: Verify in dev**

```bash
npm run dev
```
Expected: "My Life" tab shows persona creation; submitting switches back to Today.

- [ ] **Step 5: Commit**

```bash
git add src
git commit -m "feat: depth layer — persona creation and view switching"
```

> `DestinyJournal.vue` is created in the next task; the build will not pass `vue-tsc` until then. Use `npm run dev` to view in the meantime.

---

## Task 13: Depth-layer UI — DestinyJournal (today's fork → private life + confidant + narration)

**Files:**
- Create: `src/components/DestinyJournal.vue`, `src/components/ConfidantAdvice.vue`
- Modify: `src/i18n/locales/zh.ts`, `src/i18n/locales/en.ts`

**Interfaces:**
- Consumes: `getDailyEvent`, `getEntryForEvent`, `appendJournalEntry`, `loadPersona`, `getConfidantAdvice`, `narrateJournalEntry`.
- This is where "one question, two uses" lands: today's global fork is also the private event the persona faces.

- [ ] **Step 1: Add i18n keys**

Append to zh:
```ts
  journal: { title: '我的古代人生', todayQuestion: '今日,你面临:', decide: '落定', sealed: '此节已写入卷轴', adviceTitle: '知己曰', entryTitle: '分身日记' },
```
Append to en:
```ts
  journal: { title: 'My Ancient Life', todayQuestion: 'Today, you face:', decide: 'Seal your choice', sealed: 'This chapter is written into your scroll', adviceTitle: 'Your confidant says', entryTitle: 'Journal' },
```

- [ ] **Step 2: Create `src/components/ConfidantAdvice.vue`**

```vue
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
```

- [ ] **Step 3: Create `src/components/DestinyJournal.vue`**

```vue
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
```

- [ ] **Step 4: Verify full build type-checks**

```bash
npm run build
```
Expected: `vue-tsc --noEmit` passes and `vite build` produces `dist/`.

- [ ] **Step 5: Run all tests**

```bash
npm test
```
Expected: all PASS.

- [ ] **Step 6: Commit**

```bash
git add src
git commit -m "feat: depth layer — daily fork written into private life with confidant + narration"
```

---

## Task 14: Final polish, env docs, build verification

**Files:**
- Create: `.env.example`
- Modify: `CLAUDE.md` (note new commands), `README.md` (replace stale content)
- Modify: `vite.config.ts` (none needed) — verify `base: './'`

**Interfaces:** none.

- [ ] **Step 1: Create `.env.example`**

```bash
# OpenAI-compatible chat API (client-side; use a restricted/proxy key in production)
VITE_OPENAI_API_KEY=
VITE_OPENAI_BASE_URL=https://api.openai.com/v1

# Aggregate worker URL (Cloudflare Workers + KV)
VITE_AGGREGATE_URL=https://yal-aggregate.workers.dev
```

- [ ] **Step 2: Update `README.md`** (replace stale AI 萌新小窝 content)

```markdown
# 你的古代人生 / Your Ancient Life

An AI + gamified platform that lets global users live inside real ancient Chinese history. Every day the world faces one historical fork; your irreversible choice is written into a private life-scroll by an AI confidant. Bilingual zh/en.

## Develop

```bash
npm install
npm run dev      # vite dev server
npm test         # vitest run
npm run build    # vue-tsc --noEmit && vite build → dist/
npm run preview  # preview dist/
```

Copy `.env.example` to `.env` and fill in `VITE_OPENAI_API_KEY`.

## Architecture

- `src/data/events/` — historical event library (Tang 天宝年间 first). One `getDailyEvent(date)` feeds both layers.
- Recall layer (`src/components/DailyFork.vue`, `FateCard.vue`, `GroupResult.vue`): daily global fork, irreversible choice, shareable fate card, group reveal.
- Depth layer (`PersonaCreate.vue`, `DestinyJournal.vue`, `ConfidantAdvice.vue`): private persona + AI confidant + journal, stored locally.
- `workers/aggregate/` — Cloudflare Worker + KV counting global choices only.
- `src/ai/` — injectable OpenAI-compatible client + pure prompt builders + fate-card/confidant/narration generators.

See `docs/superpowers/specs/2026-06-27-ancient-life-v4-design.md` for the design.
```

- [ ] **Step 3: Update `CLAUDE.md` Commands section** — replace the block noting "no test framework":

Find:
```
No linter, no test framework is configured. Windows: use plain `npm` — there is no Python in the current build (the old `py generate_feeds.py` / `build_manifest.py` steps are gone).
```
Replace with:
```
Tests: `npm test` (Vitest). No linter. Windows: use plain `npm`.
```

- [ ] **Step 4: Final full verification**

```bash
npm test
npm run build
```
Expected: tests pass; build produces `dist/index.html` + assets with relative paths.

- [ ] **Step 5: Commit**

```bash
git add .env.example README.md CLAUDE.md
git commit -m "docs: env example, refresh README and CLAUDE commands for v4 MVP"
```

---

## Self-Review Notes

- **Spec coverage:** recall layer (Tasks 9–11), depth layer minimal loop (Tasks 12–13), shared event library (Task 3), aggregate worker (Task 4), AI core (Tasks 5–7), bilingual (Tasks 2, 9–13), local storage (Task 8). Rebirth layer explicitly out of MVP (spec §6) — not implemented, data structures (`loadJournal`, persona) reserved. ✅
- **Type consistency:** `getDailyEvent` returns `HistoricalEvent` everywhere; `FateCard`, `JournalEntry`, `GroupResult`, `Persona` defined once in `types.ts` and reused. `chat`/`ChatOptions` consistent across `fateCard`/`confidant`/`narration`. ✅
- **Known Vue ref-unwrapping:** templates use `event.X` (auto-unwrapped), scripts use `event.value.X`. Verified consistent across Tasks 9, 11, 12, 13. ✅
- **Placeholder scan:** no TBD/TODO; every code step has real code. ✅
