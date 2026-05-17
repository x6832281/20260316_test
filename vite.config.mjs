import { defineConfig } from 'vite'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  root: 'src',
  base: '/',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'src/index.html'),
        article: resolve(__dirname, 'src/article.html'),
        board: resolve(__dirname, 'src/board.html'),
        ai: resolve(__dirname, 'src/ai.html'),
        game: resolve(__dirname, 'src/game.html'),
        resource: resolve(__dirname, 'src/resource.html'),
        webnovel: resolve(__dirname, 'src/webnovel.html'),
        newbie: resolve(__dirname, 'src/newbie.html'),
        deai: resolve(__dirname, 'src/deai.html'),
        knowledge: resolve(__dirname, 'src/knowledge.html'),
        littheory: resolve(__dirname, 'src/littheory.html'),
        'book-analysis': resolve(__dirname, 'src/book-analysis.html'),
        'book-excerpts': resolve(__dirname, 'src/book-excerpts.html'),
        'famous-books': resolve(__dirname, 'src/famous-books.html'),
        'famous-people': resolve(__dirname, 'src/famous-people.html'),
        'skill-evolution': resolve(__dirname, 'src/skill-evolution.html'),
        debate: resolve(__dirname, 'src/debate.html'),
        faq: resolve(__dirname, 'src/faq.html'),
        glossary: resolve(__dirname, 'src/glossary.html'),
        disclaimer: resolve(__dirname, 'src/disclaimer.html'),
        backup: resolve(__dirname, 'src/backup.html'),
        'ai-writing': resolve(__dirname, 'src/ai-writing.html'),
      }
    }
  }
})
